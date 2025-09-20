"use client"

import React from 'react'
import Navbar from '@/components/navbar';
import {SnackbarProvider} from 'notistack'


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
        <Navbar/>
        {children}
      </div>
    </SnackbarProvider>
  );
}