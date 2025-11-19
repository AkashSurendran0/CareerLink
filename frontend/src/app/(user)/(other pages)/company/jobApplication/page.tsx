"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCompanyInfo, getJobApplicants, getJobDetails } from "@/services/userService"
import Image from "next/image"

export default function JobDetailsPage() {
    const router=useRouter()
    const [jobDetails, setJobDetails]=useState<any>(null)
    const [companyDetails, setCompanyDetails]=useState<any>(null)
    const [applicants, setApplicants]=useState()
    const [showLetter, setShowLetter]=useState(false)
    const [letter, setLetter]=useState('')

    useEffect(()=>{
        const fetchDetails = async () => {
            const id=localStorage.getItem('jobId')
            if(!id) return router.push('/company/registeredCompany/jobsPosted')
            fetchApplicants(id)
            const job=await getJobDetails(id)
            const company=await getCompanyInfo()
            setJobDetails(job.details)
            setCompanyDetails(company.result)
        }

        const fetchApplicants = async (id:string) => {
            const result=await getJobApplicants(id)
            setApplicants(result.result)
        }

        fetchDetails()
    }, [])

    const displayLetter = async (letter:string) => {
        setLetter(letter)
        setShowLetter(true)
    }

    const removeLetter = async () => {
        setLetter('')
        setShowLetter(false)
    }

    return (
        <>
            {jobDetails && companyDetails && (
                <main className="mx-5 flex-1 py-6">
                    {showLetter && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={removeLetter}
                            />

                            <div className="whitespace-pre-line relative bg-white rounded-xl shadow-lg p-6 w-full z-10 mx-10">
                                {letter}
                            </div>
                        </div>
                    )}
                    {/* Job Header */}
                    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left: Job Info */}
                        <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{jobDetails.jobTitle}</h1>
                        <p className="mt-2 text-sm text-gray-500">Posted on {new Date(jobDetails.createdAt).toLocaleDateString()} · {jobDetails.open? 'Active' : 'Closed'}</p>
                        <div className="mt-3">
                            <p className="text-base font-semibold text-gray-900">{jobDetails.jobTitle}</p>
                            <p className="text-sm text-gray-600">{companyDetails.name} · {jobDetails.jobType}</p>
                        </div>
                        </div>

                        {/* Right: Company Logo */}
                        <div className="flex-shrink-0">
                        <div className="h-32 w-40 rounded-lg flex items-center justify-center">
                            <Image
                                src={companyDetails.logo}
                                height={300}
                                width={300}
                                alt="Company Logo"
                            />
                        </div>
                        </div>
                    </div>
                    </section>

                    {/* Job Description */}
                    <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
                    <p className="mt-4 text-gray-600 leading-7">
                        {jobDetails.jobDescription}
                    </p>
                    </section>

                    {/* Responsibilities */}
                    <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <h2 className="text-xl font-bold text-gray-900">Responsibilities</h2>
                    <ul className="mt-4 space-y-3 text-gray-600">
                        {jobDetails.responsibilities.map(responsibility=>(
                            <li className="flex gap-3">
                            <span className="text-gray-400">•</span>
                            <span>{responsibility}</span>
                            </li>
                        ))}
                    </ul>
                    </section>

                    {/* Requirements/Skills */}
                    <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <h2 className="text-xl font-bold text-gray-900">Requirements/Skills</h2>
                    <ul className="mt-4 space-y-3 text-gray-600">
                        {jobDetails.qualifications.map(qualification=>(
                            <li className="flex gap-3">
                            <span className="text-gray-400">•</span>
                            <span>{qualification}</span>
                            </li>
                        ))}
                    </ul>
                    </section>

                    {/* Benefits */}
                    <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <h2 className="text-xl font-bold text-gray-900">Benefits</h2>
                    <ul className="mt-4 space-y-3 text-gray-600">
                        {jobDetails.benefits?.map(benefit=>(    
                            <li className="flex gap-3">
                            <span className="text-gray-400">•</span>
                            <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                    </section>

                    {/* Applicants */}
                    <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Applicants</h2>
                        <button className="cursor-pointer inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white">
                        Find Best Match
                        </button>
                    </div>

                    {/* Table - Desktop */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Applicant</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Application Date</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants && applicants.applicants?.map((applicant) => (
                            <tr key={applicant._id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-4 py-4 text-sm text-gray-900">{applicant.userName}</td>
                                <td className="px-4 py-4 text-sm text-gray-600">{new Date(applicant.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm">
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={()=>window.open(applicant.resume)}
                                    >
                                    View Resume
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button 
                                    className="cursor-pointer text-blue-600 hover:underline"
                                    onClick={()=>displayLetter(applicant.coverLetter)}
                                    >
                                    View Cover Letter
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button className="cursor-pointer text-blue-600 hover:underline">
                                    Accept
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button className="cursor-pointer text-blue-600 hover:underline">
                                    Reject
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>

                    {/* Cards - Mobile */}
                    <div className="sm:hidden space-y-4">
                        {applicants && applicants.applicants?.map((applicant) => (
                        <div key={applicant.id} className="border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">Applied: {applicant.date}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                            <button className="cursor-pointer text-blue-600 hover:underline text-sm">
                                View Resume
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="cursor-pointer text-blue-600 hover:underline text-sm">
                                View Cover Letter
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="cursor-pointer text-blue-600 hover:underline text-sm">
                                Accept
                            </button>
                            <span className="text-gray-300">|</span>
                            <button className="cursor-pointer text-blue-600 hover:underline text-sm">
                                Reject
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    </section>
                </main>
            )}
        </>
    )
}
