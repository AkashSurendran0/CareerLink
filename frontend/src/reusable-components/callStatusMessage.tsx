"use client"

import { Phone, PhoneOff } from "lucide-react"

interface CallStatusMessageProps {
  status: string
  time: string
  duration: string
}

export function CallStatusMessage({ status, time, duration }: CallStatusMessageProps) {
  return (
    <div className="flex justify-center items-center my-4">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          status == "attended"? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {status == "attended"? (
          <>
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">Call placed at {time} for duration {duration}</span>
          </>
        ) : (
          <>
            <PhoneOff className="h-4 w-4" />
            <span className="text-sm font-medium">Call rejected at {time}</span>
          </>
        )}
      </div>
    </div>
  )
}
