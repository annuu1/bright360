// middleware.ts (project root)
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      // Public endpoints:
      if (pathname.startsWith("/api/admin/seedAdmin")) return true;

      // Admin only server routes & pages
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        return token?.role === "admin";
      }

      // Student pages and student APIs
      if (pathname.startsWith("/student") || pathname.startsWith("/api/student")) {
        return token?.role === "student";
      }

      // Otherwise allow (public pages)
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/api/admin/:path*", "/api/student/:path*"],
};
