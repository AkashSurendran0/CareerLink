"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { getConnectionUsers, sendConnectionRequest } from "@/services/userService"
import {UserIcon} from 'lucide-react'
import { useLoading } from "../../template"
import { useRouter } from "next/navigation"

export default function MeetPeoplePage() {
    const router=useRouter()
    const setLoading=useLoading()
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers]=useState()
    const [userLoading, setUserLoading]=useState(true)

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        const result=await getConnectionUsers()
        setUsers(result.user)
        setUserLoading(false)
        console.log(result)
    }

    const sendConnection = async (id:string) => {
        setLoading(true)
        await sendConnectionRequest(id)
        setLoading(false)
    }

    const routeToUserViewPage = async (id:string) => {
        setLoading(true)
        router.push(`/meetPeople/${id}`)
    }

    return (
            <main className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                        type="text"
                        placeholder="Search for people"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">People you may know</h2>

                    {/* Users List */}
                    <div className="space-y-4">
                        {userLoading ? (
                            <div className="text-center mt-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Loading Users</h2>
                            </div>
                        ) : (
                            <>
                                {users && users.length>0 ? (
                                    <>
                                        {users.map(user => (
                                            <>
                                                <div
                                                key={user.id}
                                                className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                                                >
                                                <div 
                                                className="cursor-pointer flex items-center space-x-4"
                                                onClick={() => routeToUserViewPage(user.id)}
                                                >
                                                    <img
                                                    src={user.dp || <UserIcon/>}
                                                    alt={user.name}
                                                    className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                    <span className="text-gray-900 font-medium">{user.name}</span>
                                                </div>
                                                {user.pending ? (
                                                    <button
                                                        onClick={() => sendConnection(user.id)}
                                                        className={`cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors bg-red-500 text-white hover:bg-red-600`}
                                                    >
                                                        Cancel Request
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => sendConnection(user.id)}
                                                        className={`cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-900 hover:bg-gray-300`}
                                                    >
                                                        Connect
                                                    </button>
                                                )}
                                                </div>
                                                <div className="mt-8 text-center">
                                                    <button
                                                        // onClick={handleLoadMore}
                                                        className="cursor-pointer px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Load More Users
                                                    </button>
                                                </div>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <div class="w-full text-center py-4 bg-gray-100 text-gray-600 rounded-lg">
                                        No active users available
                                    </div>

                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
    )
}
