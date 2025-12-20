import { Phone, PhoneOff, Camera } from "lucide-react"

interface Props {
    name:string,
    callType:string,
    handleRejectCall () : void,
    handleAcceptCall () : void
}

export default function CallPopup ({name, callType, handleRejectCall, handleAcceptCall}:Props){

    return  (
        <div className="fixed top-1 left-1/2 -translate-x-1/2 mt-2 z-50 animate-in slide-in-from-top">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[280px] sm:min-w-[320px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    {callType == 'voice-call' ? (
                        <Phone className="w-5 h-5 text-white animate-pulse" />
                    ) : (
                        <Camera className="w-5 h-5 text-white animate-pulse" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-500">Incoming call...</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleRejectCall}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    title="Reject"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleAcceptCall}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                    title="Accept"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
    )

}