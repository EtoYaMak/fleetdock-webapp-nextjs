import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if exists
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If accessing dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      // Redirect to signin if no session
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      // Get user's role from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role;
      const path = request.nextUrl.pathname;

      // Check if user is accessing the correct dashboard
      if (
        (path.includes("/dashboard/trucker") && role !== "trucker") ||
        (path.includes("/dashboard/broker") && role !== "broker")
      ) {
        // Redirect to appropriate dashboard based on role
        const correctPath =
          role === "trucker" ? "/dashboard/trucker" : "/dashboard/broker";
        return NextResponse.redirect(new URL(correctPath, request.url));
      }
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // If accessing profile routes
  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
      // Get user's role from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const role = profile?.role;

      // Redirect to the correct profile if needed
      if (role !== "trucker" && role !== "broker") {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
