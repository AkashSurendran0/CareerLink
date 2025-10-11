"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { useLoading } from "@/app/(user)/template"
import {useRouter} from "next/navigation"
import { addCompany } from "@/services/userService"

export default function CompanyRegistrationPage() {
    const setLoading=useLoading()
    const router=useRouter()
    const [logoName, setLogoName] = useState<string | null>(null)
    const dropRef = useRef<HTMLDivElement | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [companyDetails, setCompanyDetails]=useState({
        companyName:'',
        logo:null as File | null,
        industry:'',
        companySize:'',
        foundedYear:2025,
        websiteUrl:'',
        location:'',
        aboutCompany:''
    })
    const [errors, setErrors]=useState<Partial<Record<"companyName" | "logo" | "industry" | "companySize" | "foundedYear" | "websiteUrl" | "location" | "aboutCompany", string>>>({})
  
    const clearErrors = () => {
        setErrors({
            companyName:'',
            logo:'',
            industry:'',
            companySize:'',
            foundedYear:'',
            websiteUrl:'',
            location:'',
            aboutCompany:''
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setCompanyDetails({...companyDetails, [e.target.name]:e.target.value})
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors()

        const file=e.target.files?.[0]
        if(!file) return null
        const validTypes=["image/jpeg", "image/jpg", "image/png", "image/webp"]

        if(!validTypes.includes(file.type)){
            setErrors({logo:"Invalid file type. Please select a JPG, PNG, or WEBP image."})
            return
        }
        if(file){
            setLogoName(file.name)
            setCompanyDetails({...companyDetails, logo:file})
        }
    }

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        if (dropRef.current) dropRef.current.classList.remove("ring-2", "ring-blue-500")
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        if (dropRef.current) dropRef.current.classList.add("ring-2", "ring-blue-500")
    }

    function onDragLeave() {
        if (dropRef.current) dropRef.current.classList.remove("ring-2", "ring-blue-500")
    }

    const createCompany = async (e) => {
        e.preventDefault()
        clearErrors()

        if(!companyDetails.companyName && companyDetails.companyName.trim()==''){
            setErrors({companyName:'Please enter a company name'})
            return
        }

        if(companyDetails.companyName.length<3){
            setErrors({companyName:'Minimum length for a company name should be 3'})
            return
        }

        if(!companyDetails.industry){
            setErrors({industry:'Please select an industry'})
            return
        }

        if(!companyDetails.companySize){
            setErrors({companySize:'Please select your company size'})
            return
        }

        if(companyDetails.foundedYear<1850 || companyDetails.foundedYear>2025){
            console.log(3)
            setErrors({foundedYear:'Please enter a valid year'})
            return
        }

        const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/;
        if (companyDetails.websiteUrl && !websiteRegex.test(companyDetails.websiteUrl)) {
            console.log(1)
            setErrors({websiteUrl:'Please enter a valid url'});
        }

        if(!companyDetails.location){
            console.log(2)
            setErrors({location:'Please enter a location'})
            return
        }

        if(!companyDetails.aboutCompany){
            setErrors({aboutCompany:'Please provide a description of your company'})
            return
        }

        if(companyDetails.aboutCompany.length<10){
            setErrors({aboutCompany:'About section should be minimum 10 words'})
            return
        }

        if(!companyDetails.logo){
            setErrors({logo:'Please provide a logo for your company'})
            return
        }

        setLoading(true)
        const formData=new FormData()

        Object.entries(companyDetails).forEach(([key, value]) => {
            if(key!=="logo"){
                if(typeof value=="object"){
                    formData.append(key, JSON.stringify(value))
                }else{
                    formData.append(key, value)
                }
            }
        })
        if(companyDetails.logo){
            formData.append('logo', companyDetails.logo)
        }

        const result=await addCompany(formData)
        setLoading(false)
        if(result.success){
            router.push('/company/registeredCompany')
        }
    }

    return (

            <main>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Company Registration</h1>
                </div>

                {/* Hero Info Card */}
                <section className="mb-8">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Image
                            width={600}
                            height={200}
                            src="/Modern_office_building.jpeg"
                            alt="Modern office building"
                            className="sm:h-56 object-cover rounded-md"
                        />
                    </div>
                    <div className="flex items-center">
                        <div>
                        <h3 className="text-gray-900 font-semibold">Company Information</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Provide details about your company to complete the registration process.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </section>

                {/* Form */}
                <form className="space-y-6">
                {/* Company Name */}
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                    </label>
                    <input
                    id="companyName"
                    name="companyName"
                    value={companyDetails.companyName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter company name"
                    className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.companyName && (
                        <p className="text-red-500 text-sm">{errors.companyName}</p>
                    )}
                </div>

                {/* Upload Logo */}
                <div>
                    <div
                    ref={dropRef}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className="rounded-lg border border-dashed border-gray-300 bg-gray-50"
                    >
                    <div className="px-4 sm:px-6 py-10 text-center">
                        <h4 className="text-sm font-semibold text-gray-800">Upload Company Logo</h4>
                        <p className="mt-1 text-xs text-gray-500">
                        Drag and drop or browse to upload your company logo. Recommended size: 200×200px.
                        </p>
                        <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-xs font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Upload Logo
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            name="logo"
                            onChange={handleFileChange}
                        />
                        </div>
                        {logoName && (
                        <p className="mt-3 text-xs text-gray-600">
                            Selected file: <span className="font-medium">{logoName}</span>
                        </p>
                        )}
                    </div>
                    </div>
                    {errors.logo && (
                        <p className="text-red-500 text-sm">{errors.logo}</p>
                    )}
                </div>

                {/* Two-column responsive fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Industry */}
                    <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                        Industry
                    </label>
                    <select
                        id="industry"
                        name="industry"
                        value={companyDetails.industry}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue=""
                    >
                        <option value="" disabled>
                        Select industry
                        </option>
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Retail</option>
                        <option>Manufacturing</option>
                    </select>
                    {errors.industry && (
                        <p className="text-red-500 text-sm">{errors.industry}</p>
                    )}
                    </div>

                    {/* Company Size */}
                    <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Company Size
                    </label>
                    <select
                        id="size"
                        name="companySize"
                        value={companyDetails.companySize}
                        onChange={handleChange}
                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue=""
                    >
                        <option value="" disabled>
                        Select company size
                        </option>
                        <option>1–10</option>
                        <option>11–50</option>
                        <option>51–200</option>
                        <option>201–500</option>
                        <option>501–1000</option>
                        <option>1000+</option>
                    </select>
                    {errors.companySize && (
                        <p className="text-red-500 text-sm">{errors.companySize}</p>
                    )}
                    </div>

                    {/* Founded Year */}
                    <div>
                    <label htmlFor="founded" className="block text-sm font-medium text-gray-700">
                        Founded Year
                    </label>
                    <input
                        id="founded"
                        type="number"
                        name="foundedYear"
                        value={companyDetails.foundedYear}
                        onChange={handleChange}
                        inputMode="numeric"
                        placeholder="Enter year"
                        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.foundedYear && (
                        <p className="text-red-500 text-sm">{errors.foundedYear}</p>
                    )}
                    </div>
                    

                    {/* Website URL with icon */}
                    <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website URL
                    </label>
                    <div className="mt-2 relative">
                        <input
                        id="website"
                        name="websiteUrl"
                        value={companyDetails.websiteUrl}
                        onChange={handleChange}
                        type="url"
                        placeholder="Enter website URL"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        {/* Link icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M10 13a5 5 0 0 1 7 7l-2 2a5 5 0 0 1-7-7" />
                            <path d="M14 11a5 5 0 0 1-7-7l2-2a5 5 0 0 1 7 7" />
                        </svg>
                        </span>
                    </div>
                    {errors.websiteUrl && (
                        <p className="text-red-500 text-sm">{errors.websiteUrl}</p>
                    )}
                    </div>

                    {/* Headquarters Location with icon */}
                    <div className="sm:col-span-2">
                    <label htmlFor="hq" className="block text-sm font-medium text-gray-700">
                        Headquarters Location
                    </label>
                    <div className="mt-2 relative">
                        <input
                        id="hq"
                        type="text"
                        name="location"
                        value={companyDetails.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                        {/* Map pin icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
                            <circle cx="12" cy="11" r="2.5" />
                        </svg>
                        </span>
                    </div>
                    {errors.location && (
                        <p className="text-red-500 text-sm">{errors.location}</p>
                    )}
                    </div>
                </div>

                {/* About the Company */}
                <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About the Company
                    </label>
                    <textarea
                    id="about"
                    name="aboutCompany"
                    value={companyDetails.aboutCompany}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Share a brief description about your company..."
                    className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                {errors.aboutCompany && (
                    <p className="text-red-500 text-sm">{errors.aboutCompany}</p>
                )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    Cancel
                    </button>
                    <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={createCompany}
                    >
                    Register Company
                    </button>
                </div>
                </form>
            </div>
            </main>
    )
}
