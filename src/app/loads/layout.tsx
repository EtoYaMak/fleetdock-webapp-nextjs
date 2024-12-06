"use client";

import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function LoadsLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (!user && !loading) {
    redirect("/signin");
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return <div>{children}</div>;
}
