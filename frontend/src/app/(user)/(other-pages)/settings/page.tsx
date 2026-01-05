"use client"

import { cancelSubscription, getUserPlan, userLogout } from "@/services/userService"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "../../template"
import ConfirmModal from "@/reusable-components/confirmModal"

interface PlanDetails {
    name: string
}

interface Plan {
    createdAt: string
    validTill: string
}

interface UserPlan {
    plan: Plan
    planDetails: PlanDetails
}

export default function SettingsPage() {
    const setLoading=useLoading()
    const router=useRouter()
    const [chatNotifications, setChatNotifications] = useState(true)
    const [callNotifications, setCallNotifications] = useState(false)
    const [jobNotifications, setJobNotifications] = useState(false)
    const [logoutConfirmation, setLogoutConfirmation] = useState(false)
    const [userPlan, setUserPlan]=useState<UserPlan | null>(null)
    const [confirmBox, setConfirmBox]=useState(false)

    useEffect(()=>{
        getPlan()
    }, [])

    const getPlan = async () => {
        const result=await getUserPlan() 
        if(result.result.plan!=null && result.result.planDetails!=null){
            setUserPlan(result.result)
        }
    }

    const handleLogout = async () => {
        const result=await userLogout()
        if(result.success){
            router.replace('/login')
        }
        console.log("User logged out")
    }

    const handleUpgradePlan = () => {
        setLoading(true)
        router.push('/becomeVip')
    }

    const handleCancelSubscription = async () => {
        setLoading(true)
        await cancelSubscription()
        setUserPlan(null)
        setConfirmBox(false)
        window.location.reload()
    }

    return (
        <main className="flex-1 overflow-auto">
            {confirmBox && (
                <ConfirmModal onClose={()=>setConfirmBox(false)} title="Confirm your action" message="Do you want to cancel your ongoing subscription? (The amount is not refundable)" onConfirm={handleCancelSubscription}/>
            )}

            {logoutConfirmation && (
                <ConfirmModal onClose={()=>setLogoutConfirmation(false)} title="Confirm your action" message="Do you want to logout?" onConfirm={handleLogout}/>
            )}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Settings Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

                {/* Membership Information Section */}
                <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Information</h2>

                {userPlan ? (
                    <>
                    {/* Membership Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Plan</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Renewal Date</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-blue-600 font-medium">{userPlan.planDetails.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(userPlan.plan.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(userPlan.plan.validTill).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(userPlan.plan.validTill).getTime() < Date.now() ? 'Expired':'Active'}</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    { new Date(userPlan.plan.validTill).getTime() > Date.now() ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                            onClick={()=>setConfirmBox(true)}
                            className="cursor-pointer text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-medium transition-colors"
                            >
                            Cancel Subscription
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div
                                className="text-white py-2 bg-red-500 flex justify-center cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <p>The Subscription has expired. Please check for new offers</p>
                            </div>
                            <button
                            onClick={()=>router.push('/becomeVip')}
                            className="cursor-pointer text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium transition-colors"
                            >
                            Get New Plan
                            </button>
                        </div>
                    )}
                    </>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">You don&apos;t have any subscriptions</h3>
                    <p className="text-gray-600 mb-6">Upgrade to Premium to unlock unlimited features and benefits.</p>
                    <button
                        onClick={handleUpgradePlan}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md transition-colors"
                    >
                        Upgrade to Premium
                    </button>
                    </div>
                )}
                </div>

                {/* Notification Settings Section */}
                {/* <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>

                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                    <label className="text-gray-700 font-medium">Chat Notifications</label>
                    <button
                        onClick={() => setChatNotifications(!chatNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        chatNotifications ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            chatNotifications ? "translate-x-6" : "translate-x-1"
                        }`}
                        />
                    </button>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                    <label className="text-gray-700 font-medium">Call Notifications</label>
                    <button
                        onClick={() => setCallNotifications(!callNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        callNotifications ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            callNotifications ? "translate-x-6" : "translate-x-1"
                        }`}
                        />
                    </button>
                    </div>

                    <div className="flex items-center justify-between py-4">
                    <label className="text-gray-700 font-medium">Job Posting Notifications</label>
                    <button
                        onClick={() => setJobNotifications(!jobNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        jobNotifications ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            jobNotifications ? "translate-x-6" : "translate-x-1"
                        }`}
                        />
                    </button>
                    </div>
                </div>
                </div> */}

                {/* Logout Button */}
                <div>
                <button
                    onClick={()=>setLogoutConfirmation(true)}
                    className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full transition-colors"
                >
                    Logout
                </button>
                </div>
            </div>
        </main>

    )
}
