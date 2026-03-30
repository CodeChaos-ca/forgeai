import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('forgeai_auth_token')?.value;
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Simple strict boundaries for protected routes implicitly flawlessly bound
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Prevent visiting auth pages if already logged securely
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
