---
name: zustand-slice-engineer
description: Activates when the user asks to add state, modify a Zustand slice, fix state bugs, add new fields, resolve TypeScript store errors, or when a component needs to read/write global state. Always verify the correct slice before touching any field.
---

# Skill: Zustand Slice Engineer

## Goal
Maintain the verified 5-slice Zustand architecture in `lib/store/`.

## Verified Slice Map (IMMUTABLE)

| Field | Correct Slice |
|-------|--------------|
| transcript, streamingBuffer, isInterrupted, isThinking, isSpeaking, volume, contextUsage, unreadNotifications | SensorySlice |
| sessionState, sessionMetadata, consecutiveErrors, micLevel, speakerLevel, latencyMs, isVisionActive, tokensUsed, tokenBudget | CognitiveSlice |
| activeProjectId, userProjects, agents, activeAgentId | AgentSlice |
| linkType, voiceProfile, voiceSession (stage: 'landing'|'forge'|'workspace'), pendingManifest, lastSyncedAt | UiSlice |
| hydratedUserId ONLY | AuthSlice |

## Instructions
1. Read the target slice file before any edit
2. Add field to: interface + initial state + action method
3. Run `npm run build` after to verify no circular dependencies
4. Test selector performance — use granular selectors not full store

## Common Errors
- micLevel in SensorySlice → move to CognitiveSlice
- unreadNotifications in AuthSlice → move to SensorySlice
- user/googleToken in AuthSlice → they live in Firebase Auth Context only
- navVisible in UiSlice → field does not exist, do not add

## Constraints
- Zero `any` types
- Never create a 6th slice without explicit user approval
- Never move existing verified fields between slices
