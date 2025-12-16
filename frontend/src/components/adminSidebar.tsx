"use client"

import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons
import Link from "next/link";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItems = [
    { icon: "🏠", label: "Dashboard", active: false, value:"" },
    { icon: "👥", label: "Users", active: true, value:"/admin/userManagement" },
    { icon: "🏢", label: "Companies", active: false, value:"/admin/companyManagement" },
    { icon: "📄", label: "Reports", active: false, value:"/admin/reports" },
    { icon: "📊", label: "Analytics", active: false, value:"" },
    { icon: "💳", label: "Subscriptions", active: false, value:"/admin/subscriptionManagement" },
  ];

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
            {sidebarItems.map((item) => (
                <Link
                href={item.value}
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    item.active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                >
                <span className="w-4 h-4 text-center">{item.icon}</span>
                {item.label}
                </Link>
            ))}
            </nav>
        </div>
    </div>
  );
}

export default AdminSidebar;
