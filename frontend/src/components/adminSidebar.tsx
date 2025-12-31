"use client"

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function AdminSidebar() {
    const router=useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard")
  const pathname = usePathname()

  const sidebarItems = [
    { icon: "🏠", label: "Dashboard",  value:"/admin/dashboard" },
    { icon: "👥", label: "Users", value:"/admin/userManagement" },
    { icon: "🏢", label: "Companies",  value:"/admin/companyManagement" },
    { icon: "📄", label: "Reports",  value:"/admin/reports" },
    { icon: "📊", label: "Analytics",  value:"/admin/analytics" },
    { icon: "💳", label: "Subscriptions",  value:"/admin/subscriptionManagement" },
  ];

    useEffect(()=>{
      getSidebarTab()
    }, [])
  
    const getSidebarTab = () => {
        for(const item of sidebarItems) {
            if(pathname == item.value){
            setActiveTab(item.label)
            }
        }
    }

    const handleSidebarClick = (label:string, value:string) => {
        if(pathname==value) return 
        setActiveTab(label)
        setIsOpen(false)
        router.push(value)
    }

  return (
    <div className="flex z-40">
        {/* Mobile toggle button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 m-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
            {isOpen ? '' : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* Navigation */}
            <nav className="p-4 space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 m-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
                {isOpen? <X className="h-6 w-6"/> : ''}
            </button>
            {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  className={`cursor-pointer w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    activeTab==item.label
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={()=>handleSidebarClick(item.label, item.value)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
                // <Link
                // href={item.value}
                // key={item.label}
                // className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                //     activeTab == item.label
                //     ? "bg-blue-50 text-blue-700 font-medium"
                //     : "text-gray-700 hover:bg-gray-100"
                // }`}
                // >
                // <span className="w-4 h-4 text-center">{item.icon}</span>
                // {item.label}
                // </Link>
            ))}
            </nav>
        </div>
    </div>
  );
}

export default AdminSidebar;
