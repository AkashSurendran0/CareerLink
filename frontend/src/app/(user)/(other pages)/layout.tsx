"use client";

import React, {useState} from "react";
import MainSidebar from "@/components/mainSidebar";
import MainNavbar from "@/components/mainnavbar";

function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen]=useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <MainSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="flex flex-col flex-1">
                <MainNavbar setSidebarOpen={setSidebarOpen}/>
                {children}
            </div>
        </div>
    );
}

export default MainLayout;
