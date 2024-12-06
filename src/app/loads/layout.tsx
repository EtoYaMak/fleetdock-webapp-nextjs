"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, memo } from "react";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

const LoadsLayout = memo(function LoadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" color="border-blue-500" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
});

LoadsLayout.displayName = "LoadsLayout";

export default LoadsLayout;
