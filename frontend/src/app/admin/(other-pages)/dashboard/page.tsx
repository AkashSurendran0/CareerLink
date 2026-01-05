"use client"

import { getActiveCompanyCount, getApprovedCompanies, getPaginatedReports, getPremiumUserCount, getTodayReportCount, getTotalUserCount, getUsers } from "@/services/adminService"
import { useEffect, useState } from "react"

const recentActivity = [
    {
        id: 1,
        name: "Liam Carter",
        email: "liam.carter@example.com",
        registrationDate: "2023-08-15",
    },
    {
        id: 2,
        name: "Olivia Bennett",
        email: "olivia.bennett@example.com",
        registrationDate: "2023-08-14",
    },
    {
        id: 3,
        name: "Noah Thompson",
        email: "noah.thompson@example.com",
        registrationDate: "2023-08-13",
    },
    {
        id: 4,
        name: "Ava Harris",
        email: "ava.harris@example.com",
        registrationDate: "2023-08-12",
    },
    {
        id: 5,
        name: "Ethan Clark",
        email: "ethan.clark@example.com",
        registrationDate: "2023-08-11",
    },
]

interface UserJoining {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

export default function DashboardPage() {
    const [userCount, setUserCount] = useState(0)
    const [companyCount, setCompanyCount] = useState(0)
    const [reportCount, setReportCount] = useState(0)
    const [premiumCount, setPremiumCount] = useState(0)
    const [userJoining, setUserJoining] = useState<UserJoining[]>([])

    useEffect(() => {
        getUserCount()
        getCompanyCount()
        getReportCount()
        getPremiumCount()
        getRecentDetails()
    }, [])

    const getUserCount = async () => {
        const result = await getTotalUserCount()
        setUserCount(result.result)
    }

    const getCompanyCount = async () => {
        const result = await getActiveCompanyCount()
        setCompanyCount(result.result)
    }

    const getReportCount = async () => {
        const result = await getTodayReportCount()
        setReportCount(result.result)
    }

    const getPremiumCount = async () => {
        const result = await getPremiumUserCount()
        setPremiumCount(result.result)
    }

    const getRecentDetails = async () => {
        const users = await getUsers(1, 3, '')
        const result = [...users.users.result]
        result.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUserJoining(result)
    }

    return (
        <div className="flex-1">
            {/* Welcome Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                            Welcome back, Admin 👋
                            <span className="text-blue-600">👥</span>
                        </h1>
                        <p className="text-gray-600 mt-1">Here&apos;s an overview of what&apos;s happening today.</p>
                    </div>
                    <div className="text-right">
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                    {/* Total Users */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                        <div className="text-sm text-gray-600 mb-1">Total Users</div>
                        <div className="text-3xl font-bold text-gray-900">{userCount ?? 0}</div>
                    </div>

                    {/* Active Companies */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                        <div className="text-sm text-gray-600 mb-1">Active Companies</div>
                        <div className="text-3xl font-bold text-gray-900">{companyCount ?? 0}</div>
                    </div>

                    {/* New Reports Today */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                        <div className="text-sm text-gray-600 mb-1">New Reports Today</div>
                        <div className="text-3xl font-bold text-gray-900">{reportCount ?? 0}</div>
                    </div>

                    {/* Premium Subscribers */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
                        <div className="text-sm text-gray-600 mb-1">Premium Subscribers</div>
                        <div className="text-3xl font-bold text-gray-900">{premiumCount ?? 0}</div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3.5 px-6 text-sm font-medium text-gray-700">Name</th>
                                        <th className="text-left py-3.5 px-6 text-sm font-medium text-gray-700">Email</th>
                                        <th className="text-left py-3.5 px-6 text-sm font-medium text-gray-700">Registration Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {userJoining && userJoining.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6 text-sm text-gray-900">{user.username}</td>
                                            <td className="py-4 px-6 text-sm text-blue-600">{user.email}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-gray-200">
                            {userJoining && userJoining.map((user) => (
                                <div key={user.id} className="p-4 hover:bg-gray-50">
                                    <div className="font-medium text-gray-900 mb-1">{user.username}</div>
                                    <div className="text-sm text-blue-600 mb-1">{user.email}</div>
                                    <div className="text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
