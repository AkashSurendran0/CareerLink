"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import {LoaderIcon} from 'lucide-react'


type User = {
    id:string,
    username:string,
    email:string,
    suspended:boolean,
    createdAt:Date,

}

function UserManagement() {
    const [users, setUsers]=useState<User[]>([])
    const [pageLimit, setPageLimit]=useState(0)
    const [page, setPage]=useState(1)
    const [loadingUserId, setLoadingUserId]=useState<string | null>()

    
    useEffect(()=>{
        const fetchUsers= async () => {
            const result=await axios.get('http://localhost:5000/user/getUsers?page=1&limit=3')
            setUsers(result.data.users.result)
            console.log(result.data.users.pageLimit)
            setPageLimit(result.data.users.pageLimit)
        }
        fetchUsers()

    }, [])

    const getPaginatedUsers = async (i: number) =>{
        const result=await axios.get(`http://localhost:5000/user/getUsers?page=${i}&limit=3`)
        setUsers(result.data.users.result)
        setPage(i)
    }

    const alterUserStatus = async (id:string) => {
        setLoadingUserId(id)

        const user={    
            id:id
        }
        const result=await axios.patch('http://localhost:5000/user/alterUserStatus', user)
        console.log(result, 'resultttt') 
        const updatedUser=result.data.users
        console.log(updatedUser, 'userssss')
        setUsers((prev)=>
            prev.map(u=>
                u.id===updatedUser.id? updatedUser:u
            )
        )
        setLoadingUserId(null)

    }   

    return (
        <div className="flex-1">
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

            <div className="p-8">
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
                    {users && users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                            {/* <Image
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                width={300}
                                height={300}
                                className="w-8 h-8 rounded-full object-cover"
                            /> */}
                            <span className="text-sm font-medium text-gray-900">{user.username}</span>
                            </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{user.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                            <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.suspended? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                            >
                                {loadingUserId==user.id? ( <LoaderIcon id={`${user.id}`} className='animate-spin text-blue-500'/> ) : (`${user.suspended? 'Suspended':'Active'}`)}
                            

                            </span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-1 text-sm">
                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">View</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={()=>alterUserStatus(user.id)}>
                                {user.suspended? "Make Active" : "Suspend"}

                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">Upgrade/</button>
                            <button className="text-blue-600 hover:text-blue-800 cursor-pointer">Downgrade</button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                <button className={`px-3 py-1 ${page==1? 'text-gray-400':'text-gray-600 hover:bg-gray-100 cursor-pointer'} rounded`}
                disabled={page==1? true:false}
                onClick={()=>getPaginatedUsers(page-1)}
                >‹</button>
                { pageLimit &&  
                    Array.from({length: pageLimit}, (_, i) => i+1)
                    .filter(p=>{
                        console.log(p)
                        if(p==1) return p<=3
                        if(p==pageLimit) return p>=pageLimit-2
                        return p>=page-1 && p<=page+1
                    })
                    .map(p=>
                        <button key={p} className={`px-3 py-1 text-gray-600 rounded ${page==p? 'bg-blue-400':'cursor-pointer hover:bg-gray-100'}`} onClick={()=>getPaginatedUsers(p)}>{p}</button>
                    )
                }
                <button className={`px-3 py-1 ${page==pageLimit? 'text-gray-400':'text-gray-600 hover:bg-gray-100 cursor-pointer'} rounded`}
                disabled={page==pageLimit? true:false}
                onClick={()=>getPaginatedUsers(page+1)}
                >›</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default UserManagement
