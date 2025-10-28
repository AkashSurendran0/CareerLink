"use client"

import { useState } from "react"

export default function JobApplications() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const applications = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Innovators Inc.",
      location: "San Francisco, CA",
      description:
        "We are seeking a highly skilled Senior Software Engineer to join our dynamic team. The ideal candidate will have a strong background in software development, excellent problem-solving skills, and a passion for creating innovative solutions. This role involves designing, developing, and maintaining high-quality software applications, collaborating with cross-functional teams, and mentoring junior engineers.",
      logo: "bg-slate-800",
      logoText: "TECH",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Global Solutions Corp.",
      location: "New York, NY",
      description:
        "Global Solutions Corp. is looking for a talented Product Manager to lead the development and launch of new products. The Product Manager will be responsible for defining product strategy, gathering and prioritizing product and customer requirements, and working closely with engineering, sales, marketing, and support to ensure revenue and customer satisfaction goals are met.",
      logo: "bg-teal-700",
      logoText: "GLOBAL",
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Data Insights LLC",
      location: "Chicago, IL",
      description:
        "Data Insights LLC is seeking a Data Analyst to analyze large datasets and provide insights to support business decision-making. The Data Analyst will be responsible for data collection, processing, and analysis, as well as creating reports and visualizations to communicate findings to stakeholders. Strong analytical skills and experience with data analysis tools are required.",
      logo: "bg-teal-700",
      logoText: "Data Insights",
    },
  ]

  return (
        <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

                <div className="space-y-6">
                {applications.map((app) => (
                    <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left content */}
                        <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{app.title}</h2>
                        <p className="text-blue-600 text-sm mb-4">
                            {app.company} - {app.location}
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed mb-6">{app.description}</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md text-sm transition-colors">
                            Apply
                        </button>
                        </div>

                        {/* Right logo card */}
                        <div className="flex-shrink-0">
                        <div
                            className={`${app.logo} rounded-lg p-8 h-32 w-full lg:w-48 flex items-center justify-center`}
                        >
                            <div className="text-center">
                            <p className="text-white text-lg font-bold">{app.logoText}</p>
                            {app.id === 2 && <p className="text-white text-xs mt-1">SOLUTIONS</p>}
                            {app.id === 3 && <p className="text-white text-xs mt-1">Insights</p>}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </main>
  )
}
