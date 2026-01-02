"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { changeUserStatus, closeReport, getDetailsByQuery, getReportDetails, getReportedMessage, sendWarningMail } from "@/services/adminService"
import { enqueueSnackbar } from "notistack"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ reportId: string }>
}

interface UserDetails {
  result: {
    username: string;
    email: string;
  };
  pfp?: string;
}

interface Message {
  _id: string;
  sendBy: string;
  sender: string;
  message: string;
}

interface ReportDetails {
  reportedUserProfile?: string;
  reportedUserName: string;
  reportedUserEmail: string;
  reportedBy: string;
  reportedChat: string;
  reason: string;
  createdAt: string;
  status: string;
  type: string;
}

export default function ReportedChatPage({ params, searchParams }: Props) {
  const router = useRouter()
  const id = (params as unknown as { id: string }).id
  const reportId = (searchParams as unknown as { reportId: string }).reportId
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null)
  const [reportedMessages, setReportedMessages] = useState<Message[]>([])
  const [reportedMessage, setReportedMessage] = useState<Message | null>(null)


  useEffect(() => {
    getUserDetails()
    fetchReportDetails()
  }, [])

  useEffect(() => {
    if (!reportDetails) return

    getReportedMessageDetails()
  }, [reportDetails])

  const getUserDetails = async () => {
    const result = await getDetailsByQuery(id)
    setUserDetails(result.result)
  }

  const getReportedMessageDetails = async () => {
    if (!reportDetails || !reportDetails.reportedBy || !reportDetails.reportedChat) return
    const result = await getReportedMessage(id, reportDetails.reportedBy, reportDetails.reportedChat)
    const message = await result.content.filter((msg: Message) => msg._id == reportDetails.reportedChat)
    setReportedMessage(message[0])
    setReportedMessages(result.content)
  }

  const fetchReportDetails = async () => {
    const result = await getReportDetails(reportId)
    if (result.result.success) {
      setReportDetails(result.result.report)
    } else {
      enqueueSnackbar('Report not available, please try again later')
    }
  }

  const markAsReviewed = async () => {
    await alterReportStatus()
    router.push('/admin/reports')
  }

  const suspendUser = async () => {
    const user = {
      id: id
    }
    await changeUserStatus(user)
    await alterReportStatus()
    router.push('/admin/reports')
  }

  const alterReportStatus = async () => {
    await closeReport(reportId)
  }

  const sendMail = async () => {
    if (userDetails) {
      await sendWarningMail(userDetails.result.email)
      await alterReportStatus()
      router.push('/admin/reports')
    }
  }

  return (
    <div className=" mt-4 mx-3">
      {userDetails && reportDetails && reportedMessages && reportedMessage && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Column - Chat Preview */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Reported Chat</h1>
              <p className="text-sm lg:text-base text-gray-600">Review the reported chat and take appropriate action.</p>
            </div>

            {/* Chat Preview Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat Preview</h2>

              <div className="space-y-4">
                {reportedMessages.map((msg) => {
                  const isReporter = reportDetails.reportedBy == msg.sendBy

                  return (
                    <div key={msg._id} className={`flex gap-3 ${isReporter ? "justify-start" : "justify-end"}`}>
                      {isReporter && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {reportDetails.reportedUserProfile ? (
                              <Image
                                src={reportDetails.reportedUserProfile}
                                alt={reportDetails.reportedUserName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-full h-full rounded-full object-cover" />
                            )}
                          </div>
                        </div>
                      )}

                      <div className={`flex flex-col ${isReporter ? "items-start" : "items-end"} max-w-[75%]`}>
                        <span className="text-xs text-blue-600 mb-1">{msg.sender}</span>
                        <div
                          className={`rounded-2xl px-4 py-2 ${isReporter
                            ? "bg-gray-100 text-gray-900"
                            : reportedMessage._id == msg._id
                              ? "bg-blue-500 text-white ring-2 ring-red-400"
                              : "bg-blue-500 text-white"
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                      </div>

                      {!isReporter && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            {userDetails.pfp ? (
                              <Image
                                src={userDetails.pfp}
                                alt={userDetails.result.username}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-full h-full rounded-full object-cover" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Report Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h2>

              {/* Reporter Info */}
              <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {reportDetails.reportedUserProfile ? (
                    <Image
                      src={reportDetails.reportedUserProfile}
                      alt={reportDetails.reportedUserName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full rounded-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{reportDetails.reportedUserEmail}</p>
                  <p className="text-xs text-gray-500">Reporter: {reportDetails.reportedUserName}</p>
                </div>
              </div>

              {/* Reported User Info */}
              <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {userDetails.pfp ? (
                    <Image
                      src={userDetails.pfp}
                      alt={userDetails.result.username}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-full h-full rounded-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{userDetails.result.email}</p>
                  <p className="text-xs text-gray-500">Reported User: {userDetails.result.username}</p>
                </div>
              </div>

              {/* Reported Message Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Reported Message</h3>
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Reason for Report:</span> {reportDetails.type}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-medium">Reported Message:</span> {reportedMessage.message}
                  </p>
                </div>
              </div>

              {/* Date/Time */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Date :</span> {new Date(reportDetails.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              {reportDetails.status == 'Pending' && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={markAsReviewed}
                      className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={suspendUser}
                      className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Suspend User
                    </button>
                    <button
                      onClick={sendMail}
                      className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Send Warning Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
