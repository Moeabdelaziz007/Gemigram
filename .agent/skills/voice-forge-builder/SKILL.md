---
name: voice-forge-builder
description: Activates when the user asks to build, fix, or extend the voice agent creation flow in /forge, SpeechRecognition logic, TTS feedback, voice confidence scoring, or auto-fill behavior. Never use this skill to add text inputs.
---

# Skill: Voice Forge Builder

## Goal
Maintain the 100% voice-only agent creation flow in `/app/forge/`.

## Instructions
1. Read `app/forge/page.tsx` and `hooks/useVoiceAgentLogic.ts` first
2. All input via Web Speech API (SpeechRecognition) — zero keyboard interaction
3. Confidence thresholds:
   - >90% → auto-fill field immediately ✅
   - 70–90% → show visual warning, allow override ⚠️
   - <70% → re-ask the question via TTS ❌
4. State flow:
   - transcript → SensorySlice
   - micLevel → CognitiveSlice (NOT SensorySlice)
   - voiceSession.stage → set to 'forge' in UiSlice
5. After each field is filled → speak confirmation via SpeechSynthesis
6. Navigation intent → ONLY via Gemini LLM ToolCall — never transcript.includes()

## Questions the Forge asks (in order):
1. "What shall we call this entity?" → Agent.name
2. "What is its core purpose or role?" → Agent.role
3. "How should it behave? Describe its personality." → Agent.systemPrompt
4. "What essence drives it? Analytical, creative, mystical, or warrior?" → Agent.soul
5. "Choose its voice: Zephyr, Kore, Charon, Puck, or Fenrir." → Agent.voiceName
6. "Any final directives or constraints?" → Agent.rules

## Constraints
- NEVER add <input>, <textarea>, or any keyboard input to /forge
- NEVER parse transcript with includes() or regex
- NEVER use `any` type — use Agent interface from createAgentSlice.ts
