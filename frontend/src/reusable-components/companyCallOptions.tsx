"use client"
import { Phone, Calendar, X } from "lucide-react"

interface CallOptionsPopupProps {
  userName: string
  onCallNow: () => void
  onScheduleLater: () => void
  onClose: () => void
}

export function CallOptionsPopup({ userName, onCallNow, onScheduleLater, onClose }: CallOptionsPopupProps) {
    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Video Call with {userName}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6">How would you like to proceed with your video call?</p>

                <div className="space-y-3">
                    <button
                        onClick={onCallNow}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                    >
                        <Phone className="h-5 w-5" />
                        Call Now
                    </button>

                    <button
                        onClick={onScheduleLater}
                        className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors font-medium"
                    >
                        <Calendar className="h-5 w-5" />
                        Schedule Later
                    </button>
                </div>
            </div>
        </div>
    )
}
