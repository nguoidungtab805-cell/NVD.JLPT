// FILE: middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Đọc cookie nvd_auth được set từ AuthContext
  const isAuthenticated = request.cookies.has('nvd_auth');

  // Các route yêu cầu phải đăng nhập (Cả student và admin)
  const protectedRoutes = ['/dashboard', '/vocabulary', '/grammar', '/kanji', '/practice'];
  // Route dành riêng cho Admin
  const adminRoutes = ['/admin'];
  // Các route auth (Không cho phép user đã đăng nhập vào lại)
  const authRoutes = ['/login', '/register', '/forgot-password'];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Nếu chưa đăng nhập mà vào route bảo vệ -> Chuyển về login
  if (!isAuthenticated && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Nếu đã đăng nhập mà cố vào trang login/register -> Chuyển về dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Note: Việc kiểm tra role thực sự (Admin/Student) phải thực hiện ở Layout hoặc Page
  // vì Middleware không thể đọc trực tiếp Firestore.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, vv)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
