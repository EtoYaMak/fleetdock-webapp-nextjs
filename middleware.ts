import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if it exists
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // Protected routes that require authentication
    const protectedPaths = ["/dashboard", "/profile"];
    const isProtectedPath = protectedPaths.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );

    // Auth routes (signin/signup)
    const authPaths = ["/signin", "/signup"];
    const isAuthPath = authPaths.some((path) =>
      req.nextUrl.pathname.startsWith(path)
    );

    // If accessing protected routes without session
    if (isProtectedPath && !session) {
      const redirectUrl = new URL("/signin", req.url);
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If accessing auth routes with session
    if (isAuthPath && session) {
      // Get user's role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!profile?.role) {
        // Handle missing role
        return NextResponse.redirect(new URL("/signin", req.url));
      }

      // Redirect to role-specific dashboard
      const dashboardPath = profile.role === "trucker" 
        ? "/dashboard/trucker" 
        : "/dashboard/broker";
        
      return NextResponse.redirect(new URL(dashboardPath, req.url));
    }

    return res;

  } catch (error) {
    console.error("Middleware error:", error);
    // On error, redirect to signin
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/signin",
    "/signup"
  ],
};
