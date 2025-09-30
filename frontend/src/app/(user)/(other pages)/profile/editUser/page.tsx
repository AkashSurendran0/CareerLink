"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { useLoading } from "@/app/(user)/template"
import { useRouter } from "next/navigation"
import {UserCircle} from 'lucide-react'


export default function EditProfile() {
    const router=useRouter()
    const setLoading=useLoading()
    const fileInputRef=useRef<HTMLInputElement>(null)
    const [skillsFields, setSkillsFields] = useState([{ id: 1, value: "" }])
    const [educationFields, setEducationFields] = useState([{ id: 1, degree:"", university:"", passingYear:"" }])
    const [experienceFields, setExperienceFields] = useState([{ id: 1, company:'', experience:'' }])
    const [previewImage, setPreviewImage]=useState()
    const [detailsForm, setDetailsForm]=useState({
        username:'',
        profilePicture:null as File | null,
        gender:'',
        location:'',
        proficiency:'',
        aboutMe:'',
        experience:[{
            company:'',
            experience:''
        }],
        skills:[''],
        education:[{
            degree:'',
            university:'',
            passingYear:''
        }],
        linkedinLink:'',
        githubLink:''
    })
    const [errors, setErrors]=useState<Partial<Record<"profilePicture" | "username" | "gender" | "location" | "aboutMe" | "experience" | "skills" | "education" | "linkedinLink" | "githubLink" | "proficiency", string>>>({})

    useEffect(()=>{
    
            const fetchUserDetails=async ()=>{
                const token=localStorage.getItem('token')
                const result=await axios.get('http://localhost:5000/user/getUserDetails', {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                const details=result.data.userDetails
                setDetailsForm({...details, skills:[...details.skills], education:[...details.education], experience:[...details.experience]})
            }
    
            fetchUserDetails()
        }, [])

    const clearErrors = () => {
        setErrors({
        gender:'',
        location:'',
        aboutMe:'',
        experience:'',
        skills:'',
        education:'',
        linkedinLink:'',
        githubLink:''
        })
    }
    
    const addSkillField = () => {
        const newId = skillsFields.length + 1
        setSkillsFields([...skillsFields, { id: newId, value: "" }])
        setDetailsForm(prev=>({
        ...prev,
        skills:[...prev.skills, '']
        }))
    }

    const addEducationField = () => {
        const newId = educationFields.length + 1
        setEducationFields([...educationFields, { id: newId, degree:"", university:"", passingYear:"" }])
        setDetailsForm(prev=>({
        ...prev,
        education:[...prev.education, {degree:'', university:'', passingYear:''}]
        }))
    }

    const addExperienceField = () => {
        const newId = experienceFields.length + 1
        setExperienceFields([...experienceFields, {id:newId, company:'', experience:''}])
        setDetailsForm(prev=>({
        ...prev, 
        experience:[...prev.experience, {company:'',experience:''}]
        }))

    }

    const updateSkillField = (id: number, value: string) => {
        setSkillsFields(skillsFields.map((field) => (field.id === id ? { ...field, value } : field)))
        setDetailsForm(prev=>{
        const updatedSkills=[...prev.skills]
        updatedSkills[id-1]=value
        return {...prev, skills:updatedSkills}
        })
    }

    const updateEducationField = (id: number, fieldName:'degree'|'university'|'passingYear', value: string) => {
        setEducationFields(educationFields.map((field) => (field.id === id ? { ...field, [fieldName]:value } : field)))
        setDetailsForm(prev=>{
        const updatedEducation=prev.education.map((edu, ind) => 
            ind==id-1? {...edu, [fieldName]:value}:edu
        )
        return {...prev, education:updatedEducation}
        })
    }

    const updateExperienceField = (id: number, fieldName:'company'|'experience', value: string) => {
        setExperienceFields(experienceFields.map((field) => (field.id === id ? { ...field, [fieldName]:value } : field)))
        setDetailsForm(prev=>{
        const updatedExperience=prev.experience.map((exp, ind)=>
            ind==id-1? {...exp, [fieldName]:value}:exp
        )
        return {...prev, experience:updatedExperience}
        })
    }

    const imageUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors()

        const file = e.target.files?.[0];
        if(!file) return null
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type)) {
            setErrors({profilePicture:"Invalid file type. Please select a JPG, PNG, or WEBP image."});
            return;
        }
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl)
            setDetailsForm({...detailsForm, profilePicture:file});
        }
    }

    const changeDetailsForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>{
        setDetailsForm({...detailsForm, [e.target.name]:e.target.value})
    }

    const handleSaveChanges = async () => {
        clearErrors()

        if (!detailsForm.username) {
        return setErrors({username : "Username is required"})
        }

        if (!detailsForm.gender) {
        return setErrors({gender : "Please select your gender"})
        }

        if (!detailsForm.location.trim()) {
        return setErrors({location : "Location is required"})
        }

        if (!detailsForm.proficiency.trim()) {
        return setErrors({proficiency : "Please enter your area of expertise"})
        }

        if (detailsForm.aboutMe.trim().length < 20) {
        return setErrors({aboutMe : "About Me must be at least 20 characters"})
        }

        if (!detailsForm.skills.length || detailsForm.skills.every(skill => !skill.trim())) {
        return setErrors({skills : "Please add at least one skill"})
        }

        if (
        !detailsForm.education.length ||
        detailsForm.education.every(
            (ed) => !ed.degree.trim() && !ed.university.trim() && !ed.passingYear.trim()
        )
        ) {
        return setErrors({education : "Please add at least one education entry"})
        }

        if (detailsForm.linkedinLink && !/^https:\/\/(www\.)?linkedin\.com\/.*$/i.test(detailsForm.linkedinLink)) {
        return setErrors({linkedinLink : "Enter a valid LinkedIn profile URL"})
        }

        if (detailsForm.githubLink && !/^https:\/\/(www\.)?github\.com\/.*$/i.test(detailsForm.githubLink)) {
        return setErrors({githubLink : "Enter a valid GitHub profile URL"})
        }

        setLoading(true)

        const filteredEdu=detailsForm.education.filter(edu=>edu.degree.trim() && edu.university.trim() && edu.passingYear.trim())
        const filteredExp=detailsForm.experience.filter(exp=>exp.company.trim() && exp.experience.trim())
        const filteredSkills=detailsForm.skills.filter(skill=>skill.trim())
        const updatedForm={
        ...detailsForm,
        education:filteredEdu,
        experience:filteredExp,
        skills:filteredSkills
        }

        const formData=new FormData()

        Object.entries(updatedForm).forEach(([key, value]) => {
        if (key !== "profilePicture") {
            if (typeof value === "object") {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        }
        });

        if (detailsForm.profilePicture) {
            formData.append("profilePicture", detailsForm.profilePicture);
        }


        setDetailsForm(updatedForm)

        const token=localStorage.getItem('token')

        const result=await axios.patch('http://localhost:5000/user/editUserDetails', formData, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        setLoading(false)
        if(result.data.success) router.push('/profile/user')
    }

    const handleCancel = () => {
        console.log("Cancelling profile edit...")
        // Handle cancel logic here
    }

    return (
        <div className="min-h-screen bg-gray-50">

        <div className="flex">

            {/* Main Content */}
            <div className="flex-1 p-4 lg:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Profile</h1>
                <p className="text-gray-600">Update your personal and professional details</p>
                </div>

                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                        {previewImage ? (
                            <Image width={300} height={300} src={previewImage || detailsForm.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle className="w-full h-full object-cover"/>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        name="profilePicture"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer" onClick={imageUpload}>Change Profile Picture</button>
                    {errors.profilePicture && (
                        <p className="text-red-500 text-sm">{errors.profilePicture}</p>
                    )}
                </div>
                </div>

                {/* Personal Info Section */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">👤</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Personal Info</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                        <input
                            type="text"
                            value={detailsForm.username}
                            name="username"
                            onChange={changeDetailsForm}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your name"
                        />
                    </div>
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username}</p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                            value={detailsForm.gender}
                            name="gender"
                            onChange={changeDetailsForm}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                    {errors.gender && (
                        <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency</label>
                        <input
                            type="text"
                            value={detailsForm.proficiency}
                            name="proficiency"
                            onChange={changeDetailsForm}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="eg. Software Engineer"
                        />
                    </div>
                    {errors.location && (
                        <p className="text-red-500 text-sm">{errors.location}</p>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                    <textarea
                        value={detailsForm.aboutMe}
                        name="aboutMe"
                        onChange={changeDetailsForm}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us about yourself..."
                    />
                    </div>
                    {errors.aboutMe && (
                        <p className="text-red-500 text-sm">{errors.aboutMe}</p>
                    )}
                </div>
                </div>

                {/* Location & Bio Section */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 text-sm">📍</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Location & Bio</h2>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address / Location</label>
                    <input
                    type="text"
                    value={detailsForm.location}
                    name="location"
                    onChange={changeDetailsForm}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State"
                    />
                </div>
                {errors.location && (
                    <p className="text-red-500 text-sm">{errors.location}</p>
                )}
                </div>

                {/* Professional Details Section */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm">💼</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Professional Details</h2>
                </div>

                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    {detailsForm.skills && detailsForm.skills.map((skill, ind) => (
                        <div key={ind+1} className="mb-2">
                        <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkillField(ind+1, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter a skill"
                        />
                        </div>
                    ))}
                    {errors.skills && (
                        <p className="text-red-500 text-sm">{errors.skills}</p>
                    )}
                    <button
                        onClick={addSkillField}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Add Skills
                    </button>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                    {detailsForm.experience && detailsForm.experience.map((exp, ind)=>(
                        <div key={ind+1} className="flex mb-2 gap-3">
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateExperienceField(ind+1, 'company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Company"
                            />
                            <input
                                type="text"
                                value={exp.experience}
                                onChange={(e) => updateExperienceField(ind+1, "experience", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Years of Experience"
                            />
                        </div>
                    ))}
                    {errors.experience && (
                        <p className="text-red-500 text-sm">{errors.experience}</p>
                    )}
                    <button
                        onClick={addExperienceField}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Add Experience
                    </button>
                    </div>
                </div>
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education
                    </label>
                    {detailsForm.education && detailsForm.education.map((edu, ind) => (
                        <div key={ind+1} className="mb-2 flex gap-2">
                            <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducationField(ind+1, 'degree', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Degree"
                            />
                            <input
                                type="text"
                                value={edu.university}
                                onChange={(e) => updateEducationField(ind+1, 'university', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="University"
                            />
                            <input
                                type="text"
                                value={edu.passingYear}
                                onChange={(e) => updateEducationField(ind+1, 'passingYear', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Passing year"
                            />
                        </div>
                    ))}
                    {errors.education && (
                        <p className="text-red-500 text-sm">{errors.education}</p>
                    )}
                    <button
                        onClick={addEducationField}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        Add Education
                    </button>
                    </div>
                </div>
                </div>

                {/* Portfolio & Links Section */}
                <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-orange-600 text-sm">🔗</span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Portfolio & Links</h2>
                </div>

                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Link</label>
                    <input
                        type="url"
                        value={detailsForm.githubLink}
                        onChange={changeDetailsForm}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/username"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Sharing GitHub link will enable other users to see your activity on GitHub
                    </p>
                    </div>
                    {errors.githubLink && (
                        <p className="text-red-500 text-sm">{errors.githubLink}</p>
                    )}

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Link</label>
                    <input
                        type="url"
                        value={detailsForm.linkedinLink}
                        onChange={changeDetailsForm}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/username"
                    />
                    </div>
                    {errors.linkedinLink && (
                        <p className="text-red-500 text-sm">{errors.linkedinLink}</p>
                    )}
                </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                    Save Changes
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}
