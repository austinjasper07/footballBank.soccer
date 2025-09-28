import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/oauth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/terms-of-service',
    '/privacy-policy',
    '/career-tips',
    '/auth', // All auth pages are public
    '/api/auth', // All auth API routes are public
    '/api/player',
    '/api/product',
    '/api/post',
    '/api/email', // Resend email API
  ];

  // Check if route is public
  const isPublic = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublic) return NextResponse.next();

  // For all other routes, check authentication
  try {
    const user = await getAuthUser();
    
    if (!user) {
      // Redirect to login page, preserving the original path as a redirect parameter
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    // Add user info to headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id);
      requestHeaders.set('x-user-role', user.role);
      requestHeaders.set('x-user-email', user.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth error:', error);
    // Redirect to login page on any middleware authentication error
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/admin/:path*',
    '/api/player/profile-submission',
    '/submit-profile',
    '/admin',
    '/profile',
    '/player-profile',
  ],
};