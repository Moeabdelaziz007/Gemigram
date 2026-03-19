import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// FIX 5: Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 30;
const WINDOW_MS = 60 * 1000; // 1 minute

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const userData = rateLimitMap.get(ip);

  if (!userData || now > userData.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return NextResponse.next();
  }

  if (userData.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((userData.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests', retryAfter }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
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
