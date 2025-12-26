"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "@/app/(user)/template"
import { enqueueSnackbar } from "notistack"

export default function ResumePreview() {
    const setLoading = useLoading()
    const router = useRouter()
    const [coverLetter, setLetter] = useState<string>()
    const [editLetter, setEditLetter] = useState(false)

    useEffect(() => {
        const letter = sessionStorage.getItem('coverLetter')
        if (!letter) return router.push('/createCoverletter')

        setLetter(letter)

        // return () => sessionStorage.removeItem('coverLetter')
    }, [])

    const handleEditDetails = () => {
        setEditLetter(true)
    }

    const copyToSystem = async () => {
        if (coverLetter) navigator.clipboard.writeText(coverLetter)
            .then(() => {
                enqueueSnackbar('Copied Successfully!', { variant: "success" })
            })
    }

    const handleCancel = () => {
        router.push('/createCoverletter')
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
                {editLetter ? (
                    <div>
                        <div className="flex flex-row justify-between items-center mb-2">
                            <label htmlFor="editLetter" className="text-2xl">Edit text</label>
                            <button
                                onClick={() => setEditLetter(false)}
                                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                Save
                            </button>
                        </div>
                        <textarea
                            id="editLetter"
                            value={coverLetter}
                            onChange={(e) => setLetter(e.target.value)}
                            className="w-full h-96 p-4 border border-gray-300 rounded-lg whitespace-pre-line resize-none"
                        />
                    </div>
                ) : (
                    <div className="whitespace-pre-line">
                        {coverLetter}
                    </div>
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
                    onClick={copyToSystem}
                    className="cursor-pointer w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <span>💾</span>
                    Copy to System
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
