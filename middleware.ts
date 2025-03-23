import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { nextauth } = req as any;

    // Ensure the session is available
    if (!nextauth.token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const userRole = nextauth.token.role;
    const requestPath = req.nextUrl.pathname;

    if (
      requestPath.startsWith("/api/admin/users") &&
      requestPath.startsWith("/api/admin/dashboard") &&
      userRole !== "admin"
    ) {
      return new NextResponse("Forbidden: Admin access only", { status: 403 });
    }
    // Redirect superAdmin users to the admin dashboard
    if (userRole === "admin" && requestPath === "/dashboard") {
      return NextResponse.redirect(new URL("/super-admin/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Ensures only authenticated users pass
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/holidays/:path*",
    "/leaves/:path*",
    "/super-admin/:path*",
    "/api/admin/:path*",
    "/api/fetchholidays/:path*",
    "/api/holidays/:path*",
    "/api/kpi/:path*",
    "/api/long-weekends/:path*",
    "/api/longweekends/:path*",
    "/api/user/:path*",
  ], // Protect the /dashboard route
};
