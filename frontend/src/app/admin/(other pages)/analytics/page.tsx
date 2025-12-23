"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for charts
const userRegistrationsData = [
  { month: "Jan", value: 230 },
  { month: "Feb", value: 280 },
  { month: "Mar", value: 240 },
  { month: "Apr", value: 330 },
  { month: "May", value: 310 },
  { month: "Jun", value: 450 },
  { month: "Jul", value: 380 },
]

const subscriptionsData = [
  { month: "Jan", value: 190 },
  { month: "Feb", value: 250 },
  { month: "Mar", value: 220 },
  { month: "Apr", value: 280 },
]

const companyEngagementData = [
  { company: "Company A", value: 85 },
  { company: "Company B", value: 72 },
  { company: "Company C", value: 68 },
  { company: "Company D", value: 54 },
  { company: "Company E", value: 48 },
]

const reportsCategoryData = [
  { category: "Spam", value: 45 },
  { category: "Harassment", value: 62 },
  { category: "Fake Jobs", value: 58 },
  { category: "Fake Profiles", value: 71 },
  { category: "Other", value: 38 },
]

const applicationsData = [
  { week: "Week 1", value: 320 },
  { week: "Week 2", value: 280 },
  { week: "Week 3", value: 350 },
  { week: "Week 4", value: 450 },
]

const activeCompaniesData = [
  { company: "Company A", value: 92 },
  { company: "Company B", value: 78 },
  { company: "Company C", value: 65 },
  { company: "Company D", value: 88 },
  { company: "Company E", value: 71 },
]

export default function AnalyticsPage() {
    const [reportAnalytics, setReportAnalytics] = useState()

    useEffect(() => {
        getReportData()
    }, [])

    const getReportData = async () => {
        const result=await getReportAnalytics()
    }
 

    return (
        <div className="flex-1">
        {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                    <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        Analytics
                        <span className="text-blue-600">📈</span>
                    </h1>
                    <p className="text-gray-600 mt-1">Overview of user activity, companies, and reports.</p>
                    </div>
                    <div className="text-right">
                    </div>
                </div>
            </div>

        {/* Charts Grid */}
        <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* New User Registrations */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">New User Registrations</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">+15%</span>
                    <span className="text-sm text-green-600">This month +15%</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={userRegistrationsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                        }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#5B7FDB" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

                {/* Subscriptions Trend */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Subscriptions trend</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">+10%</span>
                    <span className="text-sm text-green-600">This month +10%</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={subscriptionsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                        }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#5B7FDB" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

                {/* Company Engagement */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Company Engagement</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">+20%</span>
                    <span className="text-sm text-green-600">This month +20%</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={companyEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="company" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                        }}
                    />
                    <Bar dataKey="value" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                {/* Reports by Category */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Reports by Category</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">+5%</span>
                    <span className="text-sm text-green-600">This month +5%</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={reportsCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 11 }} angle={0} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                        }}
                    />
                    <Bar dataKey="value" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                {/* Applications Submitted */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Applications Submitted</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">+10%</span>
                    <span className="text-sm text-green-600">This month +10%</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={applicationsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        fontSize: "12px",
                        }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#5B7FDB" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                </div>

                {/* Most Active Companies */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Most Active Companies</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-bold text-gray-900">+8%</span>
                    <span className="text-sm text-green-600">This month +8%</span>
                    </div>
                </div>
                <div className="space-y-3">
                    {activeCompaniesData.map((company) => (
                    <div key={company.company} className="flex items-center gap-3">
                        <span className="text-sm text-blue-600 font-medium w-24 shrink-0">{company.company}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${company.value}%` }}
                        />
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
        </div>
    )
}
