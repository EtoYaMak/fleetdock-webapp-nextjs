"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { memo, useEffect } from "react";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

const ProfileLayout = memo(function ProfileLayout({
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

  return (
    <div className="profile-layout">
      {/* Add any common layout components here, like a sidebar or header */}
      {children}
    </div>
  );
});

ProfileLayout.displayName = "ProfileLayout";

export default ProfileLayout;
