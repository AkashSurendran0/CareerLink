"use client";

import { useEffect, useState } from "react";
import { getUserDetails } from "@/services/userService";

type Education = {
    degree: string;
    university: string;
    passingYear: string;
};

type Experience = {
    position:string;
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
    const [userDetails, setUserDetails] = useState<Details>()

    useEffect(()=>{

        const fetchUserDetails=async ()=>{
            const details=await getUserDetails()
            setUserDetails(details.userDetails)
        }

        fetchUserDetails()
    }, [])

    return (
            <>
                {userDetails && userDetails.aboutMe? (
                    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 ">
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
                                                {exp.position}
                                                </h3>
                                                <p className="text-gray-600">{exp.experience} Years of Experience</p>
                                                <p className="text-gray-500">
                                                    {exp.company}
                                                </p>
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
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="p-6">
                            <h3>Would recommend adding details to your profile to make you stand out :)</h3>
                        </div>
                        
                    </div>
                )}
            </>
    );
}
