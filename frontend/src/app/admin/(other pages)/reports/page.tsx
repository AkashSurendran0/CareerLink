"use client"

import { getPaginatedReports } from "@/services/adminService"
import { useEffect, useState } from "react"

interface Report {
  id: string
  reportedEntity: {
    type: string
    name: string
  }
  reportedBy: string
  reason: string
  dateSubmitted: string
  status: "Pending" | "Resolved" | "Dismissed"
}

export default function ReportsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterValue, setFilterValue] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [reports, setReports] = useState()
    const [currentFilter, setCurrentFilter] = useState('all')
    const [page, setPage] = useState(1)
    const STARTING_PAGE = 1
    const LIMIT = 2

    useEffect(()=>{
        getReports()
    }, [])

    const getReports = async () => {
        const result=await getPaginatedReports(STARTING_PAGE, LIMIT, currentFilter)
        setReports(result.result.reports)
        setTotalPages(result.result.pageLimit)
        console.log(result)
    }

    const getPaginatedResults = async (i:number) => {
        setCurrentPage(i)
        const result=await getPaginatedReports(i, LIMIT, currentFilter)
        setReports(result.result.reports)
        setTotalPages(result.result.pageLimit)
        console.log(result)
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

    return (
        <div className="flex-1">
        {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                    <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        Manage Companies
                        <span className="text-blue-600">🏢</span>
                    </h1>
                    <p className="text-gray-600 mt-1">View, search, and manage all registered companies.</p>
                    </div>
                    <div className="text-right">
                    </div>
                </div>
            </div>


        {/* Search and Filter */}
        <div className="mx-3 my-3">

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    </div>
                    <input
                    type="text"
                    placeholder="Search by user, company, or report type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                    <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full md:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    </div>
                </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Report ID (#)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Reported Entity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Reported By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Date Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {reports && reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{report.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                            <div className="text-blue-600 font-medium">
                                {report.reportedAccount && report.reportedChat && (
                                    <>
                                        Chat:{report.reportedAccountName}
                                    </>
                                )}
                                {report.reportedAccount && (
                                    <>
                                        User:{report.reportedAccountName}
                                    </>
                                )}
                                {report.reportedCompany && (
                                    <>
                                        Company:{report.reportedCompanyName}
                                    </>
                                )}
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reportedUserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{report.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                report.status,
                            )}`}
                            >
                            {report.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">View</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {reports && reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex justify-between items-start mb-3">
                    <div className="font-semibold text-gray-900">{report.id}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                    </span>
                    </div>
                    <div className="space-y-2 text-sm">
                    <div>
                        <span className="text-gray-600">Reported Entity:</span>
                        <div className="text-blue-600 font-medium">
                        {report.reportedAccount && report.reportedChat && (
                            <>
                                Chat:{report.reportedAccountName}
                            </>
                        )}
                        {report.reportedAccount && (
                            <>
                                User:{report.reportedAccountName}
                            </>
                        )}
                        {report.reportedCompany && (
                            <>
                                Company:{report.reportedCompanyName}
                            </>
                        )}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-600">Reported By:</span>
                        <div className="text-gray-900">{report.reportedUserName}</div>
                    </div>
                    <div>
                        <span className="text-gray-600">Reason:</span>
                        <div className="text-blue-600">{report.reason}</div>
                    </div>
                    <div>
                        <span className="text-gray-600">Date:</span>
                        <div className="text-gray-900">{new Date(report.createdAt).toLocaleDateString()}</div>
                    </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View</button>
                    </div>
                </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center gap-2">
                <button
                onClick={() => getPaginatedResults(currentPage-1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                </button>

                { totalPages &&  
                    Array.from({length: totalPages}, (_, i) => i+1)
                    .filter(p=>{
                        if(p==1) return p<=3
                        if(p==totalPages) return p>=totalPages-2
                        return p>=page-1 && p<=page+1
                    })
                    .map(p=>
                        <button
                            key={p}
                            onClick={() => getPaginatedResults(p)}
                            className={`w-10 h-10 rounded-lg border ${
                            currentPage === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    )
                }

                <button
                onClick={() => getPaginatedResults(currentPage+1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </div>
        </div>
        </div>
    )
}
