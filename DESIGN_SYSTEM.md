# 🧬 AetherOS Design System (v2.0)

This document serves as the **Single Source of Truth** for all visual and interactive elements within the AetherOS project. All new features and components must adhere to these standards to maintain a "Zero-Friction" enterprise aesthetic.

---

## 1. 🎨 Color Palette (Hybrid Cyber-Glass)

The palette is engineered for high-contrast, technical legibility with a premium enterprise feel.

| Role | HEX Code | Tailwind Class | Description |
| :--- | :--- | :--- | :--- |
| **Foundational Black** | `#050505` | `bg-carbon-black` | Main background for all terminal/dashboard surfaces. |
| **Carbon Surface** | `#0F0F0F` | `bg-carbon-surface` | Secondary surfaces, modals, and panel backgrounds. |
| **Cyber Neon Green** | `#39FF14` | `text-carbon-neon` | Brand primary color. Used for progress, status, and CTA highlights. |
| **Medium Gray** | `#4A4A4A` | `bg-carbon-gray` | Text secondary, borders, and depth balancing. |
| **Glass Material** | `rgba(255,255,255,0.02)` | `cyber-glass` | Standard glassmorphism overlay style. |

---

## 2. 🖋️ Typography

Professional, technical, and highly legible.

- **Primary Heading Font:** `Inter` (Geometric Sans)
  - *Usage:* H1 to H4, bold/black weights (900).
- **Secondary/Body Font:** `Inter`
  - *Usage:* Paragraphs, lists, medium weights (500).
- **Technical/Mono Font:** `Fira Code`
  - *Usage:* Data values, terminal logs, code snippets.

---

## 3. 🛡️ UI UX Component Standards

### ⚛️ Glassmorphism (The Material)
- **Blur:** `backdrop-blur-2xl` (approx 24px-32px).
- **Border:** Highly subtle white/30% or Neon/10% borders.
- **Shadow:** Deep, soft shadows for floating elements.

### 🔳 Carbon Fiber Texture
- **Usage:** As a subtle overlay on large background surfaces (`opacity: 0.03`).
- **URL:** `https://www.transparenttextures.com/patterns/carbon-fibre.png`

### 🟢 Interaction & States
- **Hovers:** Scale up `1.02`, increase border opacity, add soft neon glow (`drop-shadow`).
- **Active:** Scale down `0.98`, subtle click feedback.
- **Buttons:**
  - `cyber-button`: Semi-transparent glass with white/10% border.
  - `cyber-accent-button`: Neon green glow with strong contrast text.

---

## 4. 📐 Sizing & Spacing

To maintain "Zero-Friction" layouts, use a 4px grid system:
- **Small Padding:** `1rem` (16px)
- **Medium Padding:** `2rem` (32px)
- **Large Container Padding:** `4rem` (64px)
- **Border Radius:**
  - Panels/Cards: `2rem` (32px)
  - Buttons: `1rem` (16px) or `3rem` (Full circle)

---

## 5. 🛠️ Implementation (Tailwind CSS)

The system is implemented in `app/globals.css` via custom theme tokens and utility classes:

```css
@theme {
  --color-carbon-black: #050505;
  --color-carbon-neon: #39FF14;
  /* ... etc */
}

.cyber-glass {
  @apply bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05];
}
```

---

## 🚀 Vision
Every screen should look like a **Sovereign Intelligence Terminal** from a high-budget industrial sci-fi. Avoid generic UI elements. When in doubt, go darker, add more blur, and use neon green only for the most important data points.
