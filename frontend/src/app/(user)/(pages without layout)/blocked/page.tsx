"use client"

export default function BlockedPage() {

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Block Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Blocked</h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your account has been temporarily blocked due to a violation of our community guidelines. Please contact our
            support team if you believe this is an error.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors">
              Contact Support
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors">
              Learn More
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need immediate assistance? Email us at{" "}
              <a href="mailto:support@careerlink.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@careerlink.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
