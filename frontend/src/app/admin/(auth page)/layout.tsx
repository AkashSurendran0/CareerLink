"use client"

import React from 'react'
import AdminNavbar from '@/components/adminNavbar';
import { SnackbarProvider } from 'notistack';

export default function AuthLayout({
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
        {children}
      </div>
    </SnackbarProvider>
  );
}