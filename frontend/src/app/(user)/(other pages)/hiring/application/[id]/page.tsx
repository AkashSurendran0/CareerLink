"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { applyJobWithFile, applyJobWithUrl, getAllUserResumes, getJobDetails } from "@/services/userService"
import Image from "next/image"
import { checkCompanyDetails } from "@/services/adminService"
import { useLoading } from "@/app/(user)/template"
import { enqueueSnackbar } from "notistack"

interface Props {
    params:{
        id:string
    }
}

export default function JobDetailsPage({params}:Props) {
    const router=useRouter()
    const setLoading=useLoading()
    const [jobDetails, setJobDetails]=useState<any>(null)
    const [companyDetails, setCompanyDetails]=useState<any>(null)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [coverLetter, setCoverLetter]=useState('')
    const [resumeUrl, setResumeUrl]=useState<File | null | string>(null)
    const [openOptions, setOpenOptions]=useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [openSavedResumes, setOpenSavedResumes]=useState(false)
    const [resumes, setResumes]=useState()
    const [resumeName, setResumeName]=useState<string | null>()
    
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

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onSelectFromSaved = async () => {
        setLoading(true)
        const result=await getAllUserResumes()
        if(result.resumes.success){
            console.log(result)
            setLoading(false)
            setOpenOptions(false)
            setOpenSavedResumes(true)
            setResumes(result.resumes.resume)
        }
    }

    const closeResumeBox = () => {
        setOpenSavedResumes(false)
    }

    const previewResume = (e, url) => {
        e.stopPropagation()
        window.open(url)
    }

    const setUrl = (url, name) => {
        setResumeUrl(url)
        setResumeName(name)
        setOpenSavedResumes(false)
    }

    const clearResume = () => {
        setResumeName(null)
        if(resumeUrl) setResumeUrl(null)
        if(resumeFile) setResumeFile(null)
    }

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file=e.target.files?.[0]
        if(file!.type != 'application/pdf'){
            enqueueSnackbar('Please select a valid pdf', {variant:'error'})
            return
        }

        setResumeName(file!.name)
        setResumeFile(file!)
        setOpenOptions(false)
        console.log(file)
    }

    const handleSubmitApplication = async () => {
        if(!resumeFile && !resumeUrl){
            enqueueSnackbar('A resume is required', {variant:'error'})
            return
        }
        if(!coverLetter){
            enqueueSnackbar('Cover letter is required', {variant:'error'})
            return
        }
        if(coverLetter.trim().length<20){
            enqueueSnackbar('Cover letter must be minimum 20 characters', {variant:'error'})
            return  
        }

        setLoading(true)
        if(resumeUrl){
            const {id}=params
            const data = {
                id,
                resumeUrl,
                coverLetter
            }        
            const result=await applyJobWithUrl(data)   
            console.log(result)
        }else{
            const {id}=params
            const formData=new FormData()
            formData.append('resume', resumeFile)
            formData.append('coverLetter', coverLetter)
            formData.append('id', id)

            const result=await applyJobWithFile(formData)
            console.log(result)
        }
    }

    return (
        <>
            {jobDetails && companyDetails && (
                <main className="mx-5 flex-1 py-6">
                    {openOptions && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={()=>setOpenOptions(false)}
                            />

                            <div className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm z-10">
                                <h2 className="text-xl font-semibold text-center mb-4">
                                Select an Option
                                </h2>

                                <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleFileSelect}
                                    className="cursor-pointer w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                                >
                                    Select From Files
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handlePdfChange}
                                />

                                <button
                                    onClick={onSelectFromSaved}
                                    className="cursor-pointer w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                                >
                                    Select From Saved
                                </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {openSavedResumes && resumes && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={closeResumeBox}
                            />

                            <div className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md z-10">
                                <h2 className="text-xl font-semibold text-center mb-4">
                                Saved Resumes
                                </h2>

                                <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-1">
                                {resumes.resumes.length === 0 ? (
                                    <p className="text-gray-500 text-center">No saved resumes found.</p>
                                ) : (
                                    resumes.resumes.map((resume) => (
                                    <div
                                        key={resume._id}
                                        onClick={()=>setUrl(resume.url, resume.name)}
                                        className="cursor-pointer border rounded-lg p-3 flex justify-between items-center"
                                    >
                                        <div>
                                        <p className="font-medium">{resume.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Created: {new Date(resume.createdAt).toLocaleDateString()}
                                        </p>
                                        </div>

                                        <button
                                        onClick={(e) => previewResume(e,resume.url)}
                                        className="cursor-pointer px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                                        >
                                        Preview
                                        </button>
                                    </div>
                                    ))
                                )}
                                </div>
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
                        {jobDetails.responsibilities.map((responsibility, ind)=>(
                            <li className="flex gap-3" key={ind}>
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
                        {jobDetails.qualifications.map((qualification, ind)=>(
                            <li className="flex gap-3" key={ind}>
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
                        {jobDetails.benefits?.map((benefit, ind)=>(    
                            <li className="flex gap-3" key={ind}>
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
                        {resumeName? (
                            <>
                                <div className="space-y-3">
                                <div>
                                    <span><b>Selected Resume</b> : {resumeName} 
                                        <button 
                                        className="bg-red-500 hover:bg-red-600 cursor-pointer ml-2 py-1 px-3 text-white rounded-md"
                                        onClick={clearResume}
                                        >
                                            Clear
                                        </button>
                                    </span>
                                </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h4 className="font-semibold text-gray-900 mb-4">Add Resume</h4>
                                <div className="space-y-3">
                                <div>
                                    <label htmlFor="resume-upload" className="block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                        <button
                                        type="button"
                                        onClick={() => setOpenOptions(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md inline-block"
                                        >
                                        Upload
                                        </button>
                                        {resumeFile && <p className="text-sm text-gray-600 mt-2">{resumeFile.name}</p>}
                                    </div>
                                    </label>
                                </div>
                                <button className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-md">
                                    Generate Tailored Resume
                                </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Add Cover Letter */}
                    <div className="mb-8">
                        <h4 className="font-semibold text-gray-900 mb-4">Add Cover Letter</h4>
                        <div className="space-y-3">
                        <div>
                            <label htmlFor="cover-letter-upload" className="block">
                            <div className="text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <textarea 
                                id="cover-letter-upload"
                                value={coverLetter}
                                onChange={(e)=>setCoverLetter(e.target.value)}
                                className="w-full h-30 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2"
                                />
                            </div>
                            </label>
                        </div>
                        {!coverLetter && (
                            <button className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-md">
                                Generate Tailored Cover Letter
                            </button>
                        )}
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
