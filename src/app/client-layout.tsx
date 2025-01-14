"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ChatProvider } from "@/context/ChatContext";
import { UserDataProvider } from "@/context/UserDataContext";
import { TripCalculatorProvider } from "@/context/TripCalculatorContext";
import { GlobalFloatingChat } from "@/components/chat/GlobalFloatingChat";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <TripCalculatorProvider>
          {children}
        </TripCalculatorProvider>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}
