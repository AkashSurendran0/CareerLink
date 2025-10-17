"use client"

import { useState, useRef, useEffect } from "react"

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void
}

interface Notification {
  id: number
  message: string
  timestamp: string
  read: boolean
}

function MainNavbar({ setSidebarOpen }: NavbarProps) {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, message: "Your profile has been updated", timestamp: "2 hours ago", read: false },
    { id: 2, message: "New job recommendation for you", timestamp: "5 hours ago", read: false },
    { id: 3, message: "Your application was reviewed", timestamp: "1 day ago", read: true },
    { id: 4, message: "Company profile verified", timestamp: "2 days ago", read: false },
    { id: 5, message: "New message from recruiter", timestamp: "3 days ago", read: true },
  ])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteAll = () => {
    setNotifications([])
  }

  const visibleNotifications = notifications

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
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
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-md text-sm">
                Become VIP
              </button>

              <div className="relative" ref={notificationRef}>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 relative"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  aria-label="Notifications"
                >
                  <span className="text-lg">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col max-h-96">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-gray-500">{notifications.length} total</span>
                    </div>

                    <div className="overflow-y-auto flex-1 max-h-64">
                      {visibleNotifications.length > 0 ? (
                        visibleNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.read && (
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-100"
                                    title="Mark as read"
                                  >
                                    ✓
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-100"
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
                        className="flex-1 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded hover:bg-blue-50 border border-blue-200"
                      >
                        Mark All as Read
                      </button>
                      <button
                        onClick={deleteAll}
                        className="flex-1 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded hover:bg-red-50 border border-red-200"
                      >
                        Delete All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center"></div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default MainNavbar
