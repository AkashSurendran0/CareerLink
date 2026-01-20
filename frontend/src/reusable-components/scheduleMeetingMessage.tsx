"use client"
import { Calendar, Clock, Phone, Bell, Video, CheckCheck } from "lucide-react"

interface ScheduledMeetingMessageProps {
    date: string
    time: string
    onRemind?: () => void
    onCall?: () => void
    isMe: boolean
    isRead: boolean
    admin: boolean
}

export function ScheduledMeetingMessage({
  date,
  time,
  onRemind,
  onCall,
  isMe,
  isRead,
  admin
}: ScheduledMeetingMessageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

    return (
        <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`flex flex-col max-w-sm ${isMe ? "items-end" : "items-start"}`}>
                <p className="text-xs text-gray-500 mb-2">Meeting Scheduled</p>
                    <div
                    className={`rounded-lg border-2 p-4 w-full ${
                        isMe ? "bg-blue-50 border-blue-500" : "bg-purple-50 border-purple-500"
                    }`}
                    >
                    <div className="flex items-center gap-2 mb-3">
                        <Video className={`h-5 w-5 ${isMe ? "text-blue-600" : "text-purple-600"}`} />
                        <p className={`font-semibold ${isMe ? "text-blue-900" : "text-purple-900"}`}>Video Call Scheduled</p>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                        <Calendar className={`h-4 w-4 ${isMe ? "text-blue-600" : "text-purple-600"}`} />
                        <span className={isMe ? "text-blue-800" : "text-purple-800"}>{formatDate(date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                        <Clock className={`h-4 w-4 ${isMe ? "text-blue-600" : "text-purple-600"}`} />
                        <span className={isMe ? "text-blue-800" : "text-purple-800"}>{time}</span>
                        </div>
                    </div>

                    {isMe && !admin && (
                        <div className="flex gap-2">
                            <button
                            onClick={onRemind}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-200 hover:bg-blue-300 text-blue-900`}
                            >
                            <Bell className="h-4 w-4" />
                            Send Reminder
                            </button>
                            <button
                            onClick={onCall}
                            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white`}
                            >
                            <Phone className="h-4 w-4" />
                            Call
                            </button>
                        </div>
                    )}
                </div>
                {isMe && !admin  && (
                    <div className="flex items-center gap-1 mt-1">
                    {isRead ? (
                        <CheckCheck className="h-4 w-4 text-green-500" />
                    ) : (
                        <CheckCheck className="h-4 w-4 text-blue-500" />
                    )}
                    </div>
                )}
            </div>
        </div>
    )
}
