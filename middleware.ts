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
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

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
  }

  // Update response cookies
  return res;
}

// Update the matcher to include all protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
