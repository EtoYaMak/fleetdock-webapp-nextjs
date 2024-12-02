import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { RoleProvider } from "../context/RoleContext";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AuthStateHandler from "@/components/auth/AuthStateHandler";
import { LoadTypesProvider } from "@/context/LoadTypesContext";

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
        <ThemeProvider>
          <AuthProvider>
            <RoleProvider>
              <LoadTypesProvider>
                <AuthStateHandler>
                  <Navbar />
                  <main className="flex-grow ">{children}</main>
                  <Footer />
                </AuthStateHandler>
              </LoadTypesProvider>
            </RoleProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
