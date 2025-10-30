"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getJobDetails } from "@/services/userService"
import Image from "next/image"
import { checkCompanyDetails } from "@/services/adminService"

interface Props {
    params:{
        id:string
    }
}

export default function JobDetailsPage({params}:Props) {
    const router=useRouter()
    const [jobDetails, setJobDetails]=useState<any>(null)
    const [companyDetails, setCompanyDetails]=useState<any>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
    
    
    useEffect(()=>{
        const {id}=params
        const fetchDetails = async () => {
            const job=await getJobDetails(id)
            const company=await checkCompanyDetails(job.details.company)
            setJobDetails(job.details)
            setCompanyDetails(company.company)
        }

        fetchDetails()
    }, [])

    const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setResumeFile(e.target.files[0])
        }
    }

    const handleCoverLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setCoverLetterFile(e.target.files[0])
        }
    }

    const handleSubmitApplication = () => {
        console.log("Application submitted with resume:", resumeFile, "and cover letter:", coverLetterFile)
    }

    return (
        <>
            {jobDetails && companyDetails && (
                <main className="mx-5 flex-1 py-6">
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
                    <section className="mt-6 bg-white rounded-lg p-6 mb-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Apply Details</h3>

                    {/* Add Resume */}
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-4">Add Resume</h4>
                        <div className="space-y-3">
                        <div>
                            <label htmlFor="resume-upload" className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                className="hidden"
                                />
                                <button
                                type="button"
                                onClick={() => document.getElementById("resume-upload")?.click()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md inline-block"
                                >
                                Upload
                                </button>
                                {resumeFile && <p className="text-sm text-gray-600 mt-2">{resumeFile.name}</p>}
                            </div>
                            </label>
                        </div>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-md">
                            Generate Tailored Resume
                        </button>
                        </div>
                    </div>

                    {/* Add Cover Letter */}
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-4">Add Cover Letter</h4>
                        <div className="space-y-3">
                        <div>
                            <label htmlFor="cover-letter-upload" className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <input
                                id="cover-letter-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleCoverLetterUpload}
                                className="hidden"
                                />
                                <button
                                type="button"
                                onClick={() => document.getElementById("cover-letter-upload")?.click()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md inline-block"
                                >
                                Upload
                                </button>
                                {coverLetterFile && <p className="text-sm text-gray-600 mt-2">{coverLetterFile.name}</p>}
                            </div>
                            </label>
                        </div>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-md">
                            Generate Tailored Cover Letter
                        </button>
                        </div>
                    </div>
                    </section>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
                    Cancel
                </button>
                <button
                    onClick={handleSubmitApplication}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                >
                    Submit Application
                </button>
                </div>
                </main>
            )}
        </>
    )
}
