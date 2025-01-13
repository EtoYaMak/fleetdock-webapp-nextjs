import "./globals.css";
import { Metadata } from "next";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ThemeProvider } from "@/context/theme-provider";
import { Montserrat } from "next/font/google";
import ClientLayout from "@/app/client-layout";
import { metadata as siteMetadata } from "./metadata";
import { GlobalFloatingChat } from "@/components/chat/GlobalFloatingChat";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
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
            <ClientLayout>{children}

              <GlobalFloatingChat />

            </ClientLayout>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
