"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/app/(user)/template"
import CompanyBlockedPage from "@/components/companyBlocked"
import { deleteCompany, getCompanyInfo, reapplyCompany } from "@/services/userService"

type Company = {
    id:string,
    logo:string,
    name:string,
    companySize:string,
    foundedYear:number,
    industry:string,
    websiteURL:string,
    location:string,
    aboutCompany:string,
    approved:boolean,
    rejected:boolean,
    suspended:boolean,
    rejectReasons:string[]
}

export default function CompanyProfilePage() {
    const setLoading=useLoading()
    const router=useRouter()
    const [companyDetails, setCompanyDetails]=useState<Company>()
    const [activeTab, setActiveTab] = useState("About");

    useEffect(()=>{
        async function getCompanyDetails () {
            const result=await getCompanyInfo()
            setCompanyDetails(result.result)
        }

        getCompanyDetails()
    }, [])

    const tabs = [
        "About",
        "Jobs Posted",
        "Photos / Media",
    ];

    const goToEditPage = () => {
        setLoading(true)
        router.push('/company/editCompany')
    }

    const handleReapply = async () => {
        setLoading(true)
        const result=await reapplyCompany()
        setCompanyDetails(result.company)
        setLoading(false)
    }

    const handleDelete = async () => {
        setLoading(true)
        const result=await deleteCompany(companyDetails!.id)
        if(result.result.success){
            router.push('/company/registrationPage')
        }
    }

    const handleEdit = () => {
        setLoading(true)
        router.push('/company/editCompany')
    }

    return (

        <>
            {companyDetails && companyDetails.approved? 
                companyDetails.suspended? (
                    <CompanyBlockedPage/>
                ) : (
                    <main className="flex-1">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            {/* Company Header Card */}
                            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                {/* Left: Logo + Basic Info */}
                                <div className="flex items-start gap-4">
                                <div className="h-16 w-24 sm:h-24 sm:w-24 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                                    { companyDetails && companyDetails.logo ? (
                                        <Image
                                            width={300}
                                            height={300}
                                            src={`${companyDetails?.logo}`}
                                            alt="Sophia Carter"
                                            className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl sm:text-2xl font-semibold text-gray-600">CO</span>
                                    ) }
                                </div>
                                <div className="px-4 py-2">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{companyDetails && companyDetails.name}</h1>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-blue-600">
                                    <span className="text-gray-500">{companyDetails && companyDetails.location}</span>
                                    </div>
                                </div>
                                </div>

                                {/* Right: Follow */}
                                <div className="flex justify-start lg:justify-end">
                                <button className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md cursor-pointer" onClick={goToEditPage}>

                                    Edit Company
                                </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mt-6">
                                <div className="flex items-center gap-4 text-sm">
                                <nav className="flex space-x-8 px-6">
                                    {tabs.map((tab) => (
                                        <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm ${
                                            activeTab === tab
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                        >
                                        {tab}
                                        </button>
                                    ))}
                                    </nav>
                                </div>
                            </div>
                            </section>

                            {/* About + Summary */}
                            <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                <h2 className="text-sm font-medium text-gray-500">About</h2>
                                <h3 className="mt-1 text-base font-semibold text-gray-900">{companyDetails && companyDetails.name}</h3>
                                </div>
                                <div className="lg:col-span-2">
                                <p className="text-gray-600 leading-6">
                                    {companyDetails && companyDetails.aboutCompany}
                                </p>
                                </div>
                            </div>
                            </section>

                            {/* Company Details */}
                            <section className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                            <h2 className="text-base font-semibold text-gray-900">Company Details</h2>
                            <div className="mt-4 border-t border-gray-100" />
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Row 1 */}
                                <div>
                                <div className="text-sm text-gray-500">Industry</div>
                                <div className="mt-1 text-gray-900">{companyDetails && companyDetails.industry}</div>
                                </div>
                                <div>
                                <div className="text-sm text-gray-500">Founded</div>
                                <div className="mt-1 text-gray-900">{companyDetails && companyDetails.foundedYear}</div>
                                </div>

                                {/* Row 2 */}
                                <div>
                                <div className="text-sm text-gray-500">Company Size</div>
                                <div className="mt-1 text-gray-900">{companyDetails && companyDetails.companySize} employees</div>
                                </div>
                                <div>
                                <div className="text-sm text-gray-500">Headquarters</div>
                                <div className="mt-1 text-gray-900">{companyDetails && companyDetails.location}</div>
                                </div>

                                {/* Row 3 */}
                                <div>
                                <div className="text-sm text-gray-500">Website</div>
                                <a href={companyDetails?.websiteURL} className="mt-1 block text-blue-600 hover:underline">
                                    {companyDetails && companyDetails.websiteURL? `${companyDetails.websiteURL}`:'Not provided'}
                                </a>
                                </div>
                            </div>
                            </section>
                        </div>
                    </main>
                ) : companyDetails && companyDetails.rejected? (
                <main className="min-h-dvh bg-background text-foreground">

                    <section className="mx-auto max-w-3xl px-4 py-12">
                        <div
                        className="rounded-xl bg-white border border-border bg-card/50 backdrop-blur p-6 md:p-8"
                        role="alert"
                        aria-live="polite"
                        >
                        <div className="flex items-start gap-4">
                            {/* Rejected icon */}
                            <div
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Zm3.53 6.97a.75.75 0 0 1 0 1.06L13.06 12l2.47 2.47a.75.75 0 1 1-1.06 1.06L12 13.06l-2.47 2.47a.75.75 0 0 1-1.06-1.06L10.94 12 8.47 9.53A.75.75 0 0 1 9.53 8.47L12 10.94l2.47-2.47a.75.75 0 0 1 1.06 0Z" />
                            </svg>
                            </div>

                            <div className="flex-1">
                            <h1 className="text-balance text-xl md:text-2xl font-semibold">Company Request Rejected</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Your submission didn’t meet our verification criteria. Please make the required
                                changes, and reapply.
                            </p>
                            <div className="mt-6 rounded-lg border border-red-200 bg-red-50/60 p-4 text-sm">
                                <div className="font-medium text-red-700">Reason provided by admin</div>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-red-700/90">
                                {companyDetails.rejectReasons.map((reason)=>(
                                    <li>{reason}</li>
                                ))}
                                </ul>
                            </div>

                            <div className="mt-6 grid gap-3 sm:flex sm:items-center">
                                <button
                                onClick={handleReapply}
                                className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                >
                                Reapply
                                </button>
                                <button
                                onClick={handleEdit}
                                className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                Edit Changes
                                </button>
                                <button
                                onClick={handleDelete}
                                className="text-white cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                Delete Request
                                </button>
                            </div>

                            <p className="mt-4 text-xs text-muted-foreground">
                                Note: Reapplying will create a new request for our reviewers. Editing allows you to update the previous
                                submission before resubmitting.
                            </p>
                            </div>
                        </div>
                        </div>
                    </section>
                </main>
            ) : (
                <main className="min-h-dvh mt-10 bg-background text-foreground">

                    <section className="mx-auto max-w-2xl px-4 py-12">
                        <div className="rounded-xl bg-white border border-border bg-card/50 backdrop-blur p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div
                            aria-hidden="true"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1.75a10.25 10.25 0 1 0 0 20.5 10.25 10.25 0 0 0 0-20.5Zm0 1.5a8.75 8.75 0 1 1 0 17.5 8.75 8.75 0 0 1 0-17.5Zm.75 4a.75.75 0 0 0-1.5 0v5c0 .2.08.39.22.53l3 3a.75.75 0 1 0 1.06-1.06l-2.78-2.78V7.25Z" />
                            </svg>
                            </div>

                            <div className="flex-1">
                            <h1 className="text-balance text-xl md:text-2xl font-semibold">Company Request Pending Approval</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Thanks for submitting your company for verification. Our team is reviewing your details. You’ll receive
                                an update via email and in-app notifications once a decision is made.
                            </p>

                            <div className="mt-6 grid gap-3 sm:flex sm:items-center">
                                <button
                                onClick={handleDelete}
                                className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                >
                                Delete Request
                                </button>
                            </div>

                            <div className="mt-6 rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                                Tip: Need to update something? You can delete this request and submit a new one with the latest details.
                            </div>
                            </div>
                        </div>
                        </div>
                    </section>
                </main>
            ) }

           
        </>


  )
}
