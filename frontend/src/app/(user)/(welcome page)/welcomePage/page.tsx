"use client"

import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfileForm() {
  const router=useRouter()
  const [skillsFields, setSkillsFields] = useState([{ id: 1, value: "" }])
  const [educationFields, setEducationFields] = useState([{ id: 1, value: "" }])
  const [experienceFields, setExperienceFields] = useState([{ id: 1, value: "" }])
  const [detailsForm, setDetailsForm]=useState({
    gender:'',
    location:'',
    aboutMe:'',
    experience:[''],
    skills:[''],
    education:[''],
    linkedinLink:'',
    githubLink:''
  })
  const [errors, setErrors]=useState<Partial<Record<"gender" | "location" | "aboutMe" | "experience" | "skills" | "education" | "linkedinLink" | "githubLink", string>>>({})

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
    setEducationFields([...educationFields, { id: newId, value: "" }])
    setDetailsForm(prev=>({
      ...prev,
      education:[...prev.education, '']
    }))
  }

  const addExperienceField = () => {
    const newId = experienceFields.length + 1
    setExperienceFields([...experienceFields, {id:newId, value:''}])
    setDetailsForm(prev=>({
      ...prev, 
      experience:[...prev.education, '']
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

  const updateEducationField = (id: number, value: string) => {
    setEducationFields(educationFields.map((field) => (field.id === id ? { ...field, value } : field)))
    setDetailsForm(prev=>{
      const updatedEducation=[...prev.education]
      updatedEducation[id-1]=value
      return {...prev, education:updatedEducation}
    })
  }

  const updateExperienceField = (id: number, value: string) => {
    setExperienceFields(experienceFields.map((field) => (field.id === id ? { ...field, value } : field)))
    setDetailsForm(prev=>{
      const updatedExperience=[...prev.experience]
      updatedExperience[id-1]=value
      return {...prev, experience:updatedExperience}
    })
  }

  const changeDetailsForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>{
    setDetailsForm({...detailsForm, [e.target.name]:e.target.value})
  }

  const setUserDetails = async () =>{
    clearErrors()

    if (!detailsForm.gender) {
      return setErrors({gender : "Please select your gender"})
    }

    if (!detailsForm.location.trim()) {
      return setErrors({location : "Location is required"})
    }

    if (detailsForm.aboutMe.trim().length < 20) {
      return setErrors({aboutMe : "About Me must be at least 20 characters"})
    }

    if (!detailsForm.experience.length || detailsForm.experience.every(exp => !exp.trim())) {
      return setErrors({experience : "Please add at least one experience"})
    }

    if (!detailsForm.skills.length || detailsForm.skills.every(skill => !skill.trim())) {
      return setErrors({skills : "Please add at least one skill"})
    }

    if (!detailsForm.education.length || detailsForm.education.every(ed => !ed.trim())) {
      return setErrors({education : "Please add at least one education entry"})
    }

    if (detailsForm.linkedinLink && !/^https:\/\/(www\.)?linkedin\.com\/.*$/i.test(detailsForm.linkedinLink)) {
      return setErrors({linkedinLink : "Enter a valid LinkedIn profile URL"})
    }

    if (detailsForm.githubLink && !/^https:\/\/(www\.)?github\.com\/.*$/i.test(detailsForm.githubLink)) {
      return setErrors({githubLink : "Enter a valid GitHub profile URL"})
    }

    const token=localStorage.getItem('token')

    const result=await axios.post('http://localhost:5000/user/addUserDetails', detailsForm, {
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    if(result.data.success) router.push('/feed')

  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-2xl mx-auto px-4 py-8 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome, Alex!</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Feel free to complete the below details so the recruiters get to know you more!
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select 
                  id="gender" 
                  name="gender"
                  value={detailsForm.gender}
                  onChange={changeDetailsForm}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={detailsForm.location}
                    onChange={changeDetailsForm}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    rows={4}
                    name="aboutMe"
                    value={detailsForm.aboutMe}
                    onChange={changeDetailsForm}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>
                {errors.aboutMe && (
                  <p className="text-red-500 text-sm">{errors.aboutMe}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <button
                      onClick={addExperienceField}
                      className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Add Experience
                    </button>
                  </div>
                  <div className="space-y-2">
                    {experienceFields.map((field) => (
                      <input
                        key={field.id}
                        type="text"
                        placeholder="Company - Years of Experience"
                        value={field.value}
                        onChange={(e) => updateExperienceField(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ))}
                  </div>
                  {errors.experience && (
                    <p className="text-red-500 text-sm">{errors.experience}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    <button
                      onClick={addSkillField}
                      className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Add Skills
                    </button>
                  </div>
                  <div className="space-y-2">
                    {skillsFields.map((field) => (
                      <input
                        key={field.id}
                        type="text"
                        placeholder="e.g. JavaScript, React, Node.js"
                        value={field.value}
                        onChange={(e) => updateSkillField(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ))}
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm">{errors.skills}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                <button
                  onClick={addEducationField}
                  className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add Education
                </button>
              </div>
              <div className="space-y-2">
                {educationFields.map((field) => (
                  <input
                    key={field.id}
                    type="text"
                    placeholder="Degree - University - Passing Year"
                    value={field.value}
                    onChange={(e) => updateEducationField(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
              </div>
              {errors.education && (
                <p className="text-red-500 text-sm">{errors.education}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Links</h2>
              <p className="text-sm text-gray-600 mb-4">
                Online Links (having on the will enable other users to see your activity on different)
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Link</label>
                <input
                  type="url"
                  value={detailsForm.linkedinLink}
                  name="linkedinLink"
                  onChange={changeDetailsForm}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.linkedinLink && (
                <p className="text-red-500 text-sm">{errors.linkedinLink}</p>
              )}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Github Link</label>
                <input
                  type="url"
                  value={detailsForm.githubLink}
                  name="githubLink"
                  onChange={changeDetailsForm}
                  placeholder="https://github.com/in/yourprofile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.githubLink && (
                <p className="text-red-500 text-sm">{errors.githubLink}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer"
            onClick={setUserDetails}
            >
              Save & Continue
            </button>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium focus:outline-none focus:underline cursor-pointer">
              Skip for Now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
