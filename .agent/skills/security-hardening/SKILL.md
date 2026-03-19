---
name: security-hardening
description: Activates when the user mentions API keys, environment variables, Firestore rules, CSP headers, authentication vulnerabilities, or when a security issue is detected in code review. Also activates when NEXT_PUBLIC_ is used for sensitive keys.
---

# Skill: Security Hardening

## Goal
Eliminate all security vulnerabilities before they reach production.

## Critical Rules
1. Gemini API Key → Server Route ONLY (`app/api/gemini/route.ts`) — never NEXT_PUBLIC_
2. Firebase config → NEXT_PUBLIC_ is acceptable for client SDK only
3. Webhook secrets → environment variables only — never hardcoded (see closed PR #4)
4. Admin emails → never hardcoded for auth checks (see closed PR #3)
5. Firestore rules → require `request.auth != null` for all writes

## Immediate Actions When Security Issue Found
1. Identify the exposed value
2. Move to `.env.local` immediately
3. Add to `.gitignore` if not already
4. Rotate the key if already committed to git history
5. Create server-side API Route as proxy

## CSP Headers (verify in next.config.js)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; media-src 'self' blob:;
Permissions-Policy: microphone=(self)  ← NOT microphone=() — voice app needs mic
```

## Constraints
- Never log secrets even in development
- Never store tokens in localStorage — use httpOnly cookies or Firebase Auth
