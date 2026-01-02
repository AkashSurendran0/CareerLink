"use client"

import { adminLogout } from '@/services/adminService'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/reusable-components/confirmModal'
import { usePathname } from 'next/navigation'

function AdminNavbar() {
  const router=useRouter()
  const pathname=usePathname()
  const [logoutConfirmation, setLogoutConfirmation] = useState(false)

  const logoutAdmin = async () => {
    const result=await adminLogout()
    if(result.success){
      router.push('/admin/logout')
    }
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-2">
      {logoutConfirmation && (
          <ConfirmModal onClose={()=>setLogoutConfirmation(false)} title="Confirm your action" message="Do you want to logout?" onConfirm={logoutAdmin}/>
      )}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-gray-900">CareerLink Admin Panel</h1>
        </div>
        {pathname !== '/admin/login' && (
          <div className="flex items-center space-x-3">
            <button 
            onClick={()=>setLogoutConfirmation(true)}
            className='cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-full transition-colors'
            >Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default AdminNavbar
