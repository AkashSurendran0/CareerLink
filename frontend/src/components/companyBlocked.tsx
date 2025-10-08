"use client"

export default function CompanyBlockedPage() {

  return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mt-16 sm:mt-20">
          <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-10 flex flex-col items-center text-center"
            role="alert"
            aria-live="assertive"
          >
            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
              {/* Warning icon */}
              <svg className="h-7 w-7 text-red-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">Company Access Restricted</h1>
            <p className="mt-2 text-gray-600 leading-relaxed">
              This company profile has been blocked or is temporarily suspended. If you believe this is a mistake,
              please contact support for assistance.
            </p>

            {/* Optional details box */}
            <div className="mt-6 w-full rounded-lg bg-gray-50 border border-gray-200 p-4 text-left">
              <p className="text-sm text-gray-700">
                Reason: <span className="text-gray-600">Policy violation or pending review</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Our team reviews company profiles to ensure a safe and trustworthy environment.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
              <a
                href="#support"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Contact Support
              </a>
                Back to Dashboard
            </div>
          </div>

          {/* Helpful note */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Need immediate help? Email support at{" "}
            <a href="mailto:support@careerlink.example" className="text-blue-600 hover:underline">
              support@careerlink.example
            </a>
          </p>
        </section>
      </main>
  )
}
