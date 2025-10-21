"use client"

import { useState } from "react"
import Link from "next/link"

export default function ServerErrorPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Error Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Error Code */}
          <h1 className="text-5xl font-bold text-gray-900 mb-2">500</h1>

          {/* Error Title */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Server Error</h2>

          {/* Error Description */}
          <p className="text-gray-600 mb-2 leading-relaxed">
            Something went wrong on our end. Our team has been notified and is working to fix the issue.
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Please try again in a few moments or contact support if the problem persists.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              {isRefreshing ? "Refreshing..." : "Try Again"}
            </button>

            <Link
              href="/"
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center"
            >
              Go Home
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a href="mailto:support@careerlink.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Error Reference */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Error Reference: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>
    </div>
  )
}
