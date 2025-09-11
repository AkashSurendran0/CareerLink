import React from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <AdminNavbar/>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar/>
                {children}
            </div>
        </div>
    )
}