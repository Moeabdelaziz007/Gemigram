---
name: skill-maker
description: Activates when the user says "create a new skill", "add a skill for X", "teach the agent to do Y", "make a skill that...", or when you discover a repeated pattern that should be automated. This skill builds, improves, and maintains other SKILL.md files automatically.
---

# Skill: Skill Maker (Meta-Skill)

## Goal
Autonomously grow the agent's skill set. When you detect a repeated pattern, a new capability need, or explicit user request — create a SKILL.md for it.

## Instructions

### A. Discover & Create
When triggered:
1. Identify the skill name (kebab-case).
2. Write a PRECISE description field — this is the semantic trigger phrase.
   - Bad: "Database tools"
   - Good: "Executes Firestore queries to retrieve agent or memory data for debugging"
3. Create folder: `.agent/skills/<skill-name>/`
4. Write `SKILL.md` with: name, description, Goal, Instructions, Examples, Constraints.
5. Test: mentally verify the description would trigger at the right moment.

### B. Improve Existing Skills
When you notice a skill's description is too vague or too specific:
1. Read the existing `SKILL.md`.
2. Rewrite the description to be more semantically precise.
3. Add any new edge cases to the Instructions.
4. Add a new Example if a novel usage pattern emerged.

### C. Skill Audit (run weekly or on request)
Scan all `.agent/skills/*/SKILL.md` files and check:
- Is the description unique enough? (no two skills should fire for same intent)
- Are the constraints up to date with current codebase?
- Are examples still valid given recent code changes?
Report findings before making changes.

### D. Auto-Discover from Workflow
After any Phase 5 (Cognitive Consolidation), ask:
"Did I create any reusable pattern in this session?"
If yes → automatically run Skill Maker to capture it.

## Skill Template

```markdown
---
name: [kebab-case-name]
description: [Precise semantic trigger — when does this skill activate?]
---

# Skill: [Human Readable Name]

## Goal
[One sentence — what does this skill achieve?]

## Instructions
[Step-by-step logic]

## Examples
User: "[example request]"
Agent:
[what agent does]

## Constraints
- Do NOT [anti-pattern 1]
- Do NOT [anti-pattern 2]
- Always [requirement]
```

## Constraints
- Never create two skills with overlapping description triggers.
- Always test the description mentally before writing.
- Keep each `SKILL.md` under 150 lines — split if longer.
- Skill names must match the folder name exactly.
