"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ResumePreview() {
    const router=useRouter()
    const [previewHtml, setHtml]=useState()
    const [downloadPdf, setPdf]=useState()

    useEffect(()=>{
        const pdf=sessionStorage.getItem('resumePdf')
        if(!pdf) return router.push('/createResume')
        const html=sessionStorage.getItem('resumeHtml')
        if(!html) return router.push('/createResume')

        setHtml(html)
        const blob=new Blob(
            [Uint8Array.from(atob(pdf), c=>c.charCodeAt(0))],
            {type:'application/pdf'}
        )
        const url=URL.createObjectURL(blob)
        setPdf(url)
    }, [])  

    const handleEditDetails = () => {
        console.log("Edit details clicked")
    }

    const handleSaveToProfile = () => {
        console.log("Save to profile clicked")
    }

    const handleDownloadPDF = () => {
        if(!downloadPdf) return null
        const link=document.createElement('a')
        link.href=downloadPdf
        link.download=`My_Resume_${Date.now()}.pdf`
        link.click()
    }

    const handleCancel = () => {
        console.log("Cancel clicked")
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Section */}
            <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Preview</h1>
            <p className="text-gray-600">
                Review the resume below. You can save, download, or edit your details before finalizing.
            </p>
            </div>

            {/* Resume Preview Container */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                {previewHtml ? (
                    <div dangerouslySetInnerHTML={{__html: previewHtml}}/>
                ) : (
                    <p className="text-center text-gray-500">Loading resume...</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 max-w-md mx-auto">
            <button
                onClick={handleEditDetails}
                className="cursor-pointer w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
                <span>✏️</span>
                Edit Details
            </button>

            <button
                onClick={handleSaveToProfile}
                className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <span>💾</span>
                Save to Profile
            </button>

            <button
                onClick={handleDownloadPDF}
                className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <span>⬇️</span>
                Download PDF
            </button>

            <button
                onClick={handleCancel}
                className="cursor-pointer w-full text-red-500 hover:text-red-600 font-semibold py-3 px-6 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
                <span>✕</span>
                Cancel
            </button>
            </div>
        </main>
    )
}
