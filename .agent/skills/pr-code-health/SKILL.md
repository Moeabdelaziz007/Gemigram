---
name: pr-code-health
description: Activates when the user asks to clean up code, prepare a PR, remove debug logs, fix TypeScript errors, or improve code quality. Run this before any commit to main.
---

# Skill: PR Code Health

## Goal
Production-ready code. Zero noise. Zero debt.

## Pre-Commit Checklist
```
□ Zero console.log / console.warn / console.error
□ Zero explicit `any` type
□ Every useEffect has cleanup return
□ No unused imports
□ npm run lint → passes
□ npm run build → passes
□ npm test → passes
```

## Branch Naming (consistent with repo history)
- `feature/<description>`
- `fix/<description>`
- `test/<description>`
- `code-health/<description>`

## PR Title Format (consistent with PRs #1–#42)
- 🧹 [Code Health] description
- 🧪 [testing improvement] description
- ⚡ [performance] description
- 🔒 [security] description
- feat: description

## Constraints
- Never commit directly to main
- Never merge without passing CI (ci.yml)
- Never change business logic during a code-health PR
