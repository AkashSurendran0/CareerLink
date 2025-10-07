"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {UserCircle} from 'lucide-react'
import { useRouter } from "next/navigation";

type Education = {
    degree: string;
    university: string;
    passingYear: string;
};

type Experience = {
    company: string;
    experience: string;
};

type Details = {
    username: string;
    profilePicture?: string;
    aboutMe: string;
    location: string,
    proficiency: string,
    skills: string[];
    education: Education[];
    experience: Experience[];
    linkedin: string;
};


export default function ProfileDashboard() {
    const router=useRouter()
    const [activeTab, setActiveTab] = useState("About");
    const [userDetails, setUserDetails] = useState<Details>()

    const tabs = [
        "About",
        "Posts",
        "Jobs Applied",
        "Github Activity",
        "My Resumes",
    ];

    const goToEditPage = () => {
        router.push("/profile/editUser")
    }

    useEffect(()=>{

        const fetchUserDetails=async ()=>{
            const token=localStorage.getItem('token')
            const details=await axios.get('http://localhost:5000/user/v1/getUserDetails', {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(details)
            setUserDetails(details.data.userDetails)
        }

        fetchUserDetails()
    }, [])

    return (
        <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex-shrink-0">
                    {userDetails && userDetails.profilePicture? (
                        <Image
                            width={300}
                            height={300}
                            src={`${userDetails?.profilePicture}`}
                            alt="Sophia Carter"
                            className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover"
                        />
                    ):(
                        <UserCircle className="h-24 color-gray-600 w-24 md:h-32 md:w-32 rounded-full object-cover"/>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                <h1 className="text-1xl md:text-2xl font-bold text-gray-900">
                    {userDetails && userDetails.username}
                </h1>
                <p className="text-md text-gray-600 mt-1">

                    {userDetails && userDetails.proficiency}
                </p>
                <p className="text-gray-500 mt-1">{userDetails && userDetails.location}</p>
                </div>
                <div className="flex-shrink-0">
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md cursor-pointer" onClick={goToEditPage}>

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
            {userDetails && userDetails.aboutMe? (
                <div className="p-6">
                    {activeTab === "About" && (
                    <div className="space-y-8">
                        {/* About Section */}
                        <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            About
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {userDetails && userDetails.aboutMe}
                        </p>
                        </div>

                        {/* Education Section */}
                        <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Education
                        </h2>
                        <div className="space-y-4">
                            {userDetails && userDetails.education.map((edu, ind)=>(
                                <div key={ind} className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                    <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">{edu.university[0]}</span>
                                    </div>
                                    </div>
                                    <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.university}
                                    </h3>
                                    <p className="text-gray-600">{edu.passingYear}</p>
                                    <p className="text-gray-500">
                                        {edu.degree}
                                    </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        </div>

                        {/* Work Experience Section */}
                        { userDetails && userDetails.experience.length>0 && (
                            <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Work Experience
                            </h2>
                            <div className="space-y-4">
                                {userDetails.experience.map((exp, ind)=>(
                                    <div key={ind} className="space-y-15">
                                        <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {exp.company[0]}
                                            </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                            {exp.company}
                                            </h3>
                                            <p className="text-gray-600">{exp.experience} Years of Experience</p>
                                        </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            </div>
                        )}

                        {/* Skills Section */}
                        <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {userDetails?.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                            >
                                {skill}
                            </span>
                            ))}
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
            ) : (
                <div className="flex justify-center">
                    <div className="p-6">
                        <h3>Would recommend adding details to your profile to make you stand out :)</h3>
                    </div>
                    
                </div>
            )}
            </div>
        </div>
        </main>
    );
}
