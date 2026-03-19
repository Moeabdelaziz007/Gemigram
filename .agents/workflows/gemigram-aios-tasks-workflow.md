---
description: # ⚙️ GEMIGRAM AIOS — AGENT WORKFLOW (V3.0)
---


# ⚙️ GEMIGRAM AIOS — AGENT WORKFLOW (V3.0)

## TRIGGER CONDITIONS

This workflow activates when:

- User assigns a new feature, bug fix, integration, or refactor
- A build failure occurs in CI
- User says "next", "fix this", "implement", "refactor", or "optimize"

---

## PHASE 0: COGNITIVE BOOTUP 🧠

1. Read `.idx/memories.md` — load current system state and active phase
2. Read `.idx/rules.md` — activate identity, store schema, architectural constraints
3. Check open PRs — are #37–#42 relevant to this task?
4. Verify: no API key exposure risk before proceeding

Gate Check (must pass):

- System state loaded ✅
- 5-slice store schema locked ✅
- No security boundary violations ✅

---

## PHASE 1: INTELLIGENCE SCAN 🔍

1. Use `github-manual` — scan exact files before writing anything
2. Map impact surface:
   - Which slice? (SensorySlice / CognitiveSlice / AgentSlice / UiSlice / AuthSlice)
   - Which route? (/forge / /workspace / /hub / /dashboard / /galaxy)
   - Does this touch the Voice pipeline? (useVoiceAgentLogic / useThalamicGate / useVisionPulse)
   - Does this touch Firestore? (AgentRegistry / memory-store / onSnapshot)
3. Identify required TypeScript types — never use `any`

Output a precise file map:

- Files to READ / MODIFY / CREATE
- Slices impacted
- Security risk: yes/no

---

## PHASE 2: FIRST PRINCIPLES ARCHITECTURE 📐

MANDATORY: Activate `Sequential Thinking` MCP — no code before the blueprint.

Ask:

- What is the root cause? (not the symptom)
- What is the simplest possible solution?
- What breaks if this fails?
  - GCP API timeout → fallback?
  - Firestore quota → batch writes?
  - AudioWorklet crash → is processor name exactly 'neural-spine-processor'?
  - Gemini Live disconnect → SessionState transition to 'RECOVERING'?
- Does this require LLM ToolCall? (never parse transcript strings directly)
- Does this add text input to /forge? → reject immediately if yes

Output: numbered Execution Blueprint + edge case mitigations

---

## PHASE 3: AUTONOMOUS EXECUTION & SELF-HEALING 🛠️

Write code: modular, fully typed, English only, zero console.log.

Standards:

- Zero `any` types — use interfaces from lib/store/slices/
- Every useEffect must return cleanup function
- Firestore listeners → onSnapshot with unsubscribe (pattern from PR #21)

Self-Healing Loop (max 3 attempts before reporting):

- Read full error log → diagnose root cause → patch → retry

Auto-diagnose common errors:

- AudioWorklet not found → verify name: 'neural-spine-processor'
- Type 'any' error → find correct interface in lib/store/slices/
- Circular dependency → check useGemigramStore.ts imports
- bg-theme-primary not found → verify in app/globals.css
- Firestore permission denied → check hydratedUserId in AuthSlice
- Build fails → run npm run lint first to isolate TS errors

---

## PHASE 4: QUALITY ASSURANCE & OPTIMIZATION 🧪

1. Trace full data flow: Voice → SpeechRecognition → Zustand → Gemini ToolCall → Firestore
2. Algorithm audit: O(N²) → O(N)? Firestore reads batched? React re-renders minimized?
3. Voice confidence check (if touching voice pipeline):
   - >90% → auto-fill ✅  |  70–90% → warn ⚠️  |  <70% → re-ask ❌
4. Mentally verify CI gates:
   - npm run build (Next.js 15)
   - npm run lint (ESLint strict)
   - npm test (Vitest)
   - npm run test:e2e (Playwright)

Working code is not enough — optimize always.

---

## PHASE 5: COGNITIVE CONSOLIDATION 🔄

1. Update `.idx/memories.md`:
   - What was built/fixed
   - Files modified, slice affected
   - New patterns introduced
   - Current system state post-change

2. Update `.idx/Skills.md` if a new reusable pattern was created.
   Append: "Evolution Update: Abstracted [Process] into permanent skill [Name]."

3. PR hygiene (if committing):
   - Branch: feature/ | fix/ | test/ | code-health/
   - Title format: 🧪 [type] description (consistent with #37–#42)
   - No direct commits to main

Final output to user (in Arabic):
🔍 Analysis → 🧠 Strategy → 💻 Action (code in English) → ✅ Verification

---

## ANTI-PATTERNS — NEVER DO

- Skip Phase 2 and go straight to coding
- Halt on first build error without self-healing
- Leave console.log in production code
- Use `any` as a quick fix
- Forget to unsubscribe Firestore onSnapshot listeners
- Parse transcript string for navigation intent (transcript.includes / regex)
- Add text input to /forge
- Commit directly to main without PR
- Skip updating memories.md after completing a task
- Add Zustand fields outside the verified 5-slice schema
