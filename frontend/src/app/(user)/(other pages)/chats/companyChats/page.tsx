"use client"

import { useEffect, useState } from "react"
import { Search, Phone, Video, Send, Paperclip, X, CheckCheck, User, LoaderIcon } from "lucide-react"
import { getCompanyConversations, getCompanyInfo, getCompanyRegistrationInfo, getConversations, getUserChats, getUserDetails, scheduleCall, sendMessage, sendRemindMail, sendScheduleMail } from "@/services/userService"
import Image from "next/image"
import { userSocket } from "@/lib/socket"
import { useLoading } from "@/app/(user)/template"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"
import { CallOptionsPopup } from "@/reusable-components/companyCallOptions"
import { ScheduleCallModal } from "@/reusable-components/scheduleCallModal"
import { ScheduledMeetingMessage } from "@/reusable-components/scheduleMeetingMessage"

interface Conversation {
    _id: string;
    user: string;
    username: string;
    pfp?: string;
    online?: boolean;
    email: string;
    lastMessage?: {
        content?: {
            message: string;
            isRead: boolean;
        };
    };
}

interface Message {
    _id: string;
    sendBy: string;
    sender: string;
    message: string;
    isRead: boolean;
    date: string;
    time: string;
    isScheduleMessage?: boolean;
    timestamp?: string;
}

interface UserChats {
    content: Message[];
}

interface CompanyDetails {
    name: string;
    logo?: string;
    approved: boolean;
    rejected: boolean;
    suspended: boolean;
    id: string;
}

export default function ChatsPage() {
    const setLoading = useLoading()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
    const [messageInput, setMessageInput] = useState("")
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [chatLoading, setChatLoading] = useState(false)
    const [userChats, setUserChats] = useState<UserChats | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [companyOwnerId, setCompanyOwnerId] = useState<string | null>(null)
    const [companyExists, setCompanyExists] = useState(false)
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)
    const [callOptionsModal, setCallOptionsModal] = useState(false)
    const [callScheduleModal, setCallScheduleModal] = useState(false)

    useEffect(() => {
        fetchUserId()
    }, [])

    useEffect(() => {
        userSocket.on('call-failed', ({ reason }) => {

            if (reason == 'USER_OFFLINE') {
                enqueueSnackbar('User is offline, please try again later', { variant: 'error' })
            }

            if (reason == 'USER_BUSY') {
                enqueueSnackbar('User is on another call right now, please try after some time', { variant: 'error' })
            }

            if (reason == 'IN_ANOTHER_CALL') {
                enqueueSnackbar('You are already in another call, please try after cancelling the current call', { variant: 'error' })
            }

        })

        return () => {
            userSocket.off('call-failed')
        }
    }, [])

    useEffect(() => {
        if (!selectedConvo || !userId) return

        userSocket.emit("join-conversation", {
            convoId: selectedConvo,
            userId
        })

        return () => {
            userSocket.emit("leave-conversation", selectedConvo)
        }
    }, [selectedConvo, userId])

    useEffect(() => {
        const handler = ({ convoId }: { convoId: string }) => {
            if (convoId !== selectedConvo) return;

            setUserChats((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    content: prev.content.map((msg) => {
                        // Mark as read ONLY:
                        // 1. I sent the message
                        // 2. Someone else read it
                        if (msg.sendBy == userId) {
                            return { ...msg, isRead: true };
                        }
                        return msg;
                    })
                };
            });
        };

        userSocket.on("messages-read", handler);

        return () => {
            userSocket.off("messages-read", handler);
        };
    }, [selectedConvo, userId]);


    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        // ask for online users from server
        userSocket.emit("get-online-users");

        const handler = (onlineUsers: string[]) => {
            setConversations((prev) =>
                prev.map((user) =>
                    onlineUsers.includes(user.user)
                        ? { ...user, online: true }
                        : { ...user, online: false }
                )
            );
        };

        userSocket.on("online-users", handler);

        return () => {
            userSocket.off("online-users", handler);
        };
    }, [conversations]);

    useEffect(() => {
        const receiveHandler = (message: UserChats, convoId: string) => {
            if (selectedConvo == convoId) {
                if (!userChats) {
                    setUserChats(message)
                } else {
                    const lastMessage = message?.content[message?.content?.length - 1]
                    setUserChats((prev) => prev ? ({
                        ...prev,
                        content: [...prev.content, lastMessage]
                    }) : null)
                }
            }
        }

        userSocket.on('receive-message', receiveHandler)

        return () => {
            userSocket.off("receive-message", receiveHandler);
        }
    }, [selectedConvo])

    useEffect(() => {
        getCompanyDetails()
    }, [])

    const getCompanyDetails = async () => {
        const result = await getCompanyRegistrationInfo()
        setCompanyExists(result.result.success)
        if (result.result.success) {
            const details = await getCompanyInfo()
            setCompanyDetails(details.result)
            setUserId(details.result.id)
            const result = await getCompanyConversations(details.result.id)
            setConversations(result.result)
        }
    }

    const setUserAndConvo = async (convo: Conversation) => {
        setChatLoading(true)
        setSelectedConvo(convo._id)
        setSelectedUserId(convo.user)
        const result = await getUserChats(convo._id)
        setUserChats(result.result)
        setChatLoading(false)
    }

    const selectedUser = conversations?.find(
        (c) => c.user === selectedUserId
    );

    const handleSendMessage = async () => {
        if (messageInput.trim() && selectedUser && selectedConvo) {
            const data = {
                convoId: selectedConvo,
                message: messageInput
            }
            const result = await sendMessage(data, userId!)
            const lastMessage = result.result?.content[result.result?.content?.length - 1]
            if (!userChats) {
                setUserChats(result.result)
            } else {
                setUserChats((prev) => prev ? ({
                    ...prev,
                    content: [...prev.content, lastMessage]
                }) : null)
            }

            userSocket.emit("send-message", {
                convoId: selectedConvo,
                message: result.result,
                userId
            })
            setMessageInput("")
        }
    }

    const routeToChatPage = async () => {
        setLoading(true)
        router.push('/chats')
    }

    const fetchUserId = async () => {
        try {
            const res = await fetch('/api/me')
            const data = await res.json()
            setCompanyOwnerId(data.userId)
        } catch (error) {
            console.log('Failed to fetch userid', error)
        }
    }

    const voiceCallUser = async () => {
        if (!selectedUserId) return
        userSocket.emit('ring-call', {
            from: companyOwnerId,
            caller: companyDetails?.name || "Unknown",
            callerImage: companyDetails?.logo || null,
            to: selectedUser?.user,
            reciever: selectedUser?.username,
            callType: 'voice-call'
        })
    }

    const videoCallUser = async () => {
        if (!selectedUser) return

        userSocket.emit('ring-call', {
            from: companyOwnerId,
            caller: companyDetails?.name || "Unknown",
            callerImage: companyDetails?.logo || null,
            to: selectedUser?.user,
            reciever: selectedUser?.username,
            callType: 'video-call'
        })
    }

    const openScheduleModal = async () => {
        setCallOptionsModal(false)
        setCallScheduleModal(true)
    }

    const scheduleMeeting = async (date: Date, time: string) => {
        const data = {
            convoId: selectedConvo,
            date,
            time
        }
        const result = await scheduleCall(data, userId)
        const lastMessage = result.result?.content[result.result?.content?.length - 1]
        if (!userChats) {
            setUserChats(result.result)
        } else {
            setUserChats((prev) => prev ? ({
                ...prev,
                content: [...prev.content, lastMessage]
            }) : null)
        }

        const details = {
            userEmail: selectedUser?.email,
            userName: selectedUser?.username,
            companyName: companyDetails?.name,
            date,
            time
        }

        sendScheduleMail(details)

        userSocket.emit("send-message", {
            convoId: selectedConvo,
            message: result.result,
            userId
        })
        setCallScheduleModal(false)
    }

    const remindUser = async (date: any, time: any) => {
        const details = {
            userEmail: selectedUser?.email,
            userName: selectedUser?.username,
            companyName: companyDetails?.name,
            date,
            time
        }

        sendRemindMail(details)
        enqueueSnackbar('Reminder send', { variant: 'success' })
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {callOptionsModal && (
                <CallOptionsPopup userName={selectedUser?.username || "Unknown"} onCallNow={videoCallUser} onScheduleLater={openScheduleModal} onClose={() => setCallOptionsModal(false)} />
            )}

            {callScheduleModal && (
                <ScheduleCallModal userName={selectedUser?.username || "Unknown"} onConfirm={scheduleMeeting} onClose={() => setCallScheduleModal(false)} />
            )}

            <div className="flex-1 flex flex-col h-screen overflow-hidden">

                <div className="flex-1 flex overflow-hidden gap-4 p-4 max-w-7xl mx-auto w-full min-h-0">
                    <div
                        className={`${selectedUser ? "hidden" : "flex"} md:flex w-full md:w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex-col overflow-hidden min-h-0`}
                    >
                        <div className="flex border-b border-gray-200 flex-shrink-0">
                            <button
                                onClick={routeToChatPage}
                                className={`cursor-pointer flex-1 py-3 text-sm font-medium transition-colors text-gray-600 hover:text-gray-900`}
                            >
                                User
                            </button>
                            <button
                                className={` flex-1 py-3 text-sm font-medium transition-colors text-blue-600 border-b-2 border-blue-600`}
                            >
                                Company
                            </button>
                        </div>
                        <div className="p-4 border-b border-gray-200 flex-shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {companyExists ? (
                            companyDetails && (
                                !companyDetails.approved || companyDetails.rejected || companyDetails.suspended ? (
                                    <div className="hidden md:flex flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex-col items-center justify-center min-h-0">
                                        <div className="text-center">
                                            <div className="text-6xl mb-4">💬</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">You cannot access your company right now</h3>
                                            <p className="text-gray-500">Please reach out to support</p>
                                        </div>
                                    </div>
                                ) : (
                                    conversations && conversations.length > 0 ? (
                                        <div className="flex-1 overflow-y-auto min-h-0">
                                            {conversations.map((user) => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => setUserAndConvo(user)}
                                                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedUser?._id === user._id ? "bg-blue-50" : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="relative">
                                                            {user.pfp ? (
                                                                <Image
                                                                    height={300}
                                                                    width={300}
                                                                    src={user.pfp}
                                                                    alt={user.username}
                                                                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <User className="h-10 w-10 rounded-full object-cover" />
                                                            )}
                                                            {user.online && (
                                                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h3 className="font-medium text-gray-900 truncate">{user.username}</h3>
                                                                {/* <span className="text-xs text-gray-500 flex-shrink-0">{user.timestamp}</span> */}
                                                            </div>
                                                            <p className={`text-sm ${user?.lastMessage?.content?.isRead ? 'text-gray-500' : 'text-black'}  truncate`}>{user?.lastMessage?.content?.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="hidden md:flex flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex-col items-center justify-center min-h-0">
                                            <div className="text-center">
                                                <div className="text-6xl mb-4">💬</div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">You dont have any conversations</h3>
                                                <p className="text-gray-500">Start a conversation by messaging one of your connections</p>
                                            </div>
                                        </div>
                                    )
                                )
                            )
                        ) : (
                            <div className="hidden md:flex flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex-col items-center justify-center min-h-0">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">💬</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">You dont have a active company</h3>
                                    <p className="text-gray-500">Please register a company</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {!chatLoading && selectedUser && (
                        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-0">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    {selectedUser?.pfp ? (
                                        <Image
                                            height={300}
                                            width={300}
                                            src={selectedUser?.pfp}
                                            alt={selectedUser?.username}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-10 w-10 rounded-full object-cover" />
                                    )}
                                    <div>
                                        <h2 className="font-semibold text-gray-900">{selectedUser?.username}</h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedUser?.online && <span className="text-green-600">Online</span>}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={voiceCallUser}
                                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors md:block"
                                    >
                                        <Phone className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => setCallOptionsModal(true)}
                                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors md:block"
                                    >
                                        <Video className="h-5 w-5 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedConvo(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                                    >
                                        <X className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto min-h-0 p-4 flex flex-col-reverse">
                                <div className="space-y-4 flex flex-col">
                                    {userChats?.content && userChats.content.length > 0 ? (
                                        userChats.content.map((message) => {
                                            const isMe = message.sendBy == userId
                                            if (message.isScheduleMessage) {
                                                return (
                                                    <ScheduledMeetingMessage
                                                        key={message._id}
                                                        date={message.date}
                                                        time={message.time}
                                                        onRemind={() => remindUser(message.date, message.time)}
                                                        onCall={videoCallUser}
                                                        isMe={isMe}
                                                        isRead={message.isRead}
                                                    />
                                                )
                                            }

                                            return (

                                                <div key={message._id} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                                                    {!isMe && (
                                                        selectedUser.pfp ? (
                                                            <Image
                                                                height={300}
                                                                width={300}
                                                                src={selectedUser.pfp}
                                                                alt={selectedUser.username}
                                                                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <User className="h-10 w-10 rounded-full object-cover" />
                                                        )
                                                    )}
                                                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                                        <p className="text-xs text-gray-500 mb-1">{message.sender}</p>
                                                        <div
                                                            className={`px-4 py-2 rounded-lg max-w-xs ${isMe
                                                                ? "bg-blue-500 text-white rounded-br-none"
                                                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                                                }`}
                                                        >
                                                            <p className="text-sm whitespace-pre-line">{message.message}</p>
                                                        </div>
                                                        {isMe && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                {message.isRead ? (
                                                                    <CheckCheck className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <CheckCheck className="h-4 w-4 text-blue-500" />
                                                                )}
                                                                <span className="text-xs text-gray-500">{message.timestamp || message.time}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isMe && (
                                                        companyDetails?.logo ? (
                                                            <Image
                                                                height={40}
                                                                width={40}
                                                                src={companyDetails.logo}
                                                                alt="You"
                                                                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <User className="h-10 w-10 rounded-full object-cover" />
                                                        )
                                                    )}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-center text-gray-400 mt-10">
                                            No messages yet. Start the conversation!
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-200 flex-shrink-0">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Write a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {!selectedUser && (
                        <div className="hidden md:flex flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex-col items-center justify-center min-h-0">
                            <div className="text-center">
                                <div className="text-6xl mb-4">💬</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Click on a user to chat</h3>
                                <p className="text-gray-500">Select a conversation from the list to start messaging</p>
                            </div>
                        </div>
                    )}
                    {chatLoading && (
                        <div className="hidden md:flex flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex-col items-center justify-center min-h-0">
                            <div className="text-center">
                                <div className="mb-4"><LoaderIcon className='animate-spin text-blue-500' /></div>
                                <p className="text-gray-500">Your chats are loading...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
