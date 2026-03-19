import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Global Rate Limit Store (In-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 60; // Task mandate
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const now = Date.now();
  const userData = rateLimitMap.get(ip);

  // Reset check
  if (!userData || now > userData.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  // Enforcement
  if (userData.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((userData.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Global API Rate Limit Exceeded', 
        retryAfter,
        system: 'GemigramOS Sentinel' 
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': MAX_REQUESTS.toString(),
        },
      }
    );
  }

  userData.count += 1;
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
