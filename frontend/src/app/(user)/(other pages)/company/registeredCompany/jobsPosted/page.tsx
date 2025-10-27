"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/app/(user)/template"
import axios from "axios"
import { getAllCompanyJob } from "@/services/userService"

type Job = {
    _id:string,
    jobTitle:string,
    open:boolean,
    createdAt:Date,
    applicants:number | null,
    jobType:string
}

export default function CompanyJobsPage() {
    const setLoading=useLoading()
    const router=useRouter()
    const [jobs, setJobs]=useState<Job[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    // const jobs = [
    //     {
    //     id: 1,
    //     title: "Senior Software Engineer",
    //     status: "Open",
    //     postedDate: "2023-08-15",
    //     applicants: 50,
    //     type: "Full-time",
    //     },
    //     {
    //     id: 2,
    //     title: "Product Manager",
    //     status: "Open",
    //     postedDate: "2023-09-20",
    //     applicants: 35,
    //     type: "Full-time",
    //     },
    //     {
    //     id: 3,
    //     title: "UX/UI Designer",
    //     status: "Closed",
    //     postedDate: "2023-07-25",
    //     applicants: 75,
    //     type: "Full-time",
    //     },
    //     {
    //     id: 4,
    //     title: "Data Analyst",
    //     status: "Open",
    //     postedDate: "2023-09-01",
    //     applicants: 20,
    //     type: "Part-time",
    //     },
    //     {
    //     id: 5,
    //     title: "Marketing Specialist",
    //     status: "Closed",
    //     postedDate: "2023-06-10",
    //     applicants: 60,
    //     type: "Full-time",
    //     },
    // ]

    useEffect(()=>{
        const fetchJobs=async ()=>{
            const result=await getAllCompanyJob()
            setJobs(result.result)
        }

        fetchJobs()
    }, [])

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage)

    const handleFilterChange = (newFilter) => {
        setStatusFilter(newFilter)
        setCurrentPage(1)
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    const goToPostNewJobPage = () => {
        setLoading(true)
        router.push('/company/postNewJob')
    }

    return (
        <div className="space-y-6 my-5">
            <div>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs Posted</h2>
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative">
                        <svg
                            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search jobs by title"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                    </div>
                    {/* Filter by Status */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Status</h3>
                        <div className="flex flex-wrap gap-2">
                        {["all", "open", "closed"].map((status) => (
                            <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                statusFilter === status
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
            {/* Jobs Table - Desktop */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden mt-4">
                <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Applicants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Job Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Actions
                    </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 ">
                    {jobs && jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 bg-white">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {job.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                            job.open? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                        >
                            {job.open? 'Open' : 'Closed'}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(job.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.applicants?? 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.jobType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                            {job.open? "Close" : "Delete"}
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {/* Jobs Cards - Mobile */}
            <div className="md:hidden space-y-4">
                `{jobs && jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900">{job.jobTitle}</h3>
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        job.open? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                        {job.open? 'Open' : 'Closed'}
                    </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                        <span className="font-medium">Posted:</span> {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                        <span className="font-medium">Applicants:</span> {job.applicants?? 0}
                    </p>
                    <p>
                        <span className="font-medium">Type:</span> {job.jobType}
                    </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        {job.open? "Close" : "Delete"}
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View</button>
                    </div>
                </div>
                ))}`
            </div>
            {filteredJobs.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white rounded-lg shadow-sm p-4">
                <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredJobs.length)} of{" "}
                    {filteredJobs.length} jobs
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                    Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                        currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {page}
                    </button>
                    ))}
                    <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                    Next
                    </button>
                </div>
                </div>
            )}
            </div>
            {/* Post New Job Button */}
            <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg cursor-pointer" onClick={goToPostNewJobPage}>
                + Post a New Job
            </button>
            </div>
        </div>
    )
}
