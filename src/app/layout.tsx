import "./globals.css";
import Navbar from "@/app/components/common/Navbar";
import Footer from "@/app/components/common/Footer";
import UserProvider from "@/context/AuthContext";
import { memo } from "react";
import { Metadata } from "next";
import { Suspense } from "react";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
// Define metadata outside component for better performance
export const metadata: Metadata = {
  title: "FleetDock",
  description: "Revolutionize Your Logistics",
  keywords: "logistics, freight, trucking, shipping",
};

// Memoize static components
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);

// Memoize the layout component itself
const RootLayout = memo(function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#111a2e]">
        <UserProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <MemoizedNavbar />
            <main className="flex-grow">{children}</main>
            <MemoizedFooter />
          </Suspense>
        </UserProvider>
      </body>
    </html>
  );
});

export default RootLayout;
