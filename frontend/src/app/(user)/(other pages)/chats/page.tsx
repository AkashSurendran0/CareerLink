"use client"

import { useEffect, useState } from "react"
import { Search, Phone, Video, Send, Paperclip, X, CheckCheck, User, LoaderIcon } from "lucide-react"
import { getConversations, getUserChats, getUserDetails, sendMessage } from "@/services/userService"
import Image from "next/image"
import { userSocket } from "@/lib/socket"

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
  isRead: boolean
}

export default function ChatsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedConvo, setSelectedConvo] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [conversations, setConversations] = useState()
  const [chatLoading, setChatLoading] = useState(false)
  const [userDetails, setUserDetails] = useState()
  const [userChats, setUserChats] = useState()
  const [userId, setUserId] = useState()

  useEffect(()=>{
    getUserConversations()
    getDetails()
    fetchUserId()
  }, [])

  useEffect(()=>{
    if(!selectedConvo) return

    userSocket.emit("join-conversation", selectedConvo)

    return () => {
      userSocket.emit("leave-conversation", selectedConvo)
    }
  }, [selectedConvo])

  const fetchUserId=async()=>{
    try {
      const res=await fetch('/api/me')
      const data=await res.json()
      setUserId(data.userId)
    } catch (error) {
      console.log('Failed to fetch userid', error)
    }
  }


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

  useEffect(()=>{
    const receiveHandler = (message, convoId) => {
      console.log(message, convoId)
      if(selectedConvo == convoId) {
        if(!userChats){
          setUserChats(message)
        }else{
          const lastMessage=message?.content[message?.content?.length-1]
          setUserChats((prev)=>({
            ...prev,
            content:[...prev.content, lastMessage]
          }))
        }
      }
      }

    userSocket.on('receive-message', receiveHandler)

    return () => {
      userSocket.off("receive-message", receiveHandler);
    }
  }, [selectedConvo])

  const getDetails = async () => {
    const result=await getUserDetails()
    setUserDetails(result.userDetails)
  }

  const getUserConversations = async () => {
    const result=await getConversations()
    setConversations(result.result)
  }

  const setUserAndConvo = async (convo) => {
    setChatLoading(true)
    setSelectedConvo(convo._id)
    setSelectedUser(convo)
    const result=await getUserChats(convo._id)
    console.log(result)
    setUserChats(result.result)
    setChatLoading(false)
  }

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedUser && selectedConvo) {
      const data={
        convoId:selectedConvo,
        message:messageInput
      }
      const result=await sendMessage(data)
      const lastMessage=result.result?.content[result.result?.content?.length-1]
      if(!userChats) {
        setUserChats(result.result)
      }else{
        setUserChats((prev)=>({
          ...prev,
          content:[...prev.content, lastMessage]
        }))
      }

      userSocket.emit("send-message", {
        convoId:selectedConvo,
        message:result.result
      })
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
            {conversations && conversations.length>0 ? (
            <div className="flex-1 overflow-y-auto min-h-0">
                  {conversations.map((user) => (
                    <div
                      key={user._id}
                      onClick={()=>setUserAndConvo(user)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedUser === user._id ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          {user.pfp? (
                            <Image
                            height={300}
                            width={300}
                              src={user.pfp}
                              alt={user.username}
                              className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <User className="h-10 w-10 rounded-full object-cover"/>
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
                          {/* <p className="text-sm text-blue-600 truncate">{user.lastMessage}</p> */}
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
            )}
          </div>

          {!chatLoading && selectedUser && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden min-h-0">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {selectedUser.pfp ? (
                    <Image
                        height={300}
                        width={300}
                      src={selectedUser.pfp}
                      alt={selectedUser.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ): (
                    <User className="h-10 w-10 rounded-full object-cover"/>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedUser.username}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedUser.online && <span className="text-green-600">Online</span>}
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

              <div className="flex-1 overflow-y-auto min-h-0 p-4 flex flex-col-reverse">
                <div className="space-y-4 flex flex-col">
                  {userChats?.content?.length > 0 ?(
                    userChats.content.map((message) => {
                      const isMe = message.sendBy === userId
                      const isOther = message.sendBy === selectedUser.user;

                      return (
                      
                      <div key={message._id} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                        {!isMe && (
                          selectedUser.pfp? (
                            <Image
                              height={300}
                              width={300}
                              src={selectedUser.pfp }
                              alt={selectedUser.username}
                              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <User className="h-10 w-10 rounded-full object-cover"/>
                          )
                        )}
                        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <p className="text-xs text-gray-500 mb-1">{message.sender}</p>
                          <div
                            className={`px-4 py-2 rounded-lg max-w-xs ${
                              isMe
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                          </div>
                          {isMe && (
                            <div className="flex items-center gap-1 mt-1">
                              {message.isRead ? (
                                <CheckCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <CheckCheck className="h-4 w-4 text-blue-500" />
                              )}
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                          )}
                        </div>
                        {isMe && (
                          userDetails.profilePicture ? (
                          <Image
                            height={40}
                            width={40}
                            src={userDetails.profilePicture}
                            alt="You"
                            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <User className="h-10 w-10 rounded-full object-cover"/>
                        )
                      )}
                      </div>
                    )})
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
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Send className="h-5 w-5"/>
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
                <div className="mb-4"><LoaderIcon className='animate-spin text-blue-500'/></div>
                <p className="text-gray-500">Your chats are loading...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
