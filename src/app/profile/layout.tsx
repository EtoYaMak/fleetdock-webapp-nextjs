"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if user is not authenticated
  if (!user) {
    router.push("/login");
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="profile-layout">
      {/* Add any common layout components here, like a sidebar or header */}
      {children}
    </div>
  );
}
