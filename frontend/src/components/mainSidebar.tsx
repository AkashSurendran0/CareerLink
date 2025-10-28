"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/(user)/template";
import { getCompanyRegistrationInfo } from "@/services/userService";
import { usePathname } from "next/navigation";

interface SidebarProps {
  sidebarOpen:boolean,
  setSidebarOpen: (open:boolean) => void
}

function MainSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname=usePathname()
  const setLoading=useLoading()
  const router=useRouter()
  const [activeBar, setActiveBar]=useState('Feeds')
  const [tab, setTab]=useState({ label:'', value:'' })

  useEffect(()=>{
    getCompanyInfo()
  }, [])

  async function getCompanyInfo () {
    const result=await getCompanyRegistrationInfo()
    if(result.result.success){
      setTab({label:'Your Company', value:'/company/registeredCompany'})
    }else{
      setTab({label:'Register A Company', value:'/company/registrationPage'})
    }
  }

  const sidebarItems = [
    { icon: "🏠", label: "Feeds", value:"/feed" },
    { icon: "👥", label: "Meet People", value:"" },
    { icon: "💼", label: "Hiring", value:"/hiring" },
    { icon: "💬", label: "Chats", value:"" },
    { icon: "👤", label: "Your Profile", value:"/profile/user" },
    { icon: "🏢", label: `${tab.label}`, value:`${tab.value}` },
    { icon: "📄", label: "Generate A Cover Letter", value:"" },
    { icon: "📋", label: "Generate A Resume", value:"" },
    { icon: "⚙️", label: "Settings", value:"" },
  ];

  const handleSidebarClick = (label:string, value:string) => {
    if(pathname==value) return 
    setLoading(true)
    setActiveBar(label)
    setSidebarOpen(false)
    router.push(value)
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:w-64 lg:flex-col`}
      >
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4">
            <span className="text-xl font-bold text-gray-900">CareerLink</span>
            <button
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  className={`cursor-pointer w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    activeBar==item.label
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={()=>handleSidebarClick(item.label, item.value)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainSidebar;
