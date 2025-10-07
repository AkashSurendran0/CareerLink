"use client"

import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

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
}

export default function CompanyProfilePage() {
    const router=useRouter()
    const [companyDetails, setCompanyDetails]=useState<Company>()
    const [activeTab, setActiveTab] = useState("About");

    useEffect(()=>{
        async function getCompanyDetails () {
            const token=localStorage.getItem('token')
            const result=await axios.get('http://localhost:5000/company/v1/getCompanyDetails', {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(result.data.result)
            setCompanyDetails(result.data.result)
        }

        getCompanyDetails()
    }, [])

    const tabs = [
        "About",
        "Jobs Posted",
        "Photos / Media",
    ];

    const goToEditPage = () => {
        router.push('/company/editCompany')
    }

    return (

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
                    <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md cursor-pointer" onClick={goToEditPage}>

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
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
  )
}
