"use client"

import { useState } from "react"
import { Search, Phone, Video, Send, Paperclip, X } from "lucide-react"
import Image from "next/image"

interface ChatUser {
  id: number
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  isOnline: boolean
  lastSeen?: string
}

interface Message {
  id: number
  sender: string
  text: string
  timestamp: string
  isOwn: boolean
  avatar: string
}

export default function ChatsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Sophia Clark",
      text: "Hey, how's it going?",
      timestamp: "10:30 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 2,
      sender: "You",
      text: "I'm doing great, thanks! How about you?",
      timestamp: "10:32 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 3,
      sender: "Sophia Clark",
      text: "Just finished a big project, feeling relieved.",
      timestamp: "10:35 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 4,
      sender: "You",
      text: "That's awesome! Congrats!",
      timestamp: "10:37 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 5,
      sender: "Sophia Clark",
      text: "Thanks! Ready for a break now.",
      timestamp: "10:40 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 6,
      sender: "You",
      text: "Me",
      timestamp: "10:42 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 7,
      sender: "Sophia Clark",
      text: "Sounds perfect. Let's go!",
      timestamp: "10:43 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 8,
      sender: "You",
      text: "Let's meet at the cafe!",
      timestamp: "10:45 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 9,
      sender: "Sophia Clark",
      text: "Sounds good to me!",
      timestamp: "10:46 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 10,
      sender: "You",
      text: "See you soon!",
      timestamp: "10:48 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 11,
      sender: "Sophia Clark",
      text: "Looking forward to it!",
      timestamp: "10:50 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 12,
      sender: "You",
      text: "See you in 10 mins!",
      timestamp: "10:52 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 13,
      sender: "Sophia Clark",
      text: "Perfect timing!",
      timestamp: "10:53 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 14,
      sender: "You",
      text: "Great, see you there!",
      timestamp: "10:55 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 15,
      sender: "Sophia Clark",
      text: "Hey, how's it going?",
      timestamp: "10:30 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 16,
      sender: "You",
      text: "I'm doing great, thanks! How about you?",
      timestamp: "10:32 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 17,
      sender: "Sophia Clark",
      text: "Just finished a big project, feeling relieved.",
      timestamp: "10:35 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 18,
      sender: "You",
      text: "That's awesome! Congrats!",
      timestamp: "10:37 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 19,
      sender: "Sophia Clark",
      text: "Thanks! Ready for a break now.",
      timestamp: "10:40 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 20,
      sender: "You",
      text: "Me",
      timestamp: "10:42 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 21,
      sender: "Sophia Clark",
      text: "Sounds perfect. Let's go!",
      timestamp: "10:43 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 22,
      sender: "You",
      text: "Let's meet at the cafe!",
      timestamp: "10:45 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 23,
      sender: "Sophia Clark",
      text: "Sounds good to me!",
      timestamp: "10:46 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 24,
      sender: "You",
      text: "See you soon!",
      timestamp: "10:48 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 25,
      sender: "Sophia Clark",
      text: "Looking forward to it!",
      timestamp: "10:50 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 26,
      sender: "You",
      text: "See you in 10 mins!",
      timestamp: "10:52 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
    {
      id: 27,
      sender: "Sophia Clark",
      text: "Perfect timing!",
      timestamp: "10:53 AM",
      isOwn: false,
      avatar: "/professional-woman-avatar.png",
    },
    {
      id: 28,
      sender: "You",
      text: "Great, see you there!",
      timestamp: "10:55 AM",
      isOwn: true,
      avatar: "/professional-man-avatar.png",
    },
  ])

  const chatUsers: ChatUser[] = [
    {
      id: 1,
      name: "Sophia Clark",
      avatar: "/professional-woman-avatar.png",
      lastMessage: "Hey, how's it going?",
      timestamp: "10:30 AM",
      isOnline: true,
      lastSeen: "Last seen 2 hours ago",
    },
    {
      id: 2,
      name: "Ethan Bennett",
      avatar: "/professional-man-avatar.png",
      lastMessage: "I'm doing great, thanks! How about you?",
      timestamp: "10:25 AM",
      isOnline: false,
    },
    {
      id: 3,
      name: "Olivia Hayes",
      avatar: "/professional-woman-avatar-2.png",
      lastMessage: "Just finished a big project, feeling relieved.",
      timestamp: "10:20 AM",
      isOnline: true,
    },
    {
      id: 4,
      name: "Liam Carter",
      avatar: "/professional-man-avatar-2.png",
      lastMessage: "That's awesome! Congrats!",
      timestamp: "10:15 AM",
      isOnline: false,
    },
    {
      id: 5,
      name: "Ava Morgan",
      avatar: "/professional-woman-avatar-3.png",
      lastMessage: "Thanks! Ready for a break now.",
      timestamp: "10:10 AM",
      isOnline: true,
    },
    {
      id: 6,
      name: "Noah Parker",
      avatar: "/professional-man-avatar-3.png",
      lastMessage: "Me too. Thinking of grabbing a coffee.",
      timestamp: "10:05 AM",
      isOnline: false,
    },
    {
      id: 7,
      name: "Isabella Reed",
      avatar: "/professional-woman-avatar-4.png",
      lastMessage: "Sounds perfect. Let's go!",
      timestamp: "10:00 AM",
      isOnline: true,
    },
    {
      id: 1,
      name: "Sophia Clark",
      avatar: "/professional-woman-avatar.png",
      lastMessage: "Hey, how's it going?",
      timestamp: "10:30 AM",
      isOnline: true,
      lastSeen: "Last seen 2 hours ago",
    },
    {
      id: 2,
      name: "Ethan Bennett",
      avatar: "/professional-man-avatar.png",
      lastMessage: "I'm doing great, thanks! How about you?",
      timestamp: "10:25 AM",
      isOnline: false,
    },
    {
      id: 3,
      name: "Olivia Hayes",
      avatar: "/professional-woman-avatar-2.png",
      lastMessage: "Just finished a big project, feeling relieved.",
      timestamp: "10:20 AM",
      isOnline: true,
    },
    {
      id: 4,
      name: "Liam Carter",
      avatar: "/professional-man-avatar-2.png",
      lastMessage: "That's awesome! Congrats!",
      timestamp: "10:15 AM",
      isOnline: false,
    },
    {
      id: 5,
      name: "Ava Morgan",
      avatar: "/professional-woman-avatar-3.png",
      lastMessage: "Thanks! Ready for a break now.",
      timestamp: "10:10 AM",
      isOnline: true,
    },
    {
      id: 6,
      name: "Noah Parker",
      avatar: "/professional-man-avatar-3.png",
      lastMessage: "Me too. Thinking of grabbing a coffee.",
      timestamp: "10:05 AM",
      isOnline: false,
    },
    {
      id: 7,
      name: "Isabella Reed",
      avatar: "/professional-woman-avatar-4.png",
      lastMessage: "Sounds perfect. Let's go!",
      timestamp: "10:00 AM",
      isOnline: true,
    },
  ]

  const filteredUsers = chatUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUser) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "You",
        text: messageInput,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        avatar: "/professional-man-avatar.png",
      }
      setMessages([...messages, newMessage])
      setMessageInput("")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        <div className="flex-1 flex overflow-hidden gap-4 p-4 max-w-7xl mx-auto w-full min-h-0">
          <div
            className={`${selectedUser ? "hidden" : "flex"} md:flex w-full md:w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex-col overflow-hidden min-h-0`}
          >
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

            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedUser?.id === user.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Image
                        height={300}
                        width={300}
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">{user.timestamp}</span>
                      </div>
                      <p className="text-sm text-blue-600 truncate">{user.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedUser && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-0">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Image
                  height={300}
                  width={300}
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedUser.isOnline ? <span className="text-green-600">Online</span> : selectedUser.lastSeen}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:block">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:block">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    {!message.isOwn && (
                      <Image
                      height={300}
                      width={300}
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.sender}
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div className={`flex flex-col ${message.isOwn ? "items-end" : "items-start"}`}>
                      <p className="text-xs text-gray-500 mb-1">{message.sender}</p>
                      <div
                        className={`px-4 py-2 rounded-lg max-w-xs ${
                          message.isOwn
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                    {message.isOwn && (
                      <Image
                      height={300}
                      width={300}
                        src={message.avatar || "/placeholder.svg"}
                        alt={message.sender}
                        className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </button>
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
        </div>
      </div>
    </div>
  )
}
