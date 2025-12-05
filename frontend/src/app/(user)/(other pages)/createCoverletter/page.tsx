"use client"

import { createCoverLetter, createResume } from "@/services/userService"
import { useState } from "react"
import { useLoading } from "../../template"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"

export default function ResumeBuilder() {
    const router=useRouter()
    const setLoading=useLoading()

    const [fullName, setFullName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [position, setPosition] = useState("")
    const [hrName, setHrName] = useState("")


    const [educations, setEducations] = useState([''])
    const [experiences, setExperiences] = useState([{position:'', span:''}])
    const [skills, setSkills] = useState([""])
    const [certifications, setCertifications] = useState([""])
    const [interests, setInterests] = useState([""])

    const addEducation = () => setEducations([...educations, ''])
    const addExperience = () => setExperiences([...experiences, {position:'', span:''}])
    const addSkill = () => setSkills([...skills, ""])
    const addCertification = () => setCertifications([...certifications, ""])
    const addInterest = () => setInterests([...interests, ""])

    const [errors, setErrors]=useState<Partial<Record<"fullName" | "companyName" | "position" | "hrName" | "educations" | "experiences" | "skills" | "certifications" | "interests", string>>>({})
    
    const clearError = () => {
        setErrors({
            fullName:'',
            companyName:'',
            position:'',
            hrName:'',
            educations:'',
            experiences:'',
            skills:'',
            certifications:'',
            interests:''
        })
    }

    // Update field functions
    const updateEducation = (index: number, value: string) => {
        const updated = [...educations]
        updated[index] = value
        setEducations(updated)
    }
    const updateExperience = (index: number, field: string, value: string) => {
        const updated = [...experiences]
        updated[index] = { ...updated[index], [field]: value }
        setExperiences(updated)
    }
    const updateSkill = (index: number, value: string) => {
        const updated = [...skills]
        updated[index] = value
        setSkills(updated)
    }
    const updateCertification = (index: number, value: string) => {
        const updated = [...certifications]
        updated[index] = value
        setCertifications(updated)
    }
    const updateInterest = (index: number, value: string) => {
        const updated = [...interests]
        updated[index] = value
        setInterests(updated)
    }


    const handleCreateCoverLetter = async () => {
        clearError()

        if(!fullName){
            setErrors({fullName:'Please enter a name'})
            return
        }

        if(!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(fullName.trim())){
            setErrors({fullName:'Please enter a valid name'})
            return
        }

        if(!companyName){
            setErrors({companyName:'Please enter company name'})
            return
        }

        if(!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(companyName.trim())){
            setErrors({companyName:'Please enter a valid name'})
            return
        }

        if(!position){
            setErrors({position:'Please enter your position'})
            return
        }


        if(hrName.trim()!='' && !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(hrName.trim())){
            setErrors({hrName:'Please enter a valid HR name'})
            return
        }

        const allEducationEmpty=educations.every(
            (edu)=>edu.trim()==''
        )
        if(allEducationEmpty){
            setErrors({educations:'At least one education entry required'})
            return
        }

        for(const exp of experiences){
            const isAnyFilled=!!(exp.position || exp.span)
            const isAllFilled=!!(exp.position && exp.span)

            if(isAnyFilled && !isAllFilled){
                setErrors({experiences:'Please fill the remaining fields'})
                return
            }
        }


        if(skills.every(skill=>skill.trim()=='')){
            setErrors({skills:'Please enter atleast one skill'})
            return
        }

        const finalEducation=educations.filter(edu=>edu.trim()!='')
        const finalExperiences=experiences.filter(exp=> exp.position.trim()!='' && exp.span.trim()!='')
        const finalSkills=skills.filter(skill=>skill.trim()!='')
        const finalCertifications=certifications.filter(cert=>cert.trim()!='')
        const finalInterests=interests.filter(interest=>interest.trim()!='')

        const data = {
            fullName,
            companyName,
            position,
            hrName,
            finalEducation,
            finalExperiences,
            finalSkills,
            finalCertifications,
            finalInterests
        }
        console.log(data)
        setLoading(true)
        const result=await createCoverLetter(data)
        if(!result.result.success){
            setLoading(false)
            return enqueueSnackbar(result.result.message, {variant:'error'})
        } 
        console.log(result)
        sessionStorage.setItem('coverLetter', result.result.content)

        router.push('/createCoverletter/coverLetterPreview')
    }

    return (

        <main className="flex-1 overflow-y-auto">
            <div className="bg-white max-w-8xl m-3 px-4 sm:px-6 lg:px-8 py-8 rounded-sm shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Cover Letter</h1>

                {/* Personal Information */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">{errors.fullName}</p>
                        )}
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Company Information</h2>
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                    />
                    {errors.companyName && (
                        <p className="text-red-500 text-sm">{errors.companyName}</p>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter position"
                    />
                    {errors.position && (
                        <p className="text-red-500 text-sm">{errors.position}</p>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager Name</label>
                    <input
                        type="email"
                        value={hrName}
                        onChange={(e) => setHrName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter hr name"
                    />
                    {errors.hrName && (
                        <p className="text-red-500 text-sm">{errors.hrName}</p>
                    )}
                    </div>
                </div>
                </section>

                {/* Education */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Education</h2>
                <div className="space-y-4">
                    {educations.map((education, index) => (
                        <div className="flex gap-2">
                            <input
                                key={index}
                                type="text"
                                value={education}
                                onChange={(e) => updateEducation(index, e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter degree"
                            />
                        </div>
                    ))}
                    {errors.educations && (
                        <p className="text-red-500 text-sm">{errors.educations}</p>
                    )}
                    <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Education
                    </button>
                </div>
                </section>

                {/* Work Experience */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Work Experience</h2>
                <div className="space-y-4">
                    {experiences.map((experience, index) => (
                        <div className="flex gap-2">
                            <input
                                key={index}
                                type="text"
                                value={experience.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the position"
                            />
                            <input
                                key={index}
                                type="text"
                                value={experience.span}
                                onChange={(e) => updateExperience(index, 'span', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter working span"
                            />
                        </div>
                    ))}
                    {errors.experiences && (
                        <p className="text-red-500 text-sm">{errors.experiences}</p>
                    )}
                    <button
                    onClick={addExperience}
                    className="px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Work Experience
                    </button>
                </div>
                </section>

                {/* Skills */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
                <div className="space-y-4">
                    {skills.map((skill, index) => (
                    <input
                        key={index}
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a skill"
                    />
                    ))}
                    {errors.skills && (
                        <p className="text-red-500 text-sm">{errors.skills}</p>
                    )}
                    <button
                    onClick={addSkill}
                    className="px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Skill
                    </button>
                </div>
                </section>

                {/* Certifications/Awards */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Certifications/Awards</h2>
                <div className="space-y-4">
                    {certifications.map((cert, index) => (
                    <input
                        key={index}
                        type="text"
                        value={cert}
                        onChange={(e) => updateCertification(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter certification or award"
                    />
                    ))}
                    {errors.certifications && (
                        <p className="text-red-500 text-sm">{errors.certifications}</p>
                    )}
                    <button
                    onClick={addCertification}
                    className="px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Certification/Award
                    </button>
                </div>
                </section>

                {/* Interests */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Why interested in the company?</h2>
                <div className="space-y-4">
                    {interests.map((interest, index) => (
                    <input
                        key={index}
                        type="text"
                        value={interest}
                        onChange={(e) => updateInterest(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter an interest"
                    />
                    ))}
                    {errors.interests && (
                        <p className="text-red-500 text-sm">{errors.interests}</p>
                    )}
                    <button
                    onClick={addInterest}
                    className="px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Interest
                    </button>
                </div>
                </section>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mb-8">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium cursor-pointer">
                    Cancel
                </button>
                <button
                    onClick={handleCreateCoverLetter}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium cursor-pointer"
                >
                    Create Cover Letter
                </button>
                </div>
            </div>
        </main>
  )
}
