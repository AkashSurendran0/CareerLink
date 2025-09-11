import React from 'react'
import Image from 'next/image'

function UserManagement() {
    const users = [
        {
            id: 1,
            name: "Emma H",
            email: "emma.h@email.com",
            dateJoined: "2022-01-15",
            status: "Active",
            avatar: "/logo.jpeg",
        },
        {
            id: 2,
            name: "Liam D",
            email: "liam.d@email.com",
            dateJoined: "2022-03-22",
            status: "Active",
            avatar: "/logo.jpeg",
        },
        {
            id: 3,
            name: "Olivia R",
            email: "olivia.r@email.com",
            dateJoined: "2022-05-10",
            status: "Suspended",
            avatar: "/logo.jpeg",
        },
        {
            id: 4,
            name: "Olivia R",
            email: "olivia.r@email.com",
            dateJoined: "2022-05-10",
            status: "Suspended",
            avatar: "/logo.jpeg",
        },
    ]


    return (
        <div className="flex-1">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    Manage Users
                    <span className="text-blue-600">👥</span>
                </h1>
                <p className="text-gray-600 mt-1">View, search, and manage all registered users.</p>
                </div>
                <div className="text-right">
                </div>
            </div>
            </div>

            {/* Content */}
            <div className="p-8">
            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                    type="text"
                    placeholder="Search users by name, email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                </div>
            </div>

            {/* Premium Users Section */}
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">All Users</h2>
            </div>

            <div className="mb-4 space-x-4 text-sm flex">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" className="h-3 w-3" />
                    <span>Premium Users</span>
                </label>

                <label className="flex items-center text-sm space-x-2">
                    <input type="checkbox" className="h-3 w-3" />
                    <span>Active Users</span>
                </label>

                <label className="flex items-center text-sm space-x-2">
                    <input type="checkbox" className="h-3 w-3" />
                    <span>Suspended Users</span>
                </label>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Profile</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Date Joined</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                            <Image
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                width={300}
                                height={300}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                            </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.dateJoined}</td>
                        <td className="py-4 px-6">
                            <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                            >
                            {user.status}
                            </span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-1 text-sm">
                            <button className="text-blue-600 hover:text-blue-800">View</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:text-blue-800">
                                {user.status === "Active" ? "Suspend" : "Suspend"}
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:text-blue-800">Upgrade/</button>
                            <button className="text-blue-600 hover:text-blue-800">Downgrade</button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">‹</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">2</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">3</button>
                <span className="text-gray-400">...</span>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">10</button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">›</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default UserManagement
