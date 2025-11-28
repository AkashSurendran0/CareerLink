'use client'

import React from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSidebar";
import {SnackbarProvider} from 'notistack'

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SnackbarProvider
          maxSnack={3} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
        <div>
            <AdminNavbar/>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar/>
                {children}
            </div>
        </div>
        </SnackbarProvider>
    )
}