---
name: memory-consolidation
description: Activates at the end of every session, when the user says "remember", "save state", "end session", or after any major architectural change. Ensures the system's knowledge never regresses.
---

# Skill: Memory Consolidation

## Goal
The system must always know where it is. No knowledge loss between sessions.

## Memory Update Template
Append to `.idx/memories.md`:
```markdown
## [YYYY-MM-DD] [Task/Session Name]
### What was done:
- 

### Files modified:
- 

### Slices affected:
- 

### New patterns/skills created:
- 

### Open PRs status:
- #37 (useThalamicGate tests) — open
- #38 (NeuralPulse tests) — open
- #39 (useVisionPulse tests) — open
- #41 (AgentCard tests) — open
- #42 (Remove dev logs) — open
- #40 (empty PR) — review before merge

### Current system state:
- Phase: post-19
- Production: https://notional-armor-456623-e8.web.app
```
