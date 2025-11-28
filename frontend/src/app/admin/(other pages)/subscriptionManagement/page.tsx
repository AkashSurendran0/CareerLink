"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { alterPlanStatus, getAllPlans } from "@/services/adminService"
import { LoaderIcon } from "lucide-react"
import { enqueueSnackbar } from "notistack"

interface Plan {
  id: number
  name: string
  price: number
  billingCycle: string
  features: string[]
  status: string
}

const plans: Plan[] = [
  {
    id: 1,
    name: "Basic Plan",
    price: 0.0,
    billingCycle: "Monthly",
    features: ["Feature 1", "Feature 2", "Feature 3", "+2 more"],
    status: "Active",
  },
  {
    id: 2,
    name: "Pro Plan",
    price: 899.0,
    billingCycle: "Monthly",
    features: ["Feature 1", "Feature 2", "Feature 3", "+5 more"],
    status: "Active",
  },
]

export default function SubscriptionsPage() {
    // const [tablePlans] = useState<Plan[]>(plans)
    const [plans, setPlans]=useState([])    
    const router=useRouter()
    const [statusLoading, setStatusLoading]=useState(false)

    useEffect(()=>{
        getPlans()
    }, [])

    const getPlans = async () => {
        const result=await getAllPlans()
        setPlans(result.result)
    }
    
    const alterStatus = async (id:string, ind:number) => {
        setStatusLoading(true)
        const result=await alterPlanStatus(id)
        if(result.result.success){
            console.log(ind)
            setPlans((prev)=>
                prev.map((plan, num)=>
                    num==ind? {...plan, active:!plan.active}:plan
                )
            )
            setStatusLoading(false)
        }else{
            setStatusLoading(false)
            enqueueSnackbar('Something went wrong', {variant:'error'})
        }
    }

    const goToAddPlan = () => {
        router.push('/admin/subscriptionManagement/addPlan')
    }

    return (
        <div className="flex-1">
        {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between text-sm md:text-base lg:text-xl">
                    <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        Manage Subscription Plans
                        <span className="text-blue-600">💳</span>
                    </h1>
                    <p className="text-gray-600 mt-1">View, edit, and manage all subscription plan.</p>
                    </div>
                    <div className="text-right">
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-lg font-bold text-gray-900">All Subscription Plans</h2>
                    <button 
                    className="cursor-pointer mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-sm text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    onClick={goToAddPlan}
                    >
                        + Add New Plan
                    </button>
                </div>
                {/* Table Container */}
                {plans.length>0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Billing Cycle</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {plans.map((plan, ind) => (
                                <tr key={plan._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{plan.name}</td>
                                <td className="px-6 py-4 text-sm">₹ {plan.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm">{plan.billingCycle} days</td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex flex-wrap gap-1">
                                    {plan.features.map((feature, idx) => (
                                        <a key={idx} href="#" className="hover:underline">
                                        {feature.code}
                                        {/* {idx < plan.features.length - 1 && ", "} */}
                                        </a>
                                    ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {statusLoading? (
                                        <LoaderIcon className='animate-spin text-white-500'/>
                                    ) : (
                                        <>
                                            {plan.active? (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                Not Active
                                                </span>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {plan.active? (
                                        <button onClick={()=>alterStatus(plan._id, ind)} className="text-red-600 hover:underline font-medium">
                                            Deactivate
                                        </button>
                                    ) : (
                                        <button onClick={()=>alterStatus(plan._id, ind)} className="text-blue-600 hover:underline font-medium">
                                            Activate
                                        </button>
                                    )}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 p-4">
                        {plans.map((plan, ind) => (
                            <div key={plan._id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">{plan.active}</span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div>
                                <span className="text-gray-600">Price: </span>
                                <span className="font-medium text-gray-900">₹ {plan.amount.toFixed(2)}</span>
                                </div>
                                <div>
                                <span className="text-gray-600">Billing: </span>
                                <span className="font-medium text-blue-600">{plan.billingCycle} days</span>
                                </div>
                                <div>
                                <span className="text-gray-600">Features: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {plan.features.map((feature, idx) => (
                                    <a key={idx} href="#" className="text-blue-600 hover:underline text-xs">
                                        {feature.code}
                                        {/* {idx < plan.features.length - 1 && ","} */}
                                    </a>
                                    ))}
                                </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                                {plan.active? (
                                    <button onClick={()=>alterStatus(plan._id, ind)} className="text-red-600 hover:underline font-medium">
                                        Deactivate
                                    </button>
                                ) : (
                                    <button onClick={()=>alterStatus(plan._id, ind)} className="text-blue-600 hover:underline font-medium">
                                        Activate
                                    </button>
                                )}
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-center align-middle py-3'>
                        <h2>No plans created</h2>
                    </div>
                )}
            </div>

        </div>
    )
}
