"use client";

import React, {useState} from "react";
import MainSidebar from "@/components/mainSidebar";
import MainNavbar from "@/components/mainNavbar";
import {SnackbarProvider} from 'notistack'

function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen]=useState(false)

    return (
        <SnackbarProvider
            maxSnack={3} 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3000}
        >
        <div className="min-h-screen bg-gray-50 flex">
            <MainSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="flex flex-col flex-1">
                <MainNavbar setSidebarOpen={setSidebarOpen}/>
                {children}
            </div>
        </div>
        </SnackbarProvider>
    );
}

export default MainLayout;
