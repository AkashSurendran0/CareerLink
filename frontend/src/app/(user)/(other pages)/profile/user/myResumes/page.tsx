'use client';

import { getAllUserResumes } from '@/services/userService'
import React, { useEffect, useState } from 'react'

interface Resume {
    _id: string
    name: string
    createdAt: string
    url: string
}

interface AllResumes {
    resumes: Resume[]
}

function MyResumes() {
    const [allResumes, setAllResumes]=useState<AllResumes | null>(null)

    useEffect(()=>{
        getResumes()

        async function getResumes () {
            const result=await getAllUserResumes()
            console.log(result)
            if(result.resumes.success){
                setAllResumes(result.resumes.resume)
            }
        }
    }, [])

    return (
        <div>
            <div className="space-y-4">
                {allResumes ? (
                    allResumes.resumes.map(resume => (
                        <div key={resume._id} className="bg-white rounded-lg p-4 mt-3 md:p-6 border border-gray-200 hover:shadow-sm transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resume.name}</h3>
                                <p className="text-sm text-gray-600">
                                Created: {new Date(resume.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button 
                            onClick={()=>window.open(resume.url)}
                            className="cursor-pointer self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors whitespace-nowrap">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                </svg>
                                Preview
                            </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex justify-center align-middle py-3'>
                        <h2>You have no saved resumes</h2>
                    </div>
                )}
              </div>
        </div>
    )
}

export default MyResumes
