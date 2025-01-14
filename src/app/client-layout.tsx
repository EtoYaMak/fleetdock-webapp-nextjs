"use client";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserProvider from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { ChatProvider } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { GlobalFloatingChat } from "@/components/chat/GlobalFloatingChat";
import { User } from "@/types/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
export default function ClientLayout({
  children,

}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  return (
    <UserProvider>
      <ChatProvider>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <GlobalFloatingChat user={user as User} />
        <Toaster />
        <Footer />
      </ChatProvider>
    </UserProvider>
  );
}
