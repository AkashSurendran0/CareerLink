"use client"

import { useState } from "react"
import { X, Calendar, Clock } from "lucide-react"
import { enqueueSnackbar } from "notistack"

interface ScheduleCallModalProps {
  userName: string
  onConfirm: (date: Date, time: string) => void
  onClose: () => void
}

export function ScheduleCallModal({ userName, onConfirm, onClose }: ScheduleCallModalProps) {
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
        
        const [hour, minute]=selectedTime.split(':').map(Number)
        
        const scheduledDate=new Date(selectedDate)
        scheduledDate.setHours(hour, minute, 0, 0)
        
        const now=new Date()
        
        if(scheduledDate <= now) {
            return enqueueSnackbar('Scheduled date must be in the future.', {variant:'error'})
        }

        onConfirm(selectedDate, selectedTime)
        setSelectedDate("")
        setSelectedTime("")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Schedule Call with {userName}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Date
                        </label>
                        <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Select Time
                        </label>
                        <input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                        {selectedDate && selectedTime
                            ? `Call scheduled for ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}`
                            : "Select both date and time to proceed"}
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                        onClick={onClose}
                        className="cursor-pointer flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={handleConfirm}
                        disabled={!selectedDate || !selectedTime}
                        className="cursor-pointer flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
                        >
                        Confirm Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
