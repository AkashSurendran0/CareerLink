"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Mic, MicOff, Phone, Volume2, VolumeX } from "lucide-react"
import { userSocket } from "@/lib/socket"
import Image from "next/image"

interface Props {
    params: Promise<{ callId: string }>
}

interface CallDetails {
    name: string;
    image: string;
    convoId: string;
}

export default function VoiceCall({ params }: Props) {
    const callId = (params as unknown as { callId: string }).callId
    const [callDuration, setCallDuration] = useState(0)
    const [userLeft, setUserLeft] = useState(false)
    const [muteSpeaker, setMuteSpeaker] = useState(false)
    const [callDetails, setCallDetails] = useState<CallDetails | null>(null)
    const [mikeMuted, setMikeMuted] = useState(false)
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
    const pendingCandidates = useRef<RTCIceCandidate[]>([])
    const isNegotiating = useRef(false)
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!callId) return

        const raw = sessionStorage.getItem(`${callId}`)
        if (!raw) return
        const { name, image, convoId } = JSON.parse(raw)
        const data = {
            name,
            image, 
            convoId
        }
        setCallDetails(data)

        return () => {
            sessionStorage.removeItem(`${callId}`)
        }
    }, [callId])

    const initializeWebRTC = useCallback(async () => {
        if (pcRef.current || !callId) return

        console.log('Inititalizing webrtc..')

        try {
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:stun.l.google.com:19302" },
                    { urls: "stun:stun1.l.google.com:19302" },
                    { urls: "stun:stun2.l.google.com:19302" }
                ]
            })
            pcRef.current = pc

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: false
            });
            localStreamRef.current = stream;

            stream.getTracks().forEach(track => {
                pc.addTrack(track, stream);
            });

            pc.ontrack = (event) => {
                console.log('Remote track received!', event.streams[0]);
                if (remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = event.streams[0];
                    remoteAudioRef.current.muted = false;

                    remoteAudioRef.current.play().catch(err => {
                        console.log('Auto-play blocked, user interaction required:', err);
                    });
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
            isInitialized.current = false;
            isNegotiating.current = false;
        };
    }, [callId, initializeWebRTC])

    useEffect(() => {
        if (!callId || !pcRef.current) return;

        const pc = pcRef.current;

        const handleCreateOffer = async () => {
            console.log('Creating offer...');

            if (pc.signalingState !== 'stable' || isNegotiating.current) {
                console.warn('Cannot create offer, state:', pc.signalingState);
                return;
            }

            try {
                isNegotiating.current = true;
                const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: false
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
        if (remoteAudioRef.current) {
            remoteAudioRef.current.muted = muteSpeaker;
        }
    }, [muteSpeaker]);

    useEffect(() => {
        // Create audio element for remote audio
        const audioEl = new Audio();
        audioEl.autoplay = true;
        audioEl.autoplay = true;
        // @ts-expect-error playsInline might not be in definition
        audioEl.playsInline = true;
        audioEl.muted = false;

        // Store in ref
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
        const formattedDuration=formatTime(callDuration)
        localStreamRef.current?.getTracks().forEach(t => t.stop())
        pcRef.current?.close()
        const convoId = callDetails?.convoId
        userSocket.emit("end-call", { callId, formattedDuration, convoId })
        sessionStorage.removeItem(`${callId}`)
        window.history.back()
    }

    return (

        <main className="flex flex-1 flex-col items-center justify-center p-4 mt-15">
            <div className="mb-8 text-center">
                <p className="text-lg text-gray-600">{formatTime(callDuration)}</p>
            </div>

            <div className="mb-12 flex flex-col items-center">
                {callDetails && (
                    callDetails.image ? (
                        <Image
                            height={300}
                            width={300}
                            src={callDetails.image}
                            className="mb-6 flex h-40 w-40 items-center justify-center rounded-full shadow-2xl md:h-48 md:w-48"
                            alt={callDetails.name}
                        />
                    ) : (
                        <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl md:h-48 md:w-48">
                            <span className="text-4xl font-bold text-white md:text-5xl">{callDetails.name[0].toUpperCase()}</span>
                        </div>
                    )
                )}
                {callDetails && (
                    <h2 className="text-2xl font-semibold text-gray-800 md:text-3xl">{callDetails.name}</h2>
                )}
                {userLeft ? (
                    <p className="mt-2 text-red-500">User Disconnected</p>
                ) : (
                    <p className="mt-2 text-gray-500">Voice Call</p>
                )}
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button
                    onClick={toggleMic}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${mikeMuted
                            ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {mikeMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 md:h-20 md:w-20"
                >
                    <Phone className="h-6 w-6 rotate-[135deg] md:h-8 md:w-8" />
                </button>

                <button
                    onClick={() => setMuteSpeaker(!muteSpeaker)}
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${muteSpeaker
                            ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    {muteSpeaker ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>
            </div>
        </main>
    )
}   
