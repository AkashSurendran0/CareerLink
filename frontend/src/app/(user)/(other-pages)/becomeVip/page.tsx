"use client"

import { useEffect, useState } from "react"
import { buyPremium, getActivePlans, getOrderId, stripePayment, verifyPayment } from "@/services/userService"
import { Check } from "lucide-react"
import { enqueueSnackbar } from "notistack"
import { useLoading } from "../../template"
import { useRouter } from "next/navigation"

interface Feature {
    text: string
}

interface Plan {
    _id: string
    name: string
    amount: number
    billingCycle: number
    features: Feature[]
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    }
}

interface RazorpayOptions {
    key: string | undefined
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: RazorpayResponse) => void
}

interface RazorpayInstance {
    open: () => void
}

interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

export default function BecomeVIPPage() {
    const router=useRouter()
    const setLoading=useLoading()
    const [plans, setPlans]=useState<Plan[]>([])
    const [showOptions, setShowOptions]=useState(false)
    const [selectedPlan, setSelectedPlan]=useState<Plan | null>(null)

    useEffect(()=>{
        getPlans()
    }, [])

    const getPlans = async () => {
        const result=await getActivePlans()
        setPlans(result.result)
    }

    const getDuration = (duration:number) => {
        if(duration==7) return 'Week'
        if(duration==30) return 'Month'
        if(duration==365) return 'Year'
        return 'Month'
    }

    const closeOptions = () => {
        setSelectedPlan(null)
        setShowOptions(false)
    }

    const openPaymentOptions = (plan: Plan) => {
        setSelectedPlan(plan)
        setShowOptions(true)
    }

    const loadScript = (src:string) => {
        return new Promise((resolve)=>{
            const script=document.createElement('script')
            script.src=src
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    const openRazorpay = async () => {
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res) return enqueueSnackbar('Server error, please try again later', {variant:'error'})

        if(!selectedPlan) return enqueueSnackbar('Server error, please try again later', {variant:'error'})
        const data = {
            amount:selectedPlan.amount
        }
        const orderRes=await getOrderId(data)
        const {order}=await orderRes

        const options={
            key:process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
            amount:order.amount,
            currency:'INR',
            name:'CareerLink',
            description:'Purchase premium and unlock exciting features!',
            order_id:order.id,
            handler: async function (response: RazorpayResponse)  {
                const verifyData=await verifyPayment(response)
                
                if(verifyData.success){
                    setLoading(true)
                    const result=await buyPremium(selectedPlan._id, selectedPlan.billingCycle)
                    window.location.reload()
                }else{
                    enqueueSnackbar('Payment Failed', {variant:'error'})
                }
            }
        }

        const rzp1=new window.Razorpay(options)
        rzp1.open()
    }

    const openStripe = async () => {
        if(!selectedPlan) return enqueueSnackbar('Server error, please try again later', {variant:'error'})
        const data = {
            amount:selectedPlan.amount,
            id:selectedPlan._id,
            validity:selectedPlan.billingCycle,
            
        }
        const result=await stripePayment(data)
        window.location.href=result.url
    }

    return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {showOptions && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/50"
                            onClick={closeOptions}
                        />

                        <div className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm z-10">
                            <h2 className="text-xl font-semibold text-center mb-4">
                            Select an Option
                            </h2>

                            <div className="flex flex-col gap-3">
                            <button
                                onClick={openRazorpay}
                                className="cursor-pointer w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                            >
                                Razorpay
                            </button>
                            <button
                                onClick={openStripe}
                                className="cursor-pointer w-full py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                            >
                                Stripe
                            </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Unlock Your Career Potential</h1>
                <p className="text-lg text-blue-600">
                    Upgrade to Premium for unlimited AI cover letters, multiple resume templates, advanced ATS tracking, and
                    more.
                </p>
                </div>

                {/* Pricing Cards */}
                {/* Basic Plan */}
                {plans && plans.length>0 ? (
                    <>
                        <div  className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {plans.map((plan, ind)=> (
                                <div key={ind} className="bg-white rounded-lg border border-gray-200 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>
                                    <div className="mb-6">
                                    <p className="text-5xl font-bold text-gray-900">₹{plan.amount}/ {getDuration(plan.billingCycle)}</p>
                                    </div>

                                    {/* Current Plan Badge */}
                                    <button onClick={()=>openPaymentOptions(plan)} className="cursor-pointer w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg mb-6 transition-colors">
                                        Upgrade to {plan.name}
                                    </button>

                                    {/* Features List */}
                                    <ul className="space-y-4">
                                    {plan.features.map((feature: Feature, index: number) => (
                                        <li key={index} className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature.text}</span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>

                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">There are no active plans currently. Please check out after some time :)</h3>
                    </div>
                )}  

                {/* Trust Message */}
                {plans && plans.length>0 && (
                    <div className="text-center">
                        <p className="text-gray-600">Secure payments. Cancel anytime. Trusted by professionals.</p>
                    </div>
                )}
            </div>
        </main>
    )
}
