"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {UserCircle} from 'lucide-react'
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/(user)/template";
import { getUserDetails, viewOtherUserDetails } from "@/services/userService";

type Education = {
    degree: string;
    university: string;
    passingYear: string;
};

interface Props {
    params:{
        id:string
    }
}

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

type Tab = {
    href:string,
    label:string
}


export default function ConnectionLayout({
    children,
    params
} : {
    children:React.ReactNode,
    params:Props
}) {
    const {id}=params
    const setLoading=useLoading()
    const router=useRouter()
    const [activeTab, setActiveTab] = useState("About");
    const [userDetails, setUserDetails] = useState<Details>()

    const tabs = [
        { href:`/meetPeople/${id}`, label:'About' },
        { href:`/meetPeople/${id}/posts`, label:'Posts' },
        { href:`/meetPeople/${id}/githubActivity`, label:'Github Activity' },
    ];

    useEffect(()=>{

        const fetchUserDetails=async ()=>{
            const details=await viewOtherUserDetails(id)
            setUserDetails(details.userDetails)
        }

        fetchUserDetails()
    }, [])

    const setTab = (i:Tab) => {
        setLoading(true)
        setActiveTab(i.label)
        router.push(i.href)
    }

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
                <div className="flex-shrink-0 flex flex-col ga">
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md cursor-pointer">
                    Connect
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded-md cursor-pointer">
                    Connect
                </button>
                </div>
            </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
            <div className="border-b border-gray-200 bg-white rounded-lg shadow-sm">
                <nav className="flex space-x-8 px-6">
                {tabs.map((tab, ind) => (
                    <button 
                    key={ind}
                    onClick={() => setTab(tab)}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.label
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    >
                    {tab.label}
                    </button>
                ))}
                </nav>
            </div>

            {/* Tab Content */}
            {children}
            </div>
        </div>
        </main>
    );
}
