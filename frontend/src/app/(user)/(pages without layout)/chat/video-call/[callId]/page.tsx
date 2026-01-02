
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Mic, MicOff, Phone, Video, VideoOff, Volume2, VolumeX } from "lucide-react"
import { userSocket } from "@/lib/socket"
import { Avatar } from "@mui/material"

interface Props {
    params: Promise<{ callId: string }>
}

interface CallDetails {
    name: string;
    image: string;
}

export default function VoiceCall({ params }: Props) {
    const callId = (params as unknown as { callId: string }).callId
    const [callDuration, setCallDuration] = useState(0)
    const [userLeft, setUserLeft] = useState(false)
    const [muteSpeaker, setMuteSpeaker] = useState(false)
    const [callDetails, setCallDetails] = useState<CallDetails | null>(null)
    const [mikeMuted, setMikeMuted] = useState(false)
    const [cameraOn, setCameraOn] = useState(true)
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
    const pendingCandidates = useRef<RTCIceCandidate[]>([])
    const isNegotiating = useRef(false)
    const isInitialized = useRef(false);
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const remoteStreamRef = useRef<MediaStream | null>(null)
    const [hasLocalVideo, setHasLocalVideo] = useState(false)

    useEffect(() => {
        if (!callId) return

        const raw = sessionStorage.getItem(`${callId}`)
        if (!raw) return
        const { name, image } = JSON.parse(raw)
        const data = {
            name,
            image
        }
        setCallDetails(data)

        return () => {
            sessionStorage.removeItem(`${callId}`)
        }
    }, [callId])

    const initializeWebRTC = useCallback(async () => {
        if (!callId || isInitialized.current) return

        console.log('Inititalizing webrtc..')

        if (pcRef.current) {
            pcRef.current.close()
            pcRef.current = null
        }

        try {
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    { urls: "stun:stun2.l.google.com:19302" }
                ]
            })
            pcRef.current = pc

            let localStream: MediaStream | null = null
            try {
                // Try with ideal constraints first
                localStream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    },
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user",
                    }
                });
            } catch (error) {
                console.warn('First attempt failed, trying lower resolution:', error);

                // Try with minimal constraints
                try {
                    localStream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: {
                            width: { min: 320, ideal: 640 },
                            height: { min: 240, ideal: 480 },
                            facingMode: "user"
                        }
                    });
                } catch (secondError) {
                    console.warn('Second attempt failed, asking user:', secondError);

                    // Let user decide
                    const userChoice = window.confirm(
                        'Camera access is required for video call.\n\n' +
                        'Click OK to try audio-only call, or Cancel to end call.'
                    );

                    if (userChoice) {
                        localStream = await navigator.mediaDevices.getUserMedia({
                            audio: true,
                            video: false
                        });
                    } else {
                        throw new Error('Camera access required');
                    }
                }
            }
            if (!localStream) {
                throw new Error('No media stream available')
            }

            localStreamRef.current = localStream;

            const hasVideo = localStream.getVideoTracks().length > 0
            setHasLocalVideo(hasVideo)
            console.log('Local stream obtained:', {
                hasVideo: hasVideo,
                hasAudio: localStreamRef.current.getAudioTracks().length > 0,
                videoTrack: localStreamRef.current.getVideoTracks()[0]?.label
            });
            if (localVideoRef.current && hasVideo) {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.play().catch(err => {
                    console.log('Local video play error:', err)
                })
            }

            localStream.getTracks().forEach(track => {
                if (pc.signalingState !== 'closed') {
                    pc.addTrack(track, localStream!)
                    console.log(`Added ${track.kind} track`)
                } else {
                    console.warn(`Cannot add ${track.kind} track - connection closed`)
                }
            });

            pc.ontrack = (event) => {
                console.log('Remote track received!', event.streams[0]);

                // Create or update remote stream
                if (!remoteStreamRef.current) {
                    remoteStreamRef.current = new MediaStream();
                }

                // Add incoming track to remote stream
                remoteStreamRef.current.addTrack(event.track);

                // Set the same stream to both audio and video elements
                if (event.track.kind === 'audio' && remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = remoteStreamRef.current
                    remoteAudioRef.current.muted = false

                    remoteAudioRef.current.play().catch(err => {
                        console.log('Auto-play blocked:', err)
                        // Add user interaction handler
                        const handleUserInteraction = () => {
                            remoteAudioRef.current?.play()
                            document.removeEventListener('click', handleUserInteraction)
                        }
                        document.addEventListener('click', handleUserInteraction, { once: true })
                    })
                }

                // Handle video
                if (event.track.kind === 'video' && remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStreamRef.current
                }
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate');
                    userSocket.emit("ice-candidate", {
                        callId,
                        candidate: event.candidate
                    });
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log('ICE connection state:', pc.iceConnectionState);
            };

            pc.onconnectionstatechange = () => {
                console.log('Connection state:', pc.connectionState);
            };

            pc.onsignalingstatechange = () => {
                console.log('Signaling state:', pc.signalingState);
                // Reset negotiating flag when back to stable
                if (pc.signalingState === 'stable') {
                    isNegotiating.current = false;
                }
            };

            userSocket.emit("join-call", callId);
            isInitialized.current = true;
            console.log('WebRTC initialized successfully');
        } catch (error) {
            console.error('Failed to initialize WebRTC:', error);
        }
    }, [callId])

    useEffect(() => {
        if (callId && !isInitialized.current) {
            initializeWebRTC();
        }

        return () => {
            if (pcRef.current) {
                pcRef.current.close();
                pcRef.current = null;
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
            if (remoteStreamRef.current) { // Clean up remote stream
                remoteStreamRef.current.getTracks().forEach(track => track.stop());
                remoteStreamRef.current = null;
            }
            isInitialized.current = false;
            isNegotiating.current = false;
            pendingCandidates.current = []
            setHasLocalVideo(false)
        };
    }, [callId, initializeWebRTC])

    useEffect(() => {
        if (!callId || !pcRef.current) return;

        const pc = pcRef.current;

        const handleCreateOffer = async () => {
            console.log('Creating offer...');
            await new Promise(resolve => setTimeout(resolve, 500))

            if (pc.signalingState !== 'stable' || isNegotiating.current) {
                console.warn('Cannot create offer, state:', pc.signalingState);
                return;
            }

            try {
                isNegotiating.current = true;
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: true
                });
                await pc.setLocalDescription(offer);

                console.log('Sending offer');
                userSocket.emit("webrtc-offer", { callId, offer });

            } catch (error) {
                console.error('Error creating offer:', error);
                isNegotiating.current = false;
            }
        };

        const handleWebRTCOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
            console.log('Received offer');

            if (pc.signalingState !== 'stable') {
                console.warn('Cannot handle offer, state:', pc.signalingState);
                return;
            }

            try {
                isNegotiating.current = true;
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                console.log('Remote description set');

                // Process pending ICE candidates
                const candidates = [...pendingCandidates.current];
                pendingCandidates.current = [];
                for (const candidate of candidates) {
                    try {
                        await pc.addIceCandidate(candidate);
                    } catch (err) {
                        console.warn('Failed to add ICE candidate:', err);
                    }
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                console.log('Created and set local answer');

                userSocket.emit("webrtc-answer", { callId, answer });

            } catch (error) {
                console.error('Error handling offer:', error);
                isNegotiating.current = false;
            }
        };

        const handleWebRTCAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log('Received answer');

            if (pc.signalingState !== 'have-local-offer') {
                console.warn('Unexpected answer, state:', pc.signalingState);
                return;
            }

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
                console.log('Remote description (answer) set');

                // Process pending ICE candidates
                const candidates = [...pendingCandidates.current];
                pendingCandidates.current = [];
                for (const candidate of candidates) {
                    try {
                        await pc.addIceCandidate(candidate);
                    } catch (err) {
                        console.warn('Failed to add ICE candidate:', err);
                    }
                }

            } catch (error) {
                console.error('Error handling answer:', error);
            }
        };

        const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            console.log('Received ICE candidate');

            try {
                if (pc.remoteDescription) {
                    await pc.addIceCandidate(candidate);
                    console.log('ICE candidate added');
                } else {
                    pendingCandidates.current.push(new RTCIceCandidate(candidate));
                    console.log('ICE candidate queued');
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        };

        const handleEndCall = ({ reason }: { reason: string }) => {
            console.log('Call ended:', reason);

            if (reason === 'USER_LEFT') {
                setUserLeft(true);
            }

            setTimeout(() => {
                window.history.back();
            }, 1000);
        };

        userSocket.on("create-offer", handleCreateOffer);
        userSocket.on("webrtc-offer", handleWebRTCOffer);
        userSocket.on("webrtc-answer", handleWebRTCAnswer);
        userSocket.on("ice-candidate", handleIceCandidate);
        userSocket.on("end-call", handleEndCall);

        return () => {
            userSocket.off("create-offer", handleCreateOffer);
            userSocket.off("webrtc-offer", handleWebRTCOffer);
            userSocket.off("webrtc-answer", handleWebRTCAnswer);
            userSocket.off("ice-candidate", handleIceCandidate);
            userSocket.off("end-call", handleEndCall);
        };

    }, [callId])

    useEffect(() => {
        if (localVideoRef.current && localStreamRef.current && hasLocalVideo) {
            console.log('Updating local video preview');
            localVideoRef.current.srcObject = localStreamRef.current;
            localVideoRef.current.play().catch(console.error);
        }
    }, [hasLocalVideo])

    useEffect(() => {
        if (remoteAudioRef.current) {
            remoteAudioRef.current.muted = muteSpeaker;
        }
    }, [muteSpeaker]);

    useEffect(() => {
        // Create audio element for remote audio
        const audioEl = new Audio();
        audioEl.autoplay = true;
        remoteAudioRef.current = audioEl;

        return () => {
            if (audioEl) {
                audioEl.pause();
                audioEl.srcObject = null;
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (pcRef.current) {
                console.log('WebRTC Status:', {
                    signalingState: pcRef.current.signalingState,
                    iceConnectionState: pcRef.current.iceConnectionState,
                    connectionState: pcRef.current.connectionState,
                    isNegotiating: isNegotiating.current,
                    hasLocalStream: !!localStreamRef.current,
                    hasRemoteStream: remoteAudioRef.current?.srcObject ? true : false
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const toggleCamera = () => {
        // const tracks=
        localStreamRef.current?.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled
        })

        setCameraOn(!cameraOn)
    }

    const toggleMic = () => {
        const tracks = localStreamRef.current?.getAudioTracks()
        if (!tracks) return

        tracks.forEach(track => {
            track.enabled = mikeMuted
        })

        setMikeMuted(!mikeMuted)
    }


    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCallDuration((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const handleEndCall = () => {
        localStreamRef.current?.getTracks().forEach(t => t.stop())
        pcRef.current?.close()
        userSocket.emit("end-call", { callId })
        sessionStorage.removeItem(`${callId}`)
        window.history.back()
    }

    return (

        <main className="flex flex-1 flex-col items-center justify-center p-4 lg:mt-30">
            {/* Call Timer */}
            <div className="mb-4 text-center">
                <p className="text-lg text-gray-300">{formatTime(callDuration)}</p>
            </div>

            {/* Video Grid */}
            <div className="mb-6 w-full max-w-8xl">
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                    {/* Participant 1 */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-300 to-orange-400 shadow-2xl">
                        <div className="absolute left-4 top-4 z-10 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                            {callDetails && (
                                <p className="text-sm font-medium text-white">{callDetails.name}</p>
                            )}
                        </div>
                        <div className="aspect-video w-full">
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="h-full w-full object-cover object-top"
                            />
                            {/* <img
                    src="/images/meet.png"
                    alt="Sophia Clark"
                    className="h-full w-full object-cover object-top"
                    style={{ objectPosition: "center 20%" }}
                    /> */}
                        </div>
                    </div>

                    {/* Participant 2 (You) */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 to-amber-300 shadow-2xl">
                        <div className="absolute left-4 top-4 z-10 rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                            <p className="text-sm font-medium text-white">You</p>
                        </div>
                        <div className="aspect-video w-full">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`h-full w-full object-cover object-top ${cameraOn ? 'block' : 'hidden'}`}
                            />
                            {cameraOn ? null : (
                                <div className="h-full w-full object-cover object-top bg-gray-900 rounded-lg flex items-center justify-center">
                                    <Avatar />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Call Controls */}
            <div className="flex items-center gap-3 md:gap-4">
                {/* Mute Button */}
                <button
                    onClick={toggleMic}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors md:h-14 md:w-14 ${mikeMuted
                        ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                        : "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                >
                    {mikeMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                {/* Video Button */}
                <button
                    onClick={toggleCamera}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors md:h-14 md:w-14 ${!cameraOn
                        ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                        : "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                >
                    {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>

                <button
                    onClick={() => setMuteSpeaker(!muteSpeaker)}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${muteSpeaker
                        ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                        : "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                >
                    {muteSpeaker ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>

                {/* End Call Button */}
                <button
                    onClick={handleEndCall}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 md:h-16 md:w-16"
                >
                    <Phone className="h-6 w-6 rotate-[135deg]" />
                </button>
            </div>
        </main>
    )
}

