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

    // Redirect superAdmin users to the admin dashboard
    if (nextauth.token.role === "superAdmin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
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
  matcher: ["/dashboard"], // Protect the /dashboard route
};
