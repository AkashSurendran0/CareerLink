"use client"

import { changeCompanyStatus, changeUserStatus, closeReport, discoverCompanyInfo, getDetailsByQuery, getPreviousUserReports, getReportDetails, sendWarningMail, viewOtherUserPosts } from "@/services/adminService"
import { User } from "lucide-react"
import Image from "next/image"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ reportId: string }>
}

interface CompanyDetails {
  name: string;
  location: string;
  logo?: string;
  suspended?: boolean;
  registeredBy: string;
}

interface Report {
  id: string;
  createdAt: string;
  reason: string;
  status: string;
}

interface ReportDetails {
  reportedUserProfile?: string;
  reportedUserName: string;
  reportedUserEmail: string;
  reason: string;
  createdAt: string;
  status: string;
  type: string;
}

export default function ReportedUserAccountPage({ params, searchParams }: Props) {
  const router = useRouter()
  const id = (params as unknown as { id: string }).id
  const reportId = (searchParams as unknown as { reportId: string }).reportId
  const [companyReports, setCompanyReports] = useState<Report[]>([])
  const [reportCount, setReportCount] = useState(1)
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(null)
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)

  useEffect(() => {
    getPreviousReports()
    fetchReportDetails()

    getCompanyDetails()
  }, [])

  const getCompanyDetails = async () => {
    const result = await discoverCompanyInfo(id)
    setCompanyDetails(result.result)
  }

  const getPreviousReports = async () => {
    const result = await getPreviousUserReports(id)
    const finalReports = result.result.filter((i: Report) => i.id !== reportId)
    setCompanyReports(finalReports)
    setReportCount((prev) => prev + finalReports.length)
  }

  const fetchReportDetails = async () => {
    const result = await getReportDetails(reportId)
    if (result.result.success) {
      setReportDetails(result.result.report)
    } else {
      enqueueSnackbar('Report not available, please try again later')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gray-100 text-gray-700"
      case "Resolved":
        return "bg-green-100 text-green-700"
      case "Dismissed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const markAsReviewed = async () => {
    await alterReportStatus()
    router.push('/admin/reports')
  }

  const suspendCompany = async () => {
    const company = {
      id: id
    }
    await changeCompanyStatus(company)
    await alterReportStatus()
    router.push('/admin/reports')
  }

  const sendMail = async () => {
    if (companyDetails) {
      await sendWarningMail(companyDetails.registeredBy)
      await alterReportStatus()
      router.push('/admin/reports')
    }
  }

  const alterReportStatus = async () => {
    await closeReport(reportId)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Reported User Account</h1>
              <p className="text-sm md:text-base text-gray-600">
                Review the reported account and take moderation actions.
              </p>
            </div>

            {/* User Profile Card */}
            {companyDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {companyDetails.logo ? (
                      <Image
                        width={300}
                        height={300}
                        src={companyDetails.logo}
                        alt={companyDetails.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover bg-orange-100"
                      />
                    ) : (
                      <User className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{companyDetails.name}</h2>
                    <p className="text-gray-600 text-sm md:text-base">{companyDetails.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Previous Reports History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Previous Reports History</h2>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                {companyReports && companyReports.length > 0 ? (
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Report Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reason</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {companyReports.map(report => (
                        <tr key={report.id}>
                          <td className="px-4 py-4 text-sm text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-4 text-sm text-blue-600">{report.reason}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    Company has no previous reports
                  </div>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {companyReports && companyReports.length > 0 ? (
                  companyReports.map((report, ind) => (
                    <div key={ind} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm text-blue-600">{report.reason}</p>
                    </div>
                  ))
                ) : (
                  <div>
                    Company has no previous reports
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Report Details & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Report Details & Actions</h2>

              {/* Reporter Info */}
              {reportDetails && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      {reportDetails.reportedUserProfile ? (
                        <Image
                          width={300}
                          height={300}
                          src={reportDetails.reportedUserProfile}
                          alt="User Profile"
                          className="w-12 h-12 rounded-full object-cover "
                        />
                      ) : (
                        <User className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover" />
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{reportDetails.reportedUserName}</h3>
                        <p className="text-xs text-blue-600">{reportDetails.reportedUserEmail}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Report Reason : {reportDetails.reason}
                    </p>
                  </div>

                  {/* Report Metadata */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between items-start text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Date of Report</p>
                        <p className="text-gray-900">{new Date(reportDetails.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 mb-1">Number of Reports</p>
                        <p className="text-gray-900">{reportCount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {reportDetails.status == 'Pending' && (
                    <div className="space-y-3">
                      <button onClick={markAsReviewed} className="cursor-pointer w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                        Mark as Reviewed
                      </button>
                      {companyDetails && !companyDetails.suspended && (
                        <button onClick={suspendCompany} className="cursor-pointer w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors">
                          Suspend Account
                        </button>
                      )}
                      <button onClick={sendMail} className="cursor-pointer w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors">
                        Send Warning Mail
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
