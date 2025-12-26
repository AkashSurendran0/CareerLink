"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { alterUserApplication, getCompanyInfo, getJobApplicants, getJobDetails } from "@/services/userService"
import Image from "next/image"
import { enqueueSnackbar } from "notistack"
import { useLoading } from "@/app/(user)/template"

interface JobDetails {
    jobTitle: string;
    createdAt: string;
    open: boolean;
    jobType: string;
    jobDescription: string;
    responsibilities: string[];
    qualifications: string[];
    benefits: string[];
}

interface CompanyDetails {
    id: string;
    name: string;
    logo: string;
}

interface Applicant {
    applicants: {
        _id: string;
        userName: string;
        createdAt: string;
        resume: string;
        coverLetter: string;
        user: string;
        status: string;
        name: string;
        date: string;
        id: string;
    };
}

interface ApplicantsResult {
    totalCount: { _id: string; count: number }[];
    result: Applicant[];
}

export default function JobDetailsPage() {
    const setLoading = useLoading()
    const router = useRouter()
    const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
    const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null)
    const [applicants, setApplicants] = useState<ApplicantsResult | null>(null)
    const [showLetter, setShowLetter] = useState(false)
    const [letter, setLetter] = useState('')
    const [jobId, setJobId] = useState<string>('')
    const [currentFilter, setCurrentFilter] = useState('All')
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const fetchDetails = async () => {
            const id = localStorage.getItem('jobId')
            if (!id) return router.push('/company/registeredCompany/jobsPosted')
            setJobId(id)
            fetchApplicants(id)
            const job = await getJobDetails(id)
            const company = await getCompanyInfo()
            setJobDetails(job.details)
            setCompanyDetails(company.result)
        }

        const fetchApplicants = async (id: string) => {
            const result = await getJobApplicants(id, 'All')
            if (result.result) {
                const totalCount = result.result.totalCount.reduce((acc: number, val: { count: number }) => acc + val.count, 0)
                setTotalCount(totalCount)
            }
            setApplicants(result.result)
        }

        fetchDetails()
    }, [])

    const filterByQuery = async (filter: string) => {
        setCurrentFilter(filter)
        const result = await getJobApplicants(jobId, filter)
        setApplicants(result.result)
    }

    const displayLetter = async (letter: string) => {
        setLetter(letter)
        setShowLetter(true)
    }

    const removeLetter = async () => {
        setLetter('')
        setShowLetter(false)
    }

    const getCount = (filter: string) => {
        if (!applicants) return 0;
        const item = applicants.totalCount.find((i) => i._id == filter)
        return item ? item.count : 0
    }

    const acceptApplication = async (jobId: string, userId: string) => {
        if (!companyDetails) return
        setLoading(true)
        const result = await alterUserApplication(jobId, userId, companyDetails.id, 'accept')
        setLoading(false)
        if (result.result.success) {
            setApplicants((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    result: prev.result.map((user) =>
                        user.applicants.user == userId
                            ? { ...user, applicants: { ...user.applicants, status: 'Accepted' } }
                            : user
                    )
                }
            })
            enqueueSnackbar('User is accepted and message is send accordingly', { variant: 'success' })
        } else {
            enqueueSnackbar('Something went wrong, please refresh the page and try again', { variant: 'error' })
        }
    }

    const rejectApplication = async (jobId: string, userId: string) => {
        if (!companyDetails) return
        setLoading(true)
        const result = await alterUserApplication(jobId, userId, companyDetails.id, 'reject')
        setLoading(false)
        if (result.result.success) {
            setApplicants((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    result: prev.result.map((user) =>
                        user.applicants.user == userId
                            ? { ...user, applicants: { ...user.applicants, status: 'Rejected' } }
                            : user
                    )
                }
            })
            enqueueSnackbar('User has been rejected', { variant: 'success' })
        } else {
            enqueueSnackbar('Something went wrong, please refresh the page and try again', { variant: 'error' })
        }
    }

    const hireApplication = async (jobId: string, userId: string) => {
        if (!companyDetails) return
        setLoading(true)
        const result = await alterUserApplication(jobId, userId, companyDetails.id, 'hire')
        setLoading(false)
        if (result.result.success) {
            setApplicants((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    result: prev.result.map((user) =>
                        user.applicants.user == userId
                            ? { ...user, applicants: { ...user.applicants, status: 'Hired' } }
                            : user
                    )
                }
            })
            enqueueSnackbar('User has been hired', { variant: 'success' })
        } else {
            enqueueSnackbar('Something went wrong, please refresh the page and try again', { variant: 'error' })
        }
    }

    return (
        <>
            {jobDetails && companyDetails && (
                <main className="mx-5 flex-1 py-6">
                    {showLetter && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                            onClick={removeLetter}
                        >
                            <div
                                className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] p-6 flex flex-col overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="border border-gray-200 rounded-md p-4 overflow-y-auto max-h-[70vh] mb-4">
                                    {letter ? (
                                        <div
                                            className="prose max-w-none whitespace-pre-line"
                                        >
                                            {letter}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500">Loading cover letter...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        // <div className="fixed inset-0 z-50 flex items-center justify-center">
                        //     <div
                        //         className="absolute inset-0 bg-black/50"
                        //         onClick={removeLetter}
                        //     />

                        //     <div className="whitespace-pre-line relative bg-white rounded-xl shadow-lg p-6 w-full z-10 mx-10">
                        //         {letter}
                        //     </div>
                        // </div>
                    )}
                    {/* Job Header */}
                    <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            {/* Left: Job Info */}
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{jobDetails.jobTitle}</h1>
                                <p className="mt-2 text-sm text-gray-500">Posted on {new Date(jobDetails.createdAt).toLocaleDateString()} · {jobDetails.open ? 'Active' : 'Closed'}</p>
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
                            {jobDetails.responsibilities.map(responsibility => (
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
                            {jobDetails.qualifications.map(qualification => (
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
                            {jobDetails.benefits?.map(benefit => (
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
                            {/* <button className="cursor-pointer inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white">
                        Find Best Match
                        </button> */}
                        </div>
                        {applicants && (
                            <div className="gap-3">
                                {["All", "Pending", "Accepted", "Rejected", "Hired"].map((status) => (
                                    <button
                                        key={status}
                                        disabled={currentFilter == status}
                                        onClick={() => filterByQuery(status)}
                                        className={`ml-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentFilter === status
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                        <span className="mr-2 ml-2">|</span>
                                        {status == 'All' ? totalCount : getCount(status)}
                                    </button>
                                ))}
                            </div>
                        )}

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
                                    {applicants && applicants.result && applicants.result.map((applicant) => (
                                        <tr key={applicant.applicants._id}
                                            className={` ${applicant.applicants.status == 'Pending' && 'border-gray-100 hover:bg-gray-50'} ${applicant.applicants.status == 'Accepted' && 'bg-green-400 hover:bg-green-500'} ${applicant.applicants.status == 'Rejected' && 'bg-red-400 hover:bg-red-500'} ${applicant.applicants.status == 'Hired' && 'bg-yellow-400 hover:bg-yellow-500'}`}
                                        >
                                            <td className="px-4 py-4 text-sm text-gray-900">{applicant.applicants.userName}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{new Date(applicant.applicants.createdAt).toLocaleDateString()}</td>
                                            <td className="px-4 py-4 text-sm">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        className="cursor-pointer text-blue-600 hover:underline"
                                                        onClick={() => window.open(applicant.applicants.resume)}
                                                    >
                                                        View Resume
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        className="cursor-pointer text-blue-600 hover:underline"
                                                        onClick={() => displayLetter(applicant.applicants.coverLetter)}
                                                    >
                                                        View Cover Letter
                                                    </button>
                                                    {applicant.applicants.status == 'Pending' && (
                                                        <>
                                                            <span className="text-gray-300">|</span>
                                                            <button
                                                                className="cursor-pointer text-blue-600 hover:underline"
                                                                onClick={() => acceptApplication(jobId, applicant.applicants.user)}
                                                            >
                                                                Accept
                                                            </button>
                                                            <span className="text-gray-300">|</span>
                                                            <button
                                                                className="cursor-pointer text-blue-600 hover:underline"
                                                                onClick={() => rejectApplication(jobId, applicant.applicants.user)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {applicant.applicants.status == 'Accepted' && (
                                                        <>
                                                            <span className="text-gray-300">|</span>
                                                            <button
                                                                className="cursor-pointer text-blue-600 hover:underline"
                                                                onClick={() => hireApplication(jobId, applicant.applicants.user)}
                                                            >
                                                                Hire
                                                            </button>
                                                            <span className="text-gray-300">|</span>
                                                            <button
                                                                className="cursor-pointer text-blue-600 hover:underline"
                                                                onClick={() => rejectApplication(jobId, applicant.applicants.user)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards - Mobile */}
                        <div className="sm:hidden space-y-4">
                            {applicants && applicants.result && applicants.result.map((applicant) => (
                                <div key={applicant.applicants.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900">{applicant.applicants.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">Applied: {applicant.applicants.date}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            className="cursor-pointer text-blue-600 hover:underline text-sm"
                                            onClick={() => window.open(applicant.applicants.resume)}
                                        >
                                            View Resume
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            className="cursor-pointer text-blue-600 hover:underline text-sm"
                                            onClick={() => displayLetter(applicant.applicants.coverLetter)}
                                        >
                                            View Cover Letter
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        {applicant.applicants.status == 'Pending' && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    className="cursor-pointer text-blue-600 hover:underline"
                                                    onClick={() => acceptApplication(jobId, applicant.applicants.user)}
                                                >
                                                    Accept
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    className="cursor-pointer text-blue-600 hover:underline"
                                                    onClick={() => rejectApplication(jobId, applicant.applicants.user)}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {applicant.applicants.status == 'Accepted' && (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    className="cursor-pointer text-blue-600 hover:underline"
                                                    onClick={() => hireApplication(jobId, applicant.applicants.user)}
                                                >
                                                    Hire
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    className="cursor-pointer text-blue-600 hover:underline"
                                                    onClick={() => rejectApplication(jobId, applicant.applicants.user)}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
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
