import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { redirect } from 'next/navigation';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/api/player',
    '/api/product',
    '/api/post',
    '/api/auth',
  ];

  const protectedRoutes = [
    '/api/player/profile-submission',
    // '/submit-profile',
  ];

  const adminRoutePrefixes = [
    '/api/admin',
  ];

  const isPublic = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublic) return NextResponse.next();

  const { getUser, getRoles, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  if (!user || !(await isAuthenticated())) {
     return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }

  const isProtected = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtected) return NextResponse.next();

  const isAdminRoute = adminRoutePrefixes.some(prefix =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isAdminRoute) {
    const canAccess = await getRoles();
    if (!canAccess) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/api/admin/:path*',
    '/api/player/profile-submission',
    // '/submit-profile',
    '/admin'
  ],
};
