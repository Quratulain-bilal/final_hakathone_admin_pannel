import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isAdminRoute = url.pathname === "/admin"; // Check if the route is exactly '/admin'
  const isAdminChildRoute =
    url.pathname.startsWith("/admin/") && url.pathname !== "/admin"; // Check if the route is a child of '/admin'
  const referer = request.headers.get("referer"); // Get the referer header
  const login = new URL("/", request.url); // Home page URL
  const adminUrl = new URL("/admin", request.url); // Admin page URL

  // Condition 1: Redirect to home if '/admin' is accessed directly without a valid referer
  if (isAdminRoute) {
    if (!referer || !referer.includes(url.origin)) {
      return NextResponse.redirect(login);
    }
  }

  // Condition 2: Redirect to '/admin' if a child route under '/admin' is accessed directly
  if (isAdminChildRoute) {
    if (!referer || !referer.includes(url.origin + "/admin")) {
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next(); // Allow access if all checks pass
}

export const config = {
  matcher: ["/admin", "/admin/:path*"], // Apply middleware to /admin and all child routes
};
