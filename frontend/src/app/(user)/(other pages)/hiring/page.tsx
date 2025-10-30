"use client"

import { getAllJobs } from "@/services/userService"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLoading } from "../../template"

export default function JobApplications() {
  const setLoading=useLoading()
  const router=useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [jobs, setJobs]=useState<any>([])
  const itemsPerPage = 3

  useEffect(()=>{
    const getJobs = async () => {
      const result=await getAllJobs()
      setJobs(result.jobs)
    }

    getJobs()
  }, [])


  // const filteredApplications = applications.filter((app) =>
  //   app.company.toLowerCase().includes(searchQuery.toLowerCase()),
  // )

  // const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  // const startIndex = (currentPage - 1) * itemsPerPage
  // const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const goToIndividualApplicationPage = (id:string) => {
    setLoading(true)
    router.push(`/hiring/application/${id}`)
  }

  return (
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search by company name..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? "No jobs found matching your search." : "No job applications found."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {jobs.map((app) => (
                      <div key={app._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Left content */}
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 cursor-pointer" onClick={()=>goToIndividualApplicationPage(app._id)}>{app.jobTitle}</h2>
                            <p className="text-blue-600 text-sm mb-4">
                              {app.company.name} - {app.location}
                            </p>
                            <p className="text-gray-700 text-sm leading-relaxed mb-6">{app.jobDescription.split(' ').slice(0, 40).join(' ')+' ....'}</p>
                            <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md text-sm transition-colors">
                              Apply
                            </button>
                          </div>

                          {/* Right logo card */}
                          <div className="flex-shrink-0">
                            <div
                              className={`rounded-lg p-8 h-32 w-full lg:w-48 md:w-20 flex items-center justify-center`}
                            >
                              <Image
                                src={app.company.logo}
                                height={200}
                                width={200}
                                alt="Company Logo"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-gray-600 text-sm">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of{" "}
                        {filteredApplications.length} results
                      </p>
                      <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )} */}
                </>
              )}
            </div>
          </main>
  )
}
