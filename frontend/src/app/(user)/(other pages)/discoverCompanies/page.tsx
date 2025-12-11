"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"
import {  getAvailableCompanies, getConnectionUsers } from "@/services/userService"
import {User} from 'lucide-react'
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useLoading } from "../../template"

export default function MeetPeoplePage() {
    const router=useRouter()
    const setLoading=useLoading()
    const [searchQuery, setSearchQuery] = useState("")
    const [companies, setCompanies]=useState()
    const [companyLoading, setCompanyLoading]=useState(true)
    const debouncer=useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        getCompanies(searchQuery)
    }, [])

    const getCompanies = async (val:string) => {
        const result=await getAvailableCompanies(val)
        console.log(result)
        setCompanies(result.result.result)
        setCompanyLoading(false)
    }

    const searchCompany = async (val:string) => {
        setSearchQuery(val) 
        if(debouncer.current) clearTimeout(debouncer.current)
        debouncer.current=setTimeout(() => {
            getCompanies(val)
        }, 1500); 
    }

    const routeToCompanyViewPage = async (id:string) => {
        setLoading(true)
        router.push(`/discoverCompanies/${id}`)
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
                        onChange={(e) => searchCompany(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    </div>

                    {/* Heading */}
                    <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
                        <button
                            className={`pb-3 font-medium transition-colors text-gray-900 border-b-2 border-gray-900"`}
                        >
                            Top Companies
                        </button>
                    </div>

                    {/* Users List */}
                    <div className="space-y-4">
                        {companyLoading ? (
                            <div className="text-center mt-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                <h2 className="text-xl font-semibold text-gray-900">Loading Companies</h2>
                            </div>
                        ) : (
                            <>
                                {companies && companies.length>0 ? (
                                    <>
                                        {companies.map(company => (
                                            <>
                                                <div
                                                key={company.id}
                                                className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                                                >
                                                <div 
                                                className="cursor-pointer flex items-center space-x-4"
                                                onClick={() => routeToCompanyViewPage(company.id)}
                                                >
                                                    {company.logo? (
                                                        <Image
                                                        width={300}
                                                        height={300}
                                                        src={company.logo}
                                                        alt={company.name}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="h-10 w-10 rounded-full object-cover"/>
                                                    )}
                                                    <span className="text-gray-900 font-medium">{company.name}</span>
                                                </div>
                                                </div>
                                            </>
                                        ))}
                                    </>
                                ) : (
                                    <div className="w-full text-center py-4 bg-gray-100 text-gray-600 rounded-lg">
                                        No Companies available
                                    </div>

                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
    )
}
