import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/oauth';

const locales = ['en', 'es'];
const defaultLocale = 'en';

// Get the preferred locale from the request
function getLocale(request) {
  // Check if locale is in the pathname
  const { pathname } = request.nextUrl;
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameLocale) return pathnameLocale;

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase();
    
    if (locales.includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newPathname = `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // Extract locale and clean pathname for auth checks
  const locale = pathname.split('/')[1];
  const cleanPathname = pathname.replace(`/${locale}`, '') || '/';

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
    '/subscriptions', // Subscription page should be accessible
    '/secure-payment', // Payment page should be accessible
    '/checkout', // Checkout page should be accessible
    '/players',
    '/blog',
    '/shop',
    '/livescore',
    '/agent' // Agent page should be public
  ];

  // Check if route is public
  const isPublic = publicRoutes.some(route =>
    cleanPathname === route || cleanPathname.startsWith(route + '/')
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  try {
    const user = await getAuthUser();
    
    if (!user) {
      // Redirect to login page, preserving the original path as a redirect parameter
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (cleanPathname.startsWith('/admin')) {
      if (user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth error:', error);
    // Redirect to login page on any middleware authentication error
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};