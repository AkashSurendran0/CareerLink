import React from 'react'
import AdminNavbar from '@/components/adminNavbar';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
      <div>
        <AdminNavbar/>
        {children}
      </div>

  );
}