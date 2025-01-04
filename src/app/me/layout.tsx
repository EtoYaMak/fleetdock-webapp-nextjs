"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileSidebar } from "@/app/me/ProfileSidebar";
import { useAuth } from "@/context/AuthContext";
import { useBroker } from "@/hooks/useBroker";
import { useTrucker } from "@/hooks/useTrucker";
import { useState, ReactNode } from "react";
import Navbar from "@/components/common/Navbar";

// Create a context to share the hooks data
export type DashboardContextType = {
  auth: ReturnType<typeof useAuth>;
  broker: ReturnType<typeof useBroker>;
  trucker: ReturnType<typeof useTrucker>;
};

import { createContext, useContext } from "react";

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useProfileSidebar = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useProfileSidebar must be used within a ProfileSidebarProvider"
    );
  }
  return context;
};

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Initialize all your hooks
  const auth = useAuth();
  const broker = useBroker();
  const trucker = useTrucker();

  // Create the shared context value
  const dashboardValue = {
    auth,
    broker,
    trucker,
  };

  return (
    <DashboardContext.Provider value={dashboardValue}>
      <div className="flex h-screen overflow-hidden">
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <ProfileSidebar open={open} />

          <main className="flex-1">{children}</main>
        </SidebarProvider>
      </div>
    </DashboardContext.Provider>
  );
}
