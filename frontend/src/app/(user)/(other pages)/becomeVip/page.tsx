"use client"

import { useState } from "react"
import { Check } from "lucide-react"

export default function BecomeVIPPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const basicFeatures = ["Limited AI Cover Letter Generator", "Limited Resume Generation", "Single Resume Template"]

  const premiumFeatures = [
    "Unlimited AI Cover Letters",
    "Unlimited Resume Generation",
    "Tailored Cover Letter and Resume Generation for Jobs",
    "AI enhanced ATS Feature",
    "Multiple Resume Templates",
  ]

  return (
        <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Unlock Your Career Potential</h1>
                <p className="text-lg text-blue-600">
                    Upgrade to Premium for unlimited AI cover letters, multiple resume templates, advanced ATS tracking, and
                    more.
                </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Basic Plan */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic</h2>
                    <div className="mb-6">
                    <p className="text-5xl font-bold text-gray-900">Free</p>
                    </div>

                    {/* Current Plan Badge */}
                    <div className="bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded text-center mb-6">
                    Current Plan
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4">
                    {basicFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                    </ul>
                </div>

                {/* Premium Plan */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium</h2>
                    <div className="mb-6">
                    <p className="text-5xl font-bold text-gray-900">
                        ₹899 <span className="text-lg text-gray-600">/month</span>
                    </p>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg mb-6 transition-colors">
                    Upgrade to Premium
                    </button>

                    {/* Features List */}
                    <ul className="space-y-4">
                    {premiumFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                {/* Trust Message */}
                <div className="text-center">
                <p className="text-gray-600">Secure payments. Cancel anytime. Trusted by professionals.</p>
                </div>
            </div>
        </main>
  )
}
