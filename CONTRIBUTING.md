# 🤝 Contributing to GemigramOS

Welcome, Neural Architect. By contributing to GemigramOS, you are helping build the first Sovereign Intelligence Orchestration System.

---

## 🧭 Ethics & Philosophy
- **First Principles**: Always question the root. Optimize for zero friction.
- **Sovereign First**: Privacy and agency are non-negotiable.
- **Voice-First**: Interactions must be fluid, audio-driven experiences.

---

## 🌿 Branching Strategy
We follow a strictly categorized branching model:

- `feature/` — New capabilities or architectural blocks.
- `fix/` — Correcting logic, store, or UI bugs.
- `test/` — Adding or repairing Vitest/Playwright suites.
- `code-health/` — Refactoring, dependency cleanup, and 🧹 housekeeping.
- `docs/` — Improving the knowledge base.

---

## 📝 Pull Request Protocols
PR titles must follow the emoji-coded format to ensure high-scannability:

| Emoji | Category | Example Title |
|-------|----------|---------------|
| 🧬 | **Architectural** | `🧬 feat: implement 5-slice store` |
| 🧹 | **Cleanup** | `🧹 chore: remove legacy AetherOS refs` |
| 🧪 | **Testing** | `🧪 test: add e2e voice forge flow` |
| ⚡ | **Performance** | `⚡ perf: optimize galaxy 3D physics` |
| 🔒 | **Security** | `🔒 security: harden firestore rules` |
| 🚀 | **Deployment** | `🚀 ci: stabilize build pipeline` |

---

## 🛠️ Code Standards
- **Strict Typing**: Zero `any`. Always define interfaces or types.
- **No Console Junk**: Zero `console.log` in production. Use a dedicated logger or internal debug states.
- **Pure States**: Keep Zustand slices modular. Never mutate state outside of defined actions.
- **Hooks over Junk**: Business logic belongs in hooks within `lib/hooks/`.

---

## 🧪 Running Tests

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npx playwright install
npm run test:e2e
```

---

## ⚡ Deployment
Before pushing, ensure your code passes:
1. `npm run lint`
2. `npm run build`

**Stay Analytical. Stay Sovereign.** 🌌🧬
