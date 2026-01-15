"use client"

import { notificationSocket, userSocket } from "@/lib/socket"
import { deleteAllNotifications, deleteOneNotification, getAllNotifications, getUserDetails, markAllNotificationsRead, markOneRead } from "@/services/userService"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/app/(user)/template"
import { getSubscriptionInfo } from "../services/userService"
import CallPopup from "@/reusable-components/callPopup"
import RingingPopup from "@/reusable-components/ringingPopup"
import crypto from "crypto";
import { User } from "lucide-react"
import Image from "next/image"

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void
}


interface Notification {
  _id: string
  content: string,
  isRead: boolean,
  createdAt: Date
}

interface IncomingCall {
  from: string;
  caller: string;
  callerImage: string;
  callType: string;
  convoId: string;
}

interface OutgoingCall {
  reciever: string;
  callType: string;
}

interface UserDetails {
  username: string;
  profilePicture?: string;
  // Add other properties as needed
}

function MainNavbar({ setSidebarOpen }: NavbarProps) {
  const setLoading = useLoading()
  const router = useRouter()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [userEmail, setUserEmail] = useState<string>()
  const [userId, setUserId] = useState<string>()
  const [callerId, setCallerId] = useState<string>()
  const [isVip, setIsVip] = useState(false)
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null)
  const [callDeclined, setCallDeclined] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails>()

  useEffect(() => {
    getDetails()
  }, [])

  const getDetails = async () => {
    const result = await getUserDetails()
    setUserDetails(result.userDetails)
  }

  useEffect(() => {
    userSocket.on('incoming-call', ({ from, caller, callerImage, callType, convoId }) => {
      setCallerId(from)
      const data = {
        from,
        caller,
        callerImage,
        callType, 
        convoId
      }
      setIncomingCall(data)
    })
  }, [])

  useEffect(() => {
    userSocket.on('user-disconnected', () => {
      setOutgoingCall(null)
      setIncomingCall(null)
    })
  }, [])

  useEffect(() => {
    userSocket.on('ringing', ({ reciever, callType }) => {
      setCallDeclined(false)
      const data = {
        reciever,
        callType
      }
      setOutgoingCall(data)
    })

    userSocket.on('call-declined', () => {
      setCallDeclined(true)
      setTimeout(() => {
        setOutgoingCall(null)
      }, 500);
    })
  }, [])

  useEffect(() => {
    vipStatus()
    getNotifications()
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch('/server/me', {method: "GET", credentials: "include" })
        const data = await res.json()
        setUserEmail(data.userEmail)
        setUserId(data.userId)
      } catch (error) {
        console.log('Failed to fetch userid', error)
      }
    }

    fetchUserId()
  }, [])

  useEffect(() => {
    if (!userEmail) return
    userSocket.emit('user-online', userId)
    notificationSocket.emit('join', userEmail)
    notificationSocket.on('notification', (data) => {
      setNotifications([data, ...notifications])
      setUnreadCount(unreadCount + 1)
    })

    return () => {
      notificationSocket.off('notification')
    }
  }, [userEmail])

  useEffect(() => {
    userSocket.on("call-accepted", ({ callId, name, image }) => {
      sessionStorage.setItem(
        `${callId}`,
        JSON.stringify({
          name,
          image
        })
      )
      if (incomingCall?.callType == 'voice-call' || outgoingCall?.callType == 'voice-call') {
        router.push(`/chat/voice-call/${callId}`)
      } else {
        router.push(`/chat/video-call/${callId}`)
      }
    })

    return () => {
      userSocket.off("call-accepted");
    };
  }, [incomingCall, outgoingCall])

  const getNotifications = async () => {
    const result = await getAllNotifications()
    setNotifications(result.notifications)
    const unreadCount = result.notifications.filter((noti: Notification) => !noti.isRead).length
    setUnreadCount(unreadCount)
  }

  const vipStatus = async () => {
    const result = await getSubscriptionInfo()
    setIsVip(result.result.success)
  }

  // const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    setNotifications(notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)))
    setUnreadCount(unreadCount - 1)
    await markOneRead(id)
  }

  const deleteNotification = async (id: string) => {
    setNotifications(notifications.filter((n) => n._id !== id))
    setUnreadCount(unreadCount - 1)
    await deleteOneNotification(id)
  }

  const markAllAsRead = async () => {
    setNotifications(notifications!.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
    await markAllNotificationsRead()
  }

  const deleteAll = async () => {
    setNotifications([])
    setUnreadCount(0)
    await deleteAllNotifications()
  }

  const routeToVip = () => {
    setLoading(true)
    router.push('/becomeVip')
  }

  const handleRejectCall = async () => {
    setCallDeclined(false)
    userSocket.emit('reject-call', {
      userId,
      callerId,
      convoId: incomingCall?.convoId
    })
    setIncomingCall(null)
  }

  const handleAcceptCall = async () => {
    const callId = window.crypto.randomUUID()
    userSocket.emit('accept-call', {
      callId,
      callerId,
      calleeName: userDetails?.username,
      calleeImage: userDetails?.profilePicture || null,
      callerName: incomingCall?.caller,
      callerImage: incomingCall?.callerImage
    })
  }


  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 relative">
        {incomingCall && (
          <CallPopup name={incomingCall.caller} callType={incomingCall.callType} handleRejectCall={handleRejectCall} handleAcceptCall={handleAcceptCall} />
        )}
        {outgoingCall && (
          <RingingPopup name={outgoingCall.reciever} callType={outgoingCall.callType} callDeclined={callDeclined} />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="lg:hidden">
                <span className="text-xl font-bold text-gray-900">CareerLink</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!isVip && (
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-md text-sm"
                  onClick={routeToVip}
                >
                  Become VIP
                </button>
              )}

              <div className="relative" ref={notificationRef}>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  aria-label="Notifications"
                >
                  <span className="cursor-pointer text-lg">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-82 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col max-h-96">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-gray-500">{notifications!.length} total</span>
                    </div>

                    <div className="overflow-y-auto flex-1 max-h-64">
                      {notifications!.length > 0 ? (
                        notifications!.map((notification) => (
                          <div
                            key={notification._id}
                            className={`cursor-pointer px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${!notification.isRead ? "bg-blue-50" : ""
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notification.content}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                {!notification.isRead && (
                                  <button
                                    onClick={() => markAsRead(notification._id)}
                                    className="cursor-pointer text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100"
                                    title="Mark as read"
                                  >
                                    ✓
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification._id)}
                                  className="cursor-pointer text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-100"
                                  title="Delete notification"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 text-sm">No notifications</div>
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={markAllAsRead}
                        className="cursor-pointer flex-1 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded hover:bg-blue-50 border border-blue-200"
                      >
                        Mark All as Read
                      </button>
                      <button
                        onClick={deleteAll}
                        className="cursor-pointer flex-1 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded hover:bg-red-50 border border-red-200"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {userDetails && (
                userDetails.profilePicture ? (
                  <Image
                    height={300}
                    width={300}
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                    src={userDetails.profilePicture}
                    alt="User Image"
                  />
                ) : (
                  <User className="h-8 w-8 rounded-full object-cover" />
                )
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default MainNavbar
