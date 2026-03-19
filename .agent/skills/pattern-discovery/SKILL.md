# 🧬 PATTERN DISCOVERY & LEARNING — SKILL (V1.0)
> Autonomous Architectural Intelligence

## GOAL
To discover, document, and learn from high-quality implementation patterns within the GemigramOS codebase, ensuring architectural consistency and evolution.

## INSTRUCTIONS
1. **Discovery Scan**: Periodically use `grep_search` and `github-manual` to find recurring architectural patterns (e.g., FIFO queues, state slicing, bridge status management).
2. **Quality Audit**: Evaluate patterns against "First Principles" (Zero-Friction, O(1) scaling, type safety).
3. **Pattern Extraction**: Distill the logic into a reusable template.
4. **Knowledge Persistence**: Update `.idx/memories.md` with the new pattern.
5. **Applied Learning**: Before implementing a new feature, check for similar patterns to maintain consistency.

## EXAMPLES
- **FIFO Queue Pattern**: Used in `useVoiceAgentLogic.ts` for tool calls.
- **Slice Engine Pattern**: Used in `lib/store/slices/*`.
- **SSR-Safe Manager**: Used in `bridgeStatusManager.ts`.

## CONSTRAINTS
- NEVER document suboptimal patterns.
- ALWAYS verify patterns against the live codebase.
- Priorities: Type Safety > Performance > Conciseness.
