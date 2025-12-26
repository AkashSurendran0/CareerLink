"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { addSubscriptionPlan, editSubscriptionPlan, getPlanDetails } from "@/services/adminService"

// const features = [
//   "Resume Builder Access",
//   "AI Cover Letter Generator",
//   "GitHub Activity Insights",
//   "Premium Job Filters",
//   "Priority Support",
//   "Unlimited Applications",
// ]

const features = [
    {text:'Unlimited Resume Generation', code:'UNL_RES_GEN'},
    {text:'Unlimited Cover letter Generation', code:'UNL_COV_GEN'},
    {text:'5 Tailored Resume Generation', code:'5_TAIL_RES_GEN'},
    {text:'5 Tailored Cover letter Generation', code:'5_TAIL_COV_GEN'},
    {text:'Unlimited Tailored Resume Generation', code:'UNL_TAIL_RES_GEN'},
    {text:'Unlimited Tailored Cover letter Generation', code:'UNL_TAIL_COV_GEN'},
    {text:'5 Resume Generation', code:'5_RES_GEN'},
    {text:'5 Cover Letter Generation', code:'5_COV_GEN'}
]

type Feature = {
  text: string;
  code: string;
};

export default function AddPlanPage() {
    const router=useRouter()
    const [formData, setFormData] = useState({
        name: "",
        amount: 0,
        billingCycle: 7,
        features: [] as Feature[],
        active: false,
    })
    const [errors, setErrors]=useState<Partial<Record<"name" | "amount" | "billingCycle", string>>>({})

    useEffect(()=>{
        getDetails()
    }, [])

    const getDetails = async () => {
        const planId=localStorage.getItem('plan')
        if(!planId) return router.push('/admin/subscriptionManagement')
        const planDetails=await getPlanDetails(planId)
        setFormData(planDetails.result)
    }
    
    const clearErrors = () => {
        setErrors({
            name:'',
            amount:'',
            billingCycle:''
        })
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleFeatureToggle = (feature: Feature) => {
        setFormData((prev) => ({
        ...prev,
        features: prev.features.some(f => f.code === feature.code)
            ? prev.features.filter((f) => f.code !== feature.code)
            : [...prev.features, feature],
        }))
    }

    const handleactiveToggle = () => {
        setFormData((prev) => ({
        ...prev,
        active: !prev.active,
        }))
    }

    const handleSave = async () => {
        clearErrors()

        if(!formData.name || formData.name.trim()==''){
            setErrors({name:'Please enter a plan name'})
            return
        }

        if(formData.amount<0){
            setErrors({amount:'Please enter a valid number'})
            return
        }
        
        if(formData.features.length<=0){
            enqueueSnackbar('Please select atleast one feature', {variant:'error'})
            return
        }

        if(typeof formData.billingCycle=='string'){
            formData.billingCycle=Number(formData.billingCycle)
        }

        const result=await editSubscriptionPlan(formData)
        if(result.result.success){
            localStorage.removeItem('plan')
            router.push('/admin/subscriptionManagement')
        }else{
            enqueueSnackbar('Something went wrong', {variant:'error'})
        }
        
    }

    const handleCancel = () => {
        setFormData({
        name: "",
        amount: 0,
        billingCycle: 0,
        features: [],
        active: false,
        })
        router.push('/admin/subscriptionManagement')
    }

    return (
        <div className="min-h-screen w-7xl bg-gray-50">
            <div className="max-w-8xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Plan</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 space-y-6">
                {/* Plan Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Plan Name</label>
                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter plan name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>

                {/* amount */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Amount</label>
                    <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                    {errors.amount && (
                        <p className="text-red-500 text-sm">{errors.amount}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Billing Cycle</label>
                    <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                        <option value={7}>One Week</option>
                        <option value={30}>One Month</option>
                        <option value={365}>One Year</option>
                    </select>
                    {errors.billingCycle && (
                        <p className="text-red-500 text-sm">{errors.billingCycle}</p>
                    )}
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">Features</label>
                    <div className="space-y-3">
                    {features.map((feature, ind) => (
                        <label key={ind} className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.features.some(f => f.code === feature.code)}
                            onChange={() => handleFeatureToggle(feature)}
                            className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                        />
                        <span className="ml-3 text-gray-700">{feature.text}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* active */}
                <div>
                    <label  className="block text-sm font-semibold text-gray-900 mb-4">active</label>
                    <div className="flex items-center justify-between">
                    <span className="text-gray-700">Active</span>
                    <button
                        id="activeButton"
                        onClick={handleactiveToggle}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        formData.active ? "bg-blue-500" : "bg-gray-300"
                        }`}
                    >
                        <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            formData.active ? "translate-x-6" : "translate-x-1"
                        }`}
                        />
                    </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end pt-6 border-t border-gray-200">
                    <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                    Save Changes
                    </button>
                </div>
                </div>
            </div>
        </div>
    )
}
