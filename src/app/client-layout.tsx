"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserProvider from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith("/me");

  return (
    <UserProvider>
      {/*  {!isProfilePage && <Navbar />} */}
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Toaster />
      {/* {!isProfilePage && <Footer />} */}
      <Footer />
    </UserProvider>
  );
}
