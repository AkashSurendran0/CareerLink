"use client";

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { alterCompanyRegistrationStatus, checkCompanyDetails } from '@/services/adminService';

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
    suspended:boolean
}

interface Props {
    params:{
        id:string
    }
}

function CompanyDetails({params}: Props) {
    const router=useRouter()
    const {id}=params
    const [companyDetails, setCompanyDetails]=useState<Company>()

    useEffect(()=>{
        getCompanyInfo()
    }, [])

    const getCompanyInfo = async () => {
        const result=await checkCompanyDetails(id)
        setCompanyDetails(result.company)
    }

    const alterStatus = async (code:number) => {
        const result=await alterCompanyRegistrationStatus(code, id)
        if(result.result.success){
            router.push('/admin/companyManagement')
        }
    }   

    return (
        <div className='flex-1'>
            <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        Company Details
                        <span className="text-blue-600">🏢</span>
                    </h1>
                </div>
                <div className="text-right">
                </div>
            </div>
            </div>

            <section className="mx-auto max-w-6xl px-4 py-6">
            {companyDetails ? (
            <div className='bg-white'>
                {/* Summary card */}
                <div className="rounded-lg border bg-card p-5 lg:col-span-2">
                    
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between items-center">
                    <div className='flex items-center'>
                    <Image
                        src={companyDetails.logo}
                        width={100}
                        height={100}
                        alt='Company logo'
                    />
                    <div className='flex flex-col'>
                    <h2 className="text-2xl font-semibold">{companyDetails.name}</h2>
                    <p className="text-sm text-muted-foreground">{companyDetails.industry}</p>
                    </div>
                    </div>
                    <div className="flex gap-2">
                    <button className="cursor-pointer hover:bg-blue-700 rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-muted" onClick={()=>alterStatus(1)}>Approve</button>
                    <button className="cursor-pointer hover:bg-red-700 rounded-md bg-red-600 text-white px-3 py-1.5 text-sm hover:bg-muted" onClick={()=>alterStatus(0)}>Reject</button>
                    </div>
                </div>

                <div className="my-5 border-t" />

                <div className="grid gap-6 md:grid-cols-2">
                    {/* About */}
                    <div>
                    <h3 className="mb-2 font-semibold">About</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{companyDetails.aboutCompany}</p>
                    </div>

                    {/* Key facts */}
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground">Founded</p>
                        <p className="font-medium">{companyDetails.foundedYear}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Company Size</p>
                        <p className="font-medium">{companyDetails.companySize}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Headquarters</p>
                        <p className="font-medium">{companyDetails.location}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Website</p>
                        <a
                        href={companyDetails.websiteURL}
                        target="_blank"
                        className="font-medium text-primary underline underline-offset-4"
                        rel="noreferrer"
                        >
                        {companyDetails.websiteURL}
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            ) : (
            <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
                Company not found.{" "}
                <Link href="/admin/pending-approvals" className="underline underline-offset-4">
                Return to list
                </Link>
            </div>
            )}
        </section>
            
        </div>
    )
}

export default CompanyDetails
