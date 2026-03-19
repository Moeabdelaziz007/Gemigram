---
name: performance-optimizer
description: Activates when the user asks to improve speed, reduce bundle size, fix slow renders, optimize Firestore reads, reduce latency, or when build output shows large chunks. Also activates after any feature implementation to enforce the Optimization Drive.
---

# Skill: Performance Optimizer

## Goal
Every feature must be fast. Working code is not enough — make it elegant.

## Checklist
1. **Algorithm**: O(N²) → O(N) where possible
2. **Firestore**: batch reads with `Promise.all()`, batch writes with `writeBatch()`
3. **React**: granular Zustand selectors — never `useGemigramStore(state => state)` (full store)
4. **Bundle**: check for unused imports, apply dynamic imports for heavy components
5. **Galaxy scene**: lazy-load (`dynamic(() => import(...), { ssr: false })`)
6. **HeroBackground**: particle count ≤ 40% of original (already optimized — verify on changes)
7. **AudioWorklet**: verify processor name is exactly `'neural-spine-processor'` — wrong name = silent crash
8. **Framer Motion**: use `layout` prop sparingly — expensive on mobile

## Targets
- Lighthouse: 95+ Performance
- Bundle: tree-shaking verified
- Load time: <2s on 3G
- Voice confidence response: <100ms

## Constraints
- Never sacrifice type safety for performance
- Never remove cleanup functions to "simplify" code
