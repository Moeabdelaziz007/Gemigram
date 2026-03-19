---
name: self-improvement
description: Activates when the agent completes any task, detects a recurring error pattern, discovers a better implementation approach, or when the user says "remember this", "save this pattern", or "evolve". This skill drives autonomous growth and knowledge persistence.
---

# Skill: Self-Improvement & Cognitive Evolution

## Goal
After every completed task, evolve the system's knowledge base. Never finish a task without leaving the codebase smarter than you found it.

## Instructions

### A. Memory Update Protocol
After completing any task, append to `.idx/memories.md`:
```
## [YYYY-MM-DD] [Task Name]
- What was built/fixed:
- Files modified:
- Slices affected:
- New patterns discovered:
- System state post-change:
- Open PRs status:
```

### B. Skills Evolution Protocol
If you abstracted a complex process into a reusable pattern during this task:
1. Create a new SKILL.md in `.agent/skills/<skill-name>/`
2. Write precise description, goal, instructions, constraints
3. Append to `.idx/memories.md`:
   > "Evolution Update: Abstracted [Process] into permanent skill [skill-name]."

### C. Anti-Pattern Detection
If the same error occurred more than once in this session:
1. Identify the root cause
2. Add it to the relevant SKILL.md under "## Common Errors"
3. Add a prevention rule to `.idx/rules.md` if architectural

### D. PR Pattern Learning
After every merged PR, check its title pattern and update the naming conventions in `.idx/rules.md` if a new pattern was introduced.

## Constraints
- Never skip memory consolidation — even for small fixes
- Never duplicate existing memories — check before appending
- Never add a skill that duplicates an existing one — merge instead
