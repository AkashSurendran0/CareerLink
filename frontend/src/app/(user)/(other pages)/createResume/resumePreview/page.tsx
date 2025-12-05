"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/app/(user)/template"
import { enqueueSnackbar } from "notistack"
import { saveResume } from "@/services/userService"

export default function ResumePreview() {
    const setLoading=useLoading()
    const router=useRouter()
    const [previewHtml, setHtml]=useState<string | null>(null)
    const [downloadPdf, setPdf]=useState<string | null>(null)
    const [isOpen, setIsOpen]=useState(false)
    const [filename, setFilename]=useState('')

    const [error, setError]=useState<Partial<Record<"filename", string>>>({})
    const resetErrors= () =>{
        setError({
            filename:'',
        })
    }

    useEffect(()=>{
        const pdf=sessionStorage.getItem('resumePdf')
        console.log(pdf)
        if(!pdf) return router.push('/createResume')
        const html=sessionStorage.getItem('resumeHtml')
        console.log(html)
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

    const handleSaveToProfile = async () => {
        resetErrors()
        if(!filename){
            setError({filename:'Please enter a name for your resume'})
            return
        }

        if(filename.length<=3){
            setError({filename:'Name must be more than 3 characters'})
            return
        }

        setLoading(true)
        const pdf=sessionStorage.getItem('resumePdf')
        if(!pdf) return enqueueSnackbar('Pdf not available', {variant:'error'})
        const byteCharacters=atob(pdf)
        const byteNumbers=new Array(byteCharacters.length).fill(0).map((_, i)=>byteCharacters.charCodeAt(i))
        const byteArray=new Uint8Array(byteNumbers)
        const pdfBlob=new Blob([byteArray], {type: 'application/pdf'})
        if(!pdfBlob) return enqueueSnackbar('Something went wrong', {variant:'error'})
        const formData=new FormData()
        formData.append('resume', pdfBlob, 'resume.pdf')
        formData.append('resumeName', filename)

        const result=await saveResume(formData)
        if(result.result.success){
            sessionStorage.removeItem('resumePdf')
            sessionStorage.removeItem('resumeHtml')
            router.push('/profile/user/myResumes')
        }   
        
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
            {isOpen && (
                <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                {/* Modal Box */}
                <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 mx-4">
                    <h2 className="text-xl font-semibold mb-4">Save As</h2>

                    <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Enter file name..."
                    className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {error.filename && (
                        <p className="text-red-500 text-sm">{error.filename}</p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="cursor-pointer px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSaveToProfile}
                        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    </div>
                </div>
                </div>
            )}
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
                onClick={()=>setIsOpen(true)}
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
