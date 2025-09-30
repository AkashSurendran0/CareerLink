"use client"

import React from "react";
import Image from "next/image";

interface NavbarProps {
    setSidebarOpen: (open:boolean) => void
}

function MainNavbar({ setSidebarOpen }:NavbarProps) {
  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 mr-3"
                onClick={() => setSidebarOpen(true)}
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="lg:hidden">
                <span className="text-xl font-bold text-gray-900">
                  CareerLink
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-md text-sm">
                Become VIP
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <span className="text-lg">🔔</span>
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                {/* <Image
                  width={300}
                  height={300}
                  src="/professional-woman-avatar.png"
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default MainNavbar
