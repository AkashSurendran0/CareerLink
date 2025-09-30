import React from 'react'

function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-gray-900">CareerLink</h1>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
