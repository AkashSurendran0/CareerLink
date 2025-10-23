"use client";

import { rejectCompany } from '@/services/adminService';
import React, {useState} from 'react'
import { useRouter } from 'next/navigation';

function CancellationReasonModal({id, removeCancelBox}) {
    const router=useRouter()
    const [reasons, setReasons] = useState([""])
    const [error, setError]=useState('')

    const handleReasonChange = (ind:number, val:string) => {
        const updatedReasons = [...reasons]
        updatedReasons[ind] = val
        setReasons(updatedReasons)
    }

    const handleAddReason = () => {
        setReasons([...reasons, ""])
    }

    const handleRemoveReason = (index: number) => {
        setReasons(reasons.filter((_, i)=>i!=index))
    }

    const handleSubmitCancellation = async () => {
        setError('')
        if(reasons.every((reason)=>reason.trim()=='')){
            return setError('Atleast one reason required')
        }
        const finalReasons=reasons.filter((reason)=>reason.trim()!='')
        const result=await rejectCompany(id, finalReasons)
        if(result.result.success){
            router.push('/admin/companyManagement')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
            <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg mx-4 bg-white">
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold mb-4">Reason to Cancellation</h2>
                    <button
                    onClick={handleAddReason}
                    className=" mb-3 rounded-md px-3 py-2 text-sm hover:bg-muted bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    >
                    + Add Reason
                    </button>
                </div>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {reasons.map((reason, index) => (
                    <div key={index} className="flex gap-2">
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => handleReasonChange(index, e.target.value)}
                        placeholder={`Reason ${index + 1}`}
                        className="flex-1 rounded-md border bg-background px-3 py-2 focus:outline-0 text-sm focus:ring-2 focus:ring-primary"
                    />
                    {reasons.length > 1 && (
                        <button
                        onClick={() => handleRemoveReason(index)}
                        className="rounded-md border px-2 py-2 text-sm hover:bg-muted text-red-600 cursor-pointer"
                        >
                        ✕
                        </button>
                    )}
                    </div>
                ))}
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
                </div>

                <div className="flex gap-2">
                <button
                    onClick={handleSubmitCancellation}
                    className="flex-1 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-red-700 bg-red-600 text-white cursor-pointer"
                >
                    Submit
                </button>
                <button
                    onClick={() => {
                    removeCancelBox()
                    setReasons([""])
                    }}
                    className="flex-1 rounded-md border px-3 py-2 text-sm hover:bg-white cursor-pointer"
                >
                    Cancel
                </button>
                </div>
            </div>
        </div>
    )
}

export default CancellationReasonModal
