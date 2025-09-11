import React from 'react'
import Navbar from '@/components/navbar';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
      <div>
        <Navbar/>
        {children}
      </div>

  );
}