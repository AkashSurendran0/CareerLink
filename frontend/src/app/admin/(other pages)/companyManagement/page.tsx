"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {LoaderIcon} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { acceptCompany, changeCompanyStatus, getApprovedCompanies, getPendingCompanies } from '@/services/adminService'
import CancellationReasonModal from '@/reusable-components/cancellationReasonModal'


type Company = {
    id:string,
    logo:string,
    name:string,
    registeredBy:string,
    suspended:boolean,
    rejected:boolean,
    approved:boolean,
    createdAt:Date,
}

function UserManagement() {
    const router=useRouter()
    const [allCompanyTable, setAllCompanyTable]=useState(true)
    const [companies, setCompanies]=useState<Company[]>([])
    const [pendingCompanies, setPendingCompanies]=useState<Company[]>([])
    const [pageLimit, setPageLimit]=useState(0)
    const [pendingPageLimit, setPendingPageLimit]=useState(0)
    const [page, setPage]=useState(1)
    const [loadingCompanyId, setLoadingCompanyId]=useState<string | null>()
    const [query, setQuery]=useState('')
    const [cancel, setCancel]=useState(false)
    const [rejectId, setRejectId]=useState('')
    const STARTING_PAGE=1
    const LIMIT=3
    const debouncer=useRef<NodeJS.Timeout | null>(null)
    
    useEffect(()=>{
        const fetchCompanies= async () => {
            const result=await getApprovedCompanies(STARTING_PAGE, LIMIT, query)
            if(result.companies.result.length<LIMIT){
                setPageLimit(1)
            }else{
                setPageLimit(result.companies.pageLimit)
            } 
            setCompanies(result.companies.result)
        }
        fetchCompanies()

    }, [])

    const listPendingCompanies = async () => {
        setAllCompanyTable(false)
        const result=await getPendingCompanies(STARTING_PAGE, LIMIT, query)
        if(result.companies.result.length<LIMIT){
            setPendingPageLimit(1)
        }else{
            setPendingPageLimit(result.companies.pageLimit)
        } 
        setPendingCompanies(result.companies.result)
    }

    const searchCompanies = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val=e.target.value
        setQuery(val) 
        if(debouncer.current) clearTimeout(debouncer.current)
        debouncer.current=setTimeout(() => {
            fetchCompany(val)
        }, 1500);  
    }

    const searchPendingCompanies = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val=e.target.value
        setQuery(val) 
        if(debouncer.current) clearTimeout(debouncer.current)
        debouncer.current=setTimeout(() => {
            fetchPendingCompany(val)
        }, 1500);
    }
        
    const fetchCompany = async (v:string) => {
        const result=await getApprovedCompanies(STARTING_PAGE, LIMIT, v)
        if(result.companies.result.length<LIMIT){
            setPageLimit(1)
        }else{
            setPageLimit(result.companies.pageLimit) 
        }
        setPage(1)
        setCompanies(result.companies.result)
    }

    const fetchPendingCompany = async (v:string) => {
        const result=await getPendingCompanies(STARTING_PAGE, LIMIT, v)
        if(result.companies.result.length<LIMIT){
            setPendingPageLimit(1)
        }else{
            setPendingPageLimit(result.companies.pageLimit) 
        }
        setPage(1)
        setPendingCompanies(result.companies.result)
    }

    const getPaginatedCompanies = async (i: number) =>{
        const result=await getApprovedCompanies(i, LIMIT, query)
        setCompanies(result.companies.result)
        setPage(i)
    }

    const getPendingPaginatedCompanies = async (i:number) => {
        const result=await getPendingCompanies(i, LIMIT, query)
        setPendingCompanies(result.companies.result)
        setPage(i)
    }

    const alterCompanyStatus = async (id:string) => {
        setLoadingCompanyId(id)

        const company={    
            id:id
        }
        const result=await changeCompanyStatus(company)
        const updatedCompany=result.companies
        setCompanies((prev)=>
            prev.map(u=>
                u.id==updatedCompany.id? updatedCompany:u
            )
        )
        setLoadingCompanyId(null)

    }   

    const viewCompanyDetails = (id:string) => {
        router.push(`/admin/companyManagement/${id}`)
    }

    const alterStatus = async (id:string) => {
        const result=await acceptCompany(id)
        if(result.result.success){
            window.location.reload()
        }
    }

    const rejectCompany = (id:string) => {
        setRejectId(id)
        setCancel(true)
    }

    const removeCancelBox = () => {
        setRejectId('')
        setCancel(false)
    }

    return (
        <div className="flex-1">
            {cancel && (
                <CancellationReasonModal id={rejectId} removeCancelBox={removeCancelBox}/>
            )}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    Manage Companies
                    <span className="text-blue-600">🏢</span>
                </h1>
                <p className="text-gray-600 mt-1">View, search, and manage all registered companies.</p>
                </div>
                <div className="text-right">
                </div>
            </div>
            </div>

            <div className="p-8">
            <div className="mb-6">
                <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                {allCompanyTable? (
                    <input
                        type="text"
                        placeholder="Search companies by name"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={query}
                        onChange={searchCompanies}
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="Search companies by name"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={query}
                        onChange={searchPendingCompanies}
                    />
                )}
                </div>
            </div>

            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">All Companies</h2>
            </div>

            <nav className="flex items-center gap-2 text-sm my-4">
                <button 
                className={`cursor-pointer rounded-md px-3 py-1.5 ${allCompanyTable? 'bg-black text-white':'border hover:bg-gray-200'}`}
                onClick={()=>setAllCompanyTable(true)}
                >
                Companies
                </button>
                <button 
                className={`cursor-pointer rounded-md px-3 py-1.5 ${allCompanyTable? 'border hover:bg-gray-200':'bg-black text-white'}`}
                onClick={listPendingCompanies}
                >
                Pending approvals
                </button>
          </nav>

            {/* <div className="mb-4 space-x-4 text-sm flex">

                <label className="flex items-center text-sm space-x-2">
                    <input type="checkbox" className="h-3 w-3" />
                    <span>Active Companies</span>
                </label>

                <label className="flex items-center text-sm space-x-2">
                    <input type="checkbox" className="h-3 w-3" />
                    <span>Suspended Companies</span>
                </label>
            </div> */}

            {allCompanyTable? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Logo</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Name</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Date Joined</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Registered By</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {companies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50">
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                <Image
                                    src={company.logo}
                                    alt={company.name}
                                    width={300}
                                    height={300}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">{company.name}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{new Date(company.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{company.registeredBy}</td>
                            <td className="py-4 px-6">
                                <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    company.suspended? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                }`}
                                >
                                    {loadingCompanyId==company.id? ( <LoaderIcon id={`${company.id}`} className='animate-spin text-blue-500'/> ) : (`${company.suspended? 'Suspended':'Active'}`)}
                                

                                </span>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-1 text-sm">
                                <button className="text-blue-600 hover:text-blue-800 cursor-pointer">View</button>
                                <span className="text-gray-300">|</span>
                                <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={()=>alterCompanyStatus(company.id)}>
                                    {company.suspended? "Make Active" : "Suspend"}

                                </button>
                                {/* <span className="text-gray-300">|</span>
                                <button className="text-blue-600 hover:text-blue-800 cursor-pointer">Upgrade/</button>
                                <button className="text-blue-600 hover:text-blue-800 cursor-pointer">Downgrade</button> */}
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                    <button className={`px-3 py-1 ${page==1? 'text-gray-400':'text-gray-600 hover:bg-gray-100 cursor-pointer'} rounded`}
                    disabled={page==1? true:false}
                    onClick={()=>getPaginatedCompanies(page-1)}
                    >‹</button>
                    { pageLimit &&  
                        Array.from({length: pageLimit}, (_, i) => i+1)
                        .filter(p=>{
                            if(p==1) return p<=3
                            if(p==pageLimit) return p>=pageLimit-2
                            return p>=page-1 && p<=page+1
                        })
                        .map(p=>
                            <button key={p} className={`px-3 py-1 text-gray-600 rounded ${page==p? 'bg-blue-400':'cursor-pointer hover:bg-gray-100'}`} onClick={()=>getPaginatedCompanies(p)}>{p}</button>
                        )
                    }
                    <button className={`px-3 py-1 ${page==pageLimit? 'text-gray-400':'text-gray-600 hover:bg-gray-100 cursor-pointer'} rounded`}
                    disabled={page==pageLimit? true:false}
                    onClick={()=>getPaginatedCompanies(page+1)}
                    >›</button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Logo</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Name</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Applied By</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Date Applied</th>
                            <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {pendingCompanies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50">
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                <Image
                                    src={company.logo}
                                    alt={company.name}
                                    width={300}
                                    height={300}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">{company.name}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{company.registeredBy}</td>
                            <td className="py-4 px-6 text-sm text-gray-600">{new Date(company.createdAt).toLocaleDateString()}</td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-1 text-sm">
                                <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={()=>viewCompanyDetails(company.id)}>View</button>
                                <span className="text-gray-300">|</span>
                                <button className="text-green-600 hover:text-green-800 cursor-pointer" onClick={()=>alterStatus(company.id)}>Approve</button>
                                <span className="text-gray-300">|</span>
                                <button className="text-red-600 hover:text-red-800 cursor-pointer" onClick={()=>rejectCompany(company.id)}>Reject</button>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                    <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                    <button className={`px-3 py-1 ${page==1? 'text-gray-400':'text-gray-600 hover:bg-gray-100 cursor-pointer'} rounded`}
                    disabled={page==1? true:false}
                    onClick={()=>getPendingPaginatedCompanies(page-1)}
                    >‹</button>
                    { pendingPageLimit &&  
                        Array.from({length: pendingPageLimit}, (_, i) => i+1)
                        .filter(p=>{
                            if(p==1) return p<=3
                            if(p==pendingPageLimit) return p>=pendingPageLimit-2
                            return p>=page-1 && p<=page+1
                        })
                        .map(p=>
                            <button key={p} className={`px-3 py-1 text-gray-600 rounded ${page==p? 'bg-blue-400':'cursor-pointer hover:bg-gray-100'}`} onClick={()=>getPendingPaginatedCompanies(p)}>{p}</button>
                        )
                    }
                    <button className={`px-3 py-1 ${page==pendingPageLimit? 'text-gray-400':'text-gray-600 hover:bg-gray-100 cursor-pointer'} rounded`}
                    disabled={page==pendingPageLimit? true:false}
                    onClick={()=>getPendingPaginatedCompanies(page+1)}
                    >›</button>
                    </div>
                </div>
            )}

            </div>
        </div>
    )
}

export default UserManagement
