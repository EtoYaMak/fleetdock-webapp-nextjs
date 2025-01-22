"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);

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
        <div className="flex min-h-screen">
            <SidebarProvider open={open} onOpenChange={setOpen}>
                <AdminSidebar open={open} />
                <main className="flex-1">
                    {children}
                </main>
            </SidebarProvider>
        </div>
    );
}