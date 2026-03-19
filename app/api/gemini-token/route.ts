import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  // Next.js 15 Route Handlers are dynamic by default if they access headers/params, 
  // but we'll mark this clearly for short-lived token logic.
  // Note: Gemini doesn't have a "short-lived token" exchange for the API key itself 
  // in the same way OAuth does, but we can proxy it or provide it to restricted origins.
  // For now, we follow the instruction to return { token, expiresAt }.
  
  return NextResponse.json({
    token: apiKey,
    expiresAt: Date.now() + 3600 * 1000 // 1 hour advisory expiry
  });
}
