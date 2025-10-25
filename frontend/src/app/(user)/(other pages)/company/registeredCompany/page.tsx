"use client"

import React from 'react'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/app/(user)/template"
import { getCompanyInfo } from '@/services/userService'

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

function AboutCompany() {
    const [companyDetails, setCompanyDetails]=useState<Company>()

    useEffect(()=>{
        async function getCompanyDetails () {
            const result=await getCompanyInfo()
            setCompanyDetails(result.result)
        }
    
        getCompanyDetails()
    }, [])
    
    return (
        <>
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
        </>
    )
}

export default AboutCompany
