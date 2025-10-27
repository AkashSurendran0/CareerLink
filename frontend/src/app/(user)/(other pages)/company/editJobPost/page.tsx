"use client"

import { addJob } from "@/services/userService"
import Image from "next/image"
import type React from "react"
import { useLoading } from "@/app/(user)/template"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateJobPage() {
    const router=useRouter()
    const setLoading=useLoading()
    const [formData, setFormData] = useState({
        jobTitle: "",
        department: "",
        jobType: "",
        location: "",
        jobDescription: "",
        experienceLevel: "",
        applicationDeadline: undefined,
    })

    const [errors, setErrors]=useState<Partial<Record<"benefits" | "responsibilities" | "qualifications" | "jobTitle" | "department" | "jobType" | "location" | "jobDescription" | "experienceLevel" | "applicationDeadline", string>>>({})
    
    const clearErrors = () => {
        setErrors({
            benefits:'',
            responsibilities:'',
            qualifications:'',
            jobTitle:'',
            department:'',
            jobType:'',
            location:'',
            jobDescription:'',
            experienceLevel:'',
            applicationDeadline:''
        })
    }

    const [qualifications, setQualifications] = useState([""])
    const [responsibilities, setResponsibilities] = useState([""])
    const [benefits, setBenefits] = useState([""])
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    
    const handleArrayChange = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, fullValue:string[]) => {
        console.log(index, value, setter)
        setter(fullValue.map((val, ind)=>ind==index? value : val))
    }

    const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter((prev) => [...prev, ""])
    }

    const removeField = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter((prev) => prev.filter((_, i) => i !== index))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearErrors()
        
        if(!formData.jobTitle){
            setErrors({jobTitle:'Please enter a job title'})
            return
        }

        if(formData.jobTitle.length<3){
            setErrors({jobTitle:'Please enter a valid title'})
            return
        }

        if(!formData.department){
            setErrors({department:'Please enter a department'})
            return
        }

        if(formData.department.length<3){
            setErrors({department:'Please enter a valid department'})
            return
        }

        if(!formData.jobType){
            setErrors({jobType:'Please select a job type'})
            return
        }

        if(!formData.location){
            setErrors({location:'Please enter a location'})
            return
        }

        if(formData.location.length<3){
            setErrors({location:'Enter a valid location'})
            return
        }

        if(!formData.jobDescription){
            setErrors({jobDescription:'Please enter a job description'})
            return
        }

        if(formData.jobDescription.trim().length<50){
            setErrors({jobDescription:'Description must be of 50 words'})
            return
        }

        if(qualifications.every(qualification=>qualification.trim()=='')){
            setErrors({qualifications:'Atleast one qualification required'})
            return
        }

        if(responsibilities.every(res=>res.trim()=='')){
            setErrors({responsibilities:'Atleast one responsibility required'})
            return
        }

        if(!formData.experienceLevel){
            setErrors({experienceLevel:'Please select an experience level'})
            return
        }

        if(!formData.applicationDeadline){
            setErrors({applicationDeadline:'Please select a deadline'})
            return
        }

        if(new Date(formData.applicationDeadline) <= new Date(Date.now())){
            setErrors({applicationDeadline:'Please enter a valid deadline'})
            return
        }

        setLoading(true)

        const finalQualifications=qualifications.filter(qualification=>qualification.trim()!='')
        const finalResponsibilities=responsibilities.filter(res=>res.trim()!='')
        const finalBenefits=benefits.filter(benefit=>benefit.trim()!='')

        const jobDetails={
            ...formData,
            finalQualifications,
            finalResponsibilities,
            finalBenefits
        }

        const result=await addJob(jobDetails)
        console.log(result)
        if(result.result.success){
            router.push('/company/registeredCompany/jobsPosted')
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a new job</h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    <div>
                        <Image
                        width={300}
                        height={300}
                        src="/job-posting-illustration-with-plants.jpg"
                        alt="Job posting"
                        className="w-full h-40 object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h2>
                        <p className="text-gray-600 text-sm">Enter the basic details about the job.</p>
                    </div>
                    </div>

                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.jobTitle && (
                            <p className="text-red-500 text-sm">{errors.jobTitle}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department/Team</label>
                        <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g., Engineering"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.department && (
                            <p className="text-red-500 text-sm">{errors.department}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                        <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        </select>
                        {errors.jobType && (
                            <p className="text-red-500 text-sm">{errors.jobType}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Remote, New York"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.location && (
                            <p className="text-red-500 text-sm">{errors.location}</p>
                        )}
                    </div>
                    </div>
                </div>

                {/* Job Description Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <Image
                        width={300}
                        height={300}
                        src="/job-description-illustration-with-person.jpg"
                        alt="Job description"
                        className="w-full h-40 object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Job Description</h2>
                        <p className="text-gray-600 text-sm">
                        Provide a detailed description of the job responsibilities and requirements.
                        </p>
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                    <textarea
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleInputChange}
                        placeholder="Enter job description..."
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.jobDescription && (
                        <p className="text-red-500 text-sm">{errors.jobDescription}</p>
                    )}
                    </div>
                </div>

                {/* Requirements Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <Image
                        width={300}
                        height={300}
                        src="/requirements-illustration-with-building-and-plants.jpg"
                        alt="Requirements"
                        className="w-full h-40 object-cover rounded-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Requirements</h2>
                        <p className="text-gray-600 text-sm">
                        Specify the qualifications, experience, and education required for the job.
                        </p>
                    </div>
                    </div>

                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                        {qualifications.map((qualification, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                            type="text"
                            value={qualification}
                            onChange={(e) => handleArrayChange(index, e.target.value, setQualifications, qualifications)}
                            placeholder="e.g., Java, Python, React"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {qualifications.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeField(index, setQualifications)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                ✕
                            </button>
                            )}
                        </div>
                        ))}
                        {errors.qualifications && (
                            <p className="text-red-500 text-sm">{errors.qualifications}</p>
                        )}
                        <button
                        type="button"
                        onClick={() => addField(setQualifications)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                        Add Qualification +
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                        {responsibilities.map((resp, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                            type="text"
                            value={resp}
                            onChange={(e) => handleArrayChange(index, e.target.value, setResponsibilities, responsibilities)}
                            placeholder="e.g., Java, Python, React"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {responsibilities.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeField(index, setResponsibilities)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                ✕
                            </button>
                            )}
                        </div>
                        ))}
                        {errors.responsibilities && (
                            <p className="text-red-500 text-sm">{errors.responsibilities}</p>
                        )}
                        <button
                        type="button"
                        onClick={() => addField(setResponsibilities)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                        Add Responsibility +
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                        {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleArrayChange(index, e.target.value, setBenefits, benefits)}
                            placeholder="e.g., Health insurance, 401k"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {benefits.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeField(index, setBenefits)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                ✕
                            </button>
                            )}
                        </div>
                        ))}
                        <button
                        type="button"
                        onClick={() => addField(setBenefits)}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                        Add Benefits +
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                        <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        <option value="">Select Experience Level</option>
                        <option value="entry">Entry Level</option>
                        <option value="mid">Mid Level</option>
                        <option value="senior">Senior Level</option>
                        <option value="executive">Executive</option>
                        </select>
                        {errors.experienceLevel && (
                            <p className="text-red-500 text-sm">{errors.experienceLevel}</p>
                        )}
                    </div>

                    </div>
                </div>

                {/* Application Settings Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <Image
                        src="/application-settings-illustration-with-phone-and-c.jpg"
                        alt="Application settings"
                        className="w-full h-40 object-cover rounded-lg"
                        width={300}
                        height={300}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Application Settings</h2>
                        <p className="text-gray-600 text-sm">Configure the application process and deadlines.</p>
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                    <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.applicationDeadline && (
                        <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>
                    )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pb-8">
                    <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                    Post Job
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
    </div>
  )
}
