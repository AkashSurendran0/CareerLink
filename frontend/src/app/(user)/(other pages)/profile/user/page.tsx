"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function ProfileDashboard() {
    const [activeTab, setActiveTab] = useState("About");

    const tabs = [
        "About",
        "Posts",
        "Jobs Applied",
        "Github Activity",
        "My Resumes",
    ];

    const skills = [
        "Product Strategy",
        "Market Analysis",
        "Agile Methodologies",
        "User Research",
        "Cross-functional Collaboration",
    ];

    return (
        <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                <Image
                    width={300}
                    height={300}
                    src="/professional-woman-smiling.png"
                    alt="Sophia Carter"
                    className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover"
                />
                </div>
                <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Sophia Carter
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                    Product Manager | Driving innovation in tech
                </p>
                <p className="text-gray-500 mt-1">San Francisco Bay Area</p>
                </div>
                <div className="flex-shrink-0">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md">
                    Edit Profile
                </button>
                </div>
            </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    >
                    {tab}
                    </button>
                ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === "About" && (
                <div className="space-y-8">
                    {/* About Section */}
                    <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        About
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        Experienced Product Manager with a passion for creating
                        user-centric solutions. Skilled in market analysis, product
                        strategy, and agile methodologies. Committed to delivering
                        impactful products that drive business growth.
                    </p>
                    </div>

                    {/* Education Section */}
                    <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Education
                    </h2>
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        </div>
                        <div>
                        <h3 className="font-semibold text-gray-900">
                            Stanford University
                        </h3>
                        <p className="text-gray-600">2018 - 2020</p>
                        <p className="text-gray-500">
                            Master of Business Administration
                        </p>
                        </div>
                    </div>
                    </div>

                    {/* Work Experience Section */}
                    <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Work Experience
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                C
                            </span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                            Tech Company C
                            </h3>
                            <p className="text-gray-600">2020 - Present</p>
                            <p className="text-gray-500">Product Manager</p>
                        </div>
                        </div>

                        <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                D
                            </span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">
                            Tech Company D
                            </h3>
                            <p className="text-gray-600">2018 - 2020</p>
                            <p className="text-gray-500">
                            Associate Product Manager
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                        >
                            {skill}
                        </span>
                        ))}
                    </div>
                    </div>

                    {/* Certifications Section */}
                    <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Certifications / Achievements
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <span className="text-blue-600 text-xl">📜</span>
                        </div>
                        <span className="text-gray-700">
                            Certified Product Manager
                        </span>
                        </div>
                        <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <span className="text-yellow-500 text-xl">🏆</span>
                        </div>
                        <span className="text-gray-700">Innovation Award</span>
                        </div>
                    </div>
                    </div>
                </div>
                )}

                {activeTab !== "About" && (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                    Content for {activeTab} tab coming soon...
                    </p>
                </div>
                )}
            </div>
            </div>
        </div>
        </main>
    );
}
