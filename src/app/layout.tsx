import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserProvider from "@/context/AuthContext";

export const metadata = {
  title: "FleetDock",
  description: "Revolutionize Your Logistics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#203152] ">
        <UserProvider>
          <Navbar />
          <main className="flex-grow ">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
