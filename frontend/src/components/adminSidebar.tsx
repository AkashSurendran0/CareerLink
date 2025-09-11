"use client"

import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // for hamburger icons

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItems = [
    { icon: "🏠", label: "Dashboard", active: false },
    { icon: "👥", label: "Users", active: true },
    { icon: "🏢", label: "Companies", active: false },
    { icon: "📄", label: "Reports", active: false },
    { icon: "📊", label: "Analytics", active: false },
    { icon: "💳", label: "Subscriptions", active: false },
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
                <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    item.active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                >
                <span className="w-4 h-4 text-center">{item.icon}</span>
                {item.label}
                </button>
            ))}
            </nav>
        </div>
    </div>
  );
}

export default AdminSidebar;
