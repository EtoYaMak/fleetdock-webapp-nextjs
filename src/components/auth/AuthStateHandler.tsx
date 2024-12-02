"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthStateHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const protectedRoutes = ["/dashboard", "/profile", "/dashboard/*"];
  const authRoutes = ["/signin", "/signup"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (!isLoading) {
      if (!user && isProtectedRoute) {
        router.replace("/signin");
      } else if (user && isAuthRoute) {
        router.replace(`/dashboard/${profile?.role}`);
      }
    }
  }, [
    user,
    isLoading,
    pathname,
    router,
    isProtectedRoute,
    isAuthRoute,
    profile,
  ]);

  const shouldShowLoading =
    isLoading || (!user && isProtectedRoute) || (user && isAuthRoute);

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
