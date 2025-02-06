"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminProvider } from "@/context/AdminContext";
import { DocumentProvider } from "@/context/DocumentContext";
import { VehicleProvider } from "@/context/VehicleContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(true);
    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="lg" color="border-blue-500" />
            </div>
        );
    }

    if (!user || user.role !== "admin") return null;

    return (
        <AdminProvider>
            <SidebarProvider>
                <DocumentProvider>
                    <VehicleProvider>
                        <div className="flex h-screen w-full">
                            <AdminSidebar open={open} user={user} signOut={signOut} />
                            <main className="flex-1 overflow-y-auto bg-background">
                                {children}
                            </main>
                        </div>
                    </VehicleProvider>
                </DocumentProvider>
            </SidebarProvider>
        </AdminProvider>
    );
}