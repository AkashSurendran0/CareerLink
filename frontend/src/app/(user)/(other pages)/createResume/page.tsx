"use client"

import { createResume } from "@/services/userService"
import { useState } from "react"
import { useLoading } from "../../template"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"

export default function ResumeBuilder() {
    const router=useRouter()
    const setLoading=useLoading()

    // Personal Information
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [linkedinUrl, setLinkedinUrl] = useState("")

    // Summary
    const [summary, setSummary] = useState("")

    // Dynamic fields
    const [educations, setEducations] = useState([{degree:'', institute:'', passingYear:''}])
    const [experiences, setExperiences] = useState([{position:'', company:'', span:''}])
    const [skills, setSkills] = useState([""])
    const [projects, setProjects] = useState([{ name: "", description: "" }])
    const [certifications, setCertifications] = useState([""])
    const [languages, setLanguages] = useState([""])
    const [interests, setInterests] = useState([""])

    // Add field functions
    const addEducation = () => setEducations([...educations, {degree:'', institute:'', passingYear:''}])
    const addExperience = () => setExperiences([...experiences, {position:'', company:'', span:''}])
    const addSkill = () => setSkills([...skills, ""])
    const addProject = () => setProjects([...projects, { name: "", description: "" }])
    const addCertification = () => setCertifications([...certifications, ""])
    const addLanguage = () => setLanguages([...languages, ""])
    const addInterest = () => setInterests([...interests, ""])

    const [errors, setErrors]=useState<Partial<Record<"fullName" | "email" | "phone" | "location" | "linkedinUrl" | "summary" | "educations" | "experiences" | "skills" | "projects" | "certifications" | "languages" | "interests", string>>>({})
    
    const clearError = () => {
        setErrors({
            fullName:'',
            email:'',
            phone:'',
            location:'',
            linkedinUrl:'',
            summary:'',
            educations:'',
            experiences:'',
            skills:'',
            projects:'',
            certifications:'',
            languages:'',
            interests:''
        })
    }

    // Update field functions
    const updateEducation = (index: number, field: string, value: string) => {
        const updated = [...educations]
        updated[index] = { ...updated[index], [field]: value }
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
    const updateProject = (index: number, field: string, value: string) => {
        const updated = [...projects]
        updated[index] = { ...updated[index], [field]: value }
        setProjects(updated)
    }
    const updateCertification = (index: number, value: string) => {
        const updated = [...certifications]
        updated[index] = value
        setCertifications(updated)
    }
    const updateLanguage = (index: number, value: string) => {
        const updated = [...languages]
        updated[index] = value
        setLanguages(updated)
    }
    const updateInterest = (index: number, value: string) => {
        const updated = [...interests]
        updated[index] = value
        setInterests(updated)
    }


    const handleBuildResume = async () => {
        clearError()

        if(!fullName){
            setErrors({fullName:'Please enter a name'})
            return
        }

        if(!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(fullName.trim())){
            setErrors({fullName:'Please enter a valid name'})
            return
        }

        if(!email){
            setErrors({email:'Please enter a email'})
            return
        }

        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email)){
            setErrors({email:'Please enter a valid email'})
            return
        }

        if(!phone){
            setErrors({phone:'Please enter a phone number'})
            return
        }

        if(!/^[0-9]{10}$/.test(phone)){
            setErrors({phone:'Please enter a valid phone number'})
            return
        }

        if(!location){
            setErrors({location:'Please enter your location'})
            return
        }

        if(!summary){
            setErrors({summary:'Please provide a summary'})
            return
        }

        if(summary.trim().length<20){
            setErrors({summary:'Summary must be minimum 20 words'})
            return
        }
        const allEducationEmpty=educations.every(
            (edu)=>!edu.degree && !edu.institute && !edu.passingYear
        )
        if(allEducationEmpty){
            setErrors({educations:'At least one education entry required'})
            return
        }
        for(const edu of educations){
            const isAnyFilled=!!(edu.degree || edu.institute || edu.passingYear)
            const isAllFilled=!!(edu.degree && edu.institute && edu.passingYear)
            if(isAnyFilled && !isAllFilled){
                setErrors({educations:'Please fill the remaining fields'})
                return
            }
        }
        for(const exp of experiences){
            const isAnyFilled=!!(exp.company || exp.position || exp.span)
            const isAllFilled=!!(exp.company && exp.position && exp.span)

            if(isAnyFilled && !isAllFilled){
                setErrors({experiences:'Please fill the remaining fields'})
                return
            }
        }

        if(skills.every(skill=>skill.trim()=='')){
            setErrors({skills:'Please enter atleast one skill'})
            return
        }

        for(const project of projects){
            const isAnyFilled=!!(project.description || project.name)
            const isAllFilled=!!(project.description && project.name)

            if(isAnyFilled && !isAllFilled){
                setErrors({projects:'Please fill the remaining fields'})
                return
            }
        }

        const correctLanguages=languages.every(lang=>/^(?:[A-Za-z]+(?:\s[A-Za-z]+)*)?$/.test(lang))
        if(!correctLanguages){
            setErrors({languages:'Please enter a valid language'})
            return
        }

        const finalEducation=educations.filter(edu=>edu.degree.trim()!='' && edu.institute.trim()!='' && edu.passingYear.trim()!='')
        const finalExperiences=experiences.filter(exp=>exp.company.trim()!='' && exp.position.trim()!='' && exp.span.trim()!='')
        const finalSkills=skills.filter(skill=>skill.trim()!='')
        const finalProjects=projects.filter(project=>project.name.trim()!='' && project.description.trim())
        const finalCertifications=certifications.filter(cert=>cert.trim()!='')
        const finalLanguages=languages.filter(lang=>lang.trim()!='')
        const finalInterests=interests.filter(interest=>interest.trim()!='')

        const data = {
            fullName,
            email,
            phone,
            location,
            linkedinUrl,
            summary,
            finalEducation,
            finalExperiences,
            finalSkills,
            finalProjects,
            finalCertifications,
            finalLanguages,
            finalInterests
        }

        setLoading(true)
        const result=await createResume(data)
        // return console.log(result)
        if(!result.result.success){
            setLoading(false)
            return enqueueSnackbar(result.result.message, {variant:'error'})
        } 
        sessionStorage.setItem('resumePdf', result.result.base64Pdf)
        sessionStorage.setItem('resumeHtml', result.result.html)

        router.push('/createResume/resumePreview')
    }

    return (

        <main className="flex-1 overflow-y-auto">
            <div className="bg-white max-w-8xl m-3 px-4 sm:px-6 lg:px-8 py-8 rounded-sm shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Resume Builder</h1>

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
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your location"
                    />
                    {errors.location && (
                        <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL</label>
                    <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your LinkedIn profile URL"
                    />
                    {errors.linkedinUrl && (
                        <p className="text-red-500 text-sm">{errors.linkedinUrl}</p>
                    )}
                    </div>
                </div>
                </section>

                {/* Summary */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Summary/About Me</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
                    <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="Write a brief summary about yourself"
                    />
                    {errors.summary && (
                        <p className="text-red-500 text-sm">{errors.summary}</p>
                    )}
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
                                value={education.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter degree"
                            />
                            <input
                                key={index}
                                type="text"
                                value={education.institute}
                                onChange={(e) => updateEducation(index, 'institute', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Institution"
                            />
                            <input
                                key={index}
                                type="text"
                                value={education.passingYear}
                                onChange={(e) => updateEducation(index, 'passingYear', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Passing Year"
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
                                value={experience.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter company name"
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

                {/* Projects */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Projects</h2>
                <div className="space-y-6">
                    {projects.map((project, index) => (
                    <div key={index} className="space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                        <input
                            type="text"
                            value={project.name}
                            onChange={(e) => updateProject(index, "name", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter project name"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">About the Project</label>
                        <textarea
                            value={project.description}
                            onChange={(e) => updateProject(index, "description", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                            placeholder="Describe your project, its goals, and your contributions"
                        />
                        </div>
                    </div>
                    ))}
                    {errors.projects && (
                        <p className="text-red-500 text-sm">{errors.projects}</p>
                    )}
                    <button
                    onClick={addProject}
                    className="px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Project
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

                {/* Languages */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Languages</h2>
                <div className="space-y-4">
                    {languages.map((language, index) => (
                    <input
                        key={index}
                        type="text"
                        value={language}
                        onChange={(e) => updateLanguage(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a language"
                    />
                    ))}
                    {errors.languages && (
                        <p className="text-red-500 text-sm">{errors.languages}</p>
                    )}
                    <button
                    onClick={addLanguage}
                    className="px-4 py-2  bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                    Add Language
                    </button>
                </div>
                </section>

                {/* Interests */}
                <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Interests</h2>
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
                    onClick={handleBuildResume}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium cursor-pointer"
                >
                    Build Resume
                </button>
                </div>
            </div>
        </main>
  )
}
