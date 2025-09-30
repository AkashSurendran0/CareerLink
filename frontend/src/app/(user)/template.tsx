"use client";

import React, { useState, createContext, useContext } from "react";
import LoadingScreen from "@/components/loadingScreen";

const LoadingContext = createContext<{
  setLoading: (loading: boolean) => void;
} | null>(null);

function LoadingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {loading && <LoadingScreen />}
      {children}
    </LoadingContext.Provider>
  );
}

export default LoadingLayout;

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used inside LoadingLayout");
  }
  return context.setLoading;
}
