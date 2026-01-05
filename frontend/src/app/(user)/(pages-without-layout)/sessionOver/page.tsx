"use client"

export default function SessionOverPage() {

  return (
    <>
      <main className="min-h-[calc(100vh-72px)] bg-gray-50">
        <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              {/* Warning icon */}
              <svg
                aria-hidden="true"
                className="h-7 w-7 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.34 3.84 1.79 18a2 2 0 0 0 1.72 3h16.98a2 2 0 0 0 1.72-3L13.66 3.84a2 2 0 0 0-3.32 0Z"
                />
              </svg>
              <span className="sr-only">Session expired</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Your session has expired</h1>
            <p className="mt-2 text-sm text-gray-600">
              For your security, we signed you out due to inactivity or missing token. Please log in again to continue.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-white text-sm font-medium shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Logout
              </button>
              {/* <a
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                Go to Home
              </a> */}
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 border border-dashed border-gray-200 p-3 text-xs text-gray-500">
              Tip: If you keep seeing this message, check that you are logged out on other tabs and then log in again.
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
