import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth pages and home page
        if (pathname === '/' || pathname.startsWith('/auth/')) {
          return true;
        }
        
        // Require token for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/buyers/:path*', '/api/buyers/:path*']
};