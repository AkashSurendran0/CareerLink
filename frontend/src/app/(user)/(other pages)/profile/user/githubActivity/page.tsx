'use client'

import { getGithubActivity, getGithubData, getUserDetails } from '@/services/userService'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import Heatmap from '@/components/heatMap'

function GitHubActivity() {
    const [loading, setLoading]=useState(true)
    const [valid, setValid]=useState(true)
    const [githubDetails, setGithubDetails]=useState()
    const [userName, setUsername]=useState('')
    const [heatMap, setHeatMap]=useState()
    const [validHeatmap, setValidHeatmap]=useState(true)

    useEffect(()=>{
        getDetails()
    }, [])

    const getDetails= async () => {
        const result=await getUserDetails()
        setLoading(false)
        if(!result || !result.userDetails){
            setValid(false)
        }else{
            const url=result.userDetails.githubLink.split('/')
            const username=url[url.length-1]
            const details=await getGithubData(username)
            if(details.result.success){
                getActivityDetails(username)
                setGithubDetails(details.result.details)
                setUsername(username)
            }else{
                setValid(false)
            }
        }
    }

    const getActivityDetails = async (name:string) => {
        const details=await getGithubActivity(name)
        if(details.result.success){
            setHeatMap(details.result.heatmap)
        }else{
            setValidHeatmap(false)
        }
        console.log('details', details)
    }

     const githubStats = [
        { label: "Followers", field:'followers'},
        { label: "Following", field:'following'},
        { label: "Stars", field:'totalStars'},
        { label: "Repositories", field:'repos'},
    ]

    const contributionHeatmap = Array.from({ length: 7 }, () =>
        Array.from({ length: 26 }, () => Math.floor(Math.random() * 5)),
    )

    const topRepositories = [
        {
        id: 1,
        title: "Project Alpha",
        description: "A full-stack web application for project management.",
        image: "/images/attachments-gen-images-public-innovate-solutions-logo.jpg",
        },
        {
        id: 2,
        title: "Data Insights Dashboard",
        description: "Interactive dashboard for visualizing data insights.",
        image: "/images/attachments-gen-images-public-requirements-illustration-with-building-and-plants.jpg",
        },
        {
        id: 3,
        title: "Mobile App UI Kit",
        description: "A collection of UI components for mobile app development.",
        image: "/images/attachments-gen-images-public-decorative-brush-pen-and-plants.jpg",
        },
    ]

    const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"]

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
        case "Pending":
            return "bg-gray-100 text-gray-700"
        case "Accepted":
            return "bg-green-100 text-green-700"
        case "Rejected":
            return "bg-red-100 text-red-700"
        default:
            return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <div className="space-y-8 mt-5">
            {loading? (
                <div className="text-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <h2 className="text-xl font-semibold text-gray-900">Loading Github Details</h2>
                </div>
            ) : ( 
                <>
                    {valid? (
                        <>
                        {githubDetails && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{githubDetails.name}</h3>
                                        <a href={`https://github.com/${userName}`} className="text-blue-600 hover:underline text-sm">
                                        github.com/{userName}
                                        </a>
                                    </div>
                                    <div className="md:col-span-1 flex items-center justify-center md:justify-end">
                                        <div className="w-full md:w-40 h-40 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <Image
                                            width={300}
                                            height={300}
                                            alt='User Profile'
                                            src={githubDetails.image}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {githubStats.map((stat, index) => (
                                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                                            <p className="text-2xl font-bold text-gray-900">{githubDetails[stat.field]}</p>
                                            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                                {/* Contribution Heatmap */}
                            {heatMap && validHeatmap ? (
                                <div>
                                    <Heatmap heatMap={heatMap}/>
                                </div>
                            ) : (
                                <div className="text-center mt-20">
                                    <h2 className="text-xl font-semibold text-gray-900">Error fetching HeatMap Details</h2>
                                    <p className="text-gray-500 mt-2">Please refresh or try again later</p>
                                </div>
                            )}

                                {/* Top Repositories */}
                            <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Repositories</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {topRepositories.map((repo) => (
                                    <div
                                        key={repo.id}
                                        className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-full h-40 overflow-hidden bg-gray-200">
                                        <img
                                            src={repo.image || "/placeholder.svg"}
                                            alt={repo.title}
                                            className="w-full h-full object-cover"
                                        />
                                        </div>
                                        <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{repo.title}</h4>
                                        <p className="text-sm text-gray-600">{repo.description}</p>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            </div>  
                        </>
                    ) : (
                        <div className="text-center mt-20">
                            <h2 className="text-xl font-semibold text-gray-900">Error fetching github details</h2>
                            <p className="text-gray-500 mt-2">Please check your link or provide one</p>
                        </div>
                    )}    
                </>
            )}
        </div>
    )
}

export default GitHubActivity
