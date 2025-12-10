"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import { alterConnReq, getConnectedUsers, removeConnection } from "@/services/userService"
import {User} from 'lucide-react'
import { useRouter } from "next/navigation"
import Image from "next/image"
import { enqueueSnackbar } from "notistack"
import { useLoading } from "@/app/(user)/template"

export default function MeetPeoplePage() {
    const router=useRouter()
    const setLoading=useLoading()
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers]=useState()
    const [userLoading, setUserLoading]=useState(true)
    const [requestCount, setRequestCount]=useState(0)
    const debouncer=useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        getUsers(searchQuery)
    }, [])

    const getUsers = async (val:string) => {
        const result=await getConnectedUsers(val)
        setUsers(result.result.users)
        setRequestCount(result.result.requestCount)
        setUserLoading(false)
    }

    const removeUserConnection = async (id:string) => {
        setLoading(true)
        const result=await removeConnection(id)
        if(result.result.success){
            setUsers((prev)=>
                prev.filter(user=>user.id!=id)
            )
        }else{
            enqueueSnackbar('Error occured, please refresh the page and try again', {variant:'error'})
        }
        setLoading(false)
    }

    const searchUser = async (val:string) => {
        setSearchQuery(val) 
        if(debouncer.current) clearTimeout(debouncer.current)
        debouncer.current=setTimeout(() => {
            getUsers(val)
        }, 1500); 
    }

    const routeToUserViewPage = async (id:string) => {
        setLoading(true)
        router.push(`/meetPeople/${id}`)
    }

    const routeToRequestPage = async () => {
        setLoading(true)
        router.push('/meetPeople/requests')
    }

    const routeToMeetPeoplePage = async () => {
        setLoading(true)
        router.push('/meetPeople')
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
                        onChange={(e) => searchUser(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    </div>

                    {/* Heading */}
                    <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
                        <button
                            onClick={routeToMeetPeoplePage}
                            className={`cursor-pointer pb-3 font-medium transition-colors text-gray-500 hover:text-gray-700"`}
                        >
                            People you may know
                        </button>
                        <button
                            onClick={routeToRequestPage}
                            className={`cursor-pointer pb-3 font-medium transition-colors flex items-center gap-2 text-gray-500 hover:text-gray-700`}
                        >
                            Requests
                            <span className="bg-blue-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                            {requestCount}
                            </span>
                        </button>
                        <button
                            className={`pb-3 font-medium transition-colors flex items-center gap-2 text-gray-900 border-b-2 border-gray-900`}
                        >
                            My Connections
                        </button>
                    </div>

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
                                                    {user.dp? (
                                                        <Image
                                                        width={300}
                                                        height={300}
                                                        src={user.dp}
                                                        alt={user.name}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-10 w-10 rounded-full object-cover"/>
                                                    )}
                                                    <span className="text-gray-900 font-medium">{user.name}</span>
                                                </div>
                                                    <button
                                                        onClick={() => removeUserConnection(user.id)}
                                                        className={`cursor-pointer px-6 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700`}
                                                    >
                                                        Unfollow
                                                    </button>
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
                                    <div className="w-full text-center py-4 bg-gray-100 text-gray-600 rounded-lg">
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
