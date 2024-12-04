import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserProvider from "@/context/AuthContext";
import { memo } from "react";

export const metadata = {
  title: "FleetDock",
  description: "Revolutionize Your Logistics",
};

// Memoize static components
const MemoizedNavbar = memo(Navbar);
const MemoizedFooter = memo(Footer);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#203152]">
        <UserProvider>
          <MemoizedNavbar />
          <main className="flex-grow">{children}</main>
          <MemoizedFooter />
        </UserProvider>
      </body>
    </html>
  );
}
