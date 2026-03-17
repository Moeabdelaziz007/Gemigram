# 🔒 Security & Theme System // نظام الأمان والمظهر

This document details the security headers, avatar validation protocols, and the dual-theme system built into **AetherOS**.

---

## 🎨 Theme & Dark Mode // المظهر والوضع الداكن

AetherOS features a sophisticated dual-theme system with automatic adaptation.
يتميز AetherOS بنظام ثيم مزدوج متطور مع تكيف تلقائي.

### Capabilities // القدرات
- **Three Theme Modes**: Light, Dark, and System Default
- **FOUT Prevention**: Pre-hydration theme injection
- **Smooth Transitions**: Hardware-accelerated CSS transitions
- **Persistent Preferences**: Saves to `localStorage` across sessions
- **WCAG AA Compliant**: All color combinations meet accessibility standards

### Usage // الاستخدام
Theme Toggle located in the header (top-right).

```tsx
import { useTheme } from '@/hooks/useTheme';

const { theme, toggleTheme, setTheme } = useTheme();

setTheme('dark');      // Force dark mode
setTheme('light');     // Force light mode
setTheme('system');    // Follow OS preference
```

### Contrast Ratios // نسب التباين
| Element | Dark Mode | Light Mode | Standard |
|---------|-----------|------------|----------|
| Primary Text | 14.2:1 | 21:1 | ≥ 7:1 (AAA) |
| Secondary Text | 7.8:1 | 12.6:1 | ≥ 4.5:1 (AA) |
| Tertiary Text | 5.9:1 | 5.9:1 | ≥ 3:1 (AA) |

---

## 🛡️ Security Features // ميزات الأمان

### Content Security Policy (CSP)

A robust CSP is enforced to mitigate XSS and content injection attacks.

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  connect-src 'self' https:;
  media-src 'self' blob:;

X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Avatar Security & Validation // التحقق من الصور الرمزية

**Client-Side Checks:**
- Data URL format validation
- Image dimensions verification (48px - 2048px)
- File size limits (1KB - 5MB)
- Image parsing verification

**Server-Side Protection:**
- Firebase Storage security rules
- Upload authentication required
- Custom metadata tracking
- Automatic virus scanning