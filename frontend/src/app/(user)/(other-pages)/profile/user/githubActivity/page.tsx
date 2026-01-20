'use client'

import { getGithubActivity, getGithubData, getUserDetails, getUserRepos } from '@/services/userService'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Heatmap from '@/components/heatMap'
import { Eye, Star, GitFork, LoaderIcon } from 'lucide-react'

interface GithubDetails {
    name: string
    image: string
    followers: number
    following: number
    totalStars: number
    repos: number
    [key: string]: string | number
}

interface Repo {
    id: string
    name: string
    description?: string
    url: string
    stars: number
    forks: number
    watchers: number
}

interface HeatMapData {
    [key: number]: HeatMapArray[][]
}

interface HeatMapArray {
    date: string,
    count: number, 
    color: string
}

function GitHubActivity() {
    const [loading, setLoading] = useState(true)
    const [valid, setValid] = useState(true)
    const [githubDetails, setGithubDetails] = useState<GithubDetails | null>(null)
    const [userName, setUsername] = useState('')
    const [heatMap, setHeatMap] = useState<HeatMapData | null>(null)
    const [validHeatmap, setValidHeatmap] = useState(true)
    const [repoPage, setRepoPage] = useState(0)
    const [userRepo, setUserRepo] = useState<Repo[]>([])
    const REPO_LIMIT = 3

    useEffect(() => {
        getDetails()
    }, [])

    const getDetails = async () => {
        const result = await getUserDetails()
        setLoading(false)
        if (!result || !result.userDetails) {
            setValid(false)
        } else {
            if (!result.userDetails.githubLink) return setValid(false)
            const url = result.userDetails.githubLink.split('/')
            const username = url[url.length - 1]
            const details = await getGithubData(username)
            if (details.result.success) {
                getActivityDetails(username)
                getRepos(username)
                setGithubDetails(details.result.details)
                setUsername(username)
            } else {
                setValid(false)
            }
        }
    }

    const getActivityDetails = async (name: string) => {
        const details = await getGithubActivity(name)
        if (details.result.success) {
            setHeatMap(details.result.heatmap)
        } else {
            setValidHeatmap(false)
        }
    }

    const getRepos = async (username: string) => {
        const result = await getUserRepos(repoPage, username, REPO_LIMIT)
        if (result.result.success) {
            setRepoPage(prev => prev + 1)
            setUserRepo([...result.result.data])
        }
    }

    const handleLoadMore = async () => {
        const result = await getUserRepos(repoPage, userName, REPO_LIMIT)
        if (result.result.success) {
            setRepoPage(prev => prev + 1)
            setUserRepo([...userRepo, ...result.result.data])
        }
    }

    const githubStats = [
        { label: "Followers", field: 'followers' },
        { label: "Following", field: 'following' },
        { label: "Stars", field: 'totalStars' },
        { label: "Repositories", field: 'repos' },
    ]

    return (
        <div className="space-y-8 mt-5">
            {loading ? (
                <div className="text-center mt-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <h2 className="text-xl font-semibold text-gray-900">Loading Github Details</h2>
                </div>
            ) : (
                <>
                    {valid ? (
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
                                    <Heatmap heatMap={Object.entries(heatMap).map(([date, count]) => ({ date, count }))} />
                                </div>
                            ) : (
                                <div className="text-center mt-20">
                                    <h2 className="text-xl font-semibold text-gray-900">Error fetching HeatMap Details</h2>
                                    <p className="text-gray-500 mt-2">Please refresh or try again later</p>
                                </div>
                            )}

                            {/* Top Repositories */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Repositories</h3>
                                {userRepo.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {userRepo.map((repo) => (
                                                <div
                                                    key={repo.id}
                                                    className="cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                                                    onClick={() => window.open(repo.url)}
                                                >
                                                    <div className="p-4">
                                                        <h4 className="font-semibold text-gray-900 mb-2">{repo.name}</h4>
                                                        {repo.description && (
                                                            <p className="text-sm text-gray-600 mb-4">{repo.description}</p>
                                                        )}

                                                        <div className="flex gap-4 text-sm text-gray-700">
                                                            <div className="flex items-center gap-1">
                                                                <Star size={18} />
                                                                {repo.stars}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <GitFork size={18} />
                                                                {repo.forks}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Eye size={18} />
                                                                {repo.watchers}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center py-6">
                                            <button
                                                onClick={handleLoadMore}
                                                className={`cursor-pointe text-white px-8 py-3 rounded-lg font-medium transition ${githubDetails && githubDetails.repos <= (REPO_LIMIT * repoPage) ? 'disabled bg-grey' : 'bg-blue-500 hover:bg-blue-600'}`}
                                            >
                                                Load More Repos
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="py-3 flex justify-center cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <p>User doesn&apos;t have public repos</p>
                                    </div>
                                )}

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
