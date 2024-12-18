
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserProvider from "@/context/AuthContext";
import { Metadata } from "next";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/theme-provider";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

// Define metadata outside component for better performance
export const metadata: Metadata = {
  title: "FleetDock",
  description: "Revolutionize Your Logistics",
  keywords: "logistics, freight, trucking, shipping",
};

// Memoize the layout component itself
const RootLayout = function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen flex flex-col ${montserrat.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<LoadingSpinner />}>
            <UserProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Toaster />
              <Footer />
            </UserProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
