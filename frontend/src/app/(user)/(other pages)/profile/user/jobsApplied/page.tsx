"use client";

import { getUserAppliedJobs } from '@/services/userService';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';

function JobsApplied() {
    const [jobs, setJobs]=useState(null)

    useEffect(() => {
        async function getJobs() {
            const jobsApplied=await getUserAppliedJobs()
            console.log(jobsApplied)
            if(jobsApplied.jobs.success) setJobs(jobsApplied.jobs.jobs)
        }

        getJobs()
    }, [])

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-gray-100 text-gray-700'
            case 'Accepted':
                return 'bg-green-100 text-green-700'
            case 'Rejected':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div>
            <div className="space-y-6">
                {jobs ? (
                    <>
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <div className="mb-4">
                                    <p className="text-sm text-blue-600 font-medium mb-1">Applied on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.details.jobTitle}</h3>
                                    <p className="text-gray-600 text-sm">
                                       {job.companyName} · {job.details.location} · {job.details.type}
                                    </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(job.applicants.status)}`}>
                                        {job.applicants.status}
                                    </span>
                                    </div>
                                </div>
                                <div className="md:col-span-1 flex items-center justify-center md:justify-end">
                                    <div className={`w-full md:w-40 h-32 rounded-lg flex items-center justify-center p-4 text-white text-center`}>
                                    <Image
                                    width={300}
                                    height={300}
                                    alt='Company Logo'
                                    src={job.companyLogo}
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className='flex justify-center align-middle py-3'>
                        <h2>You have no job applications</h2>
                    </div>
                )} 
            </div>
        </div>
    )
}

export default JobsApplied
