# Gemigram: The Voice-First AI Agent Platform

Gemigram is a Voice-First, Zero-Chatbox AI agent platform. Built on the Gemini Multimodal Live API, Gemigram provides a real-time, immersive experience where users interact with the agent through natural voice conversation.

## 🌌 System Architecture

- **Voice-First Foundation:** The Gemini Multimodal Live API serves as the foundational UI router, handling real-time audio streams and triggering actions via function calling.
- **Zero-Chatbox UI:** An immersive interface where the agent's actions are rendered via real-time UI widgets, eliminating traditional text chat.
- **Action Bridge:** Firebase Cloud Functions bridge the agent's actions to workspace tools (Gmail, Calendar, Tasks).
- **Real-time Nervous System:** A WebSocket-based connection manages bidirectional audio and function call interception.
- **Aether Forge (Agent Creation):** A voice-driven interface for synthesizing new AI agents. Users converse with the "Aether Forge Architect" to define the agent's persona, soul, rules, and skills. The Architect dynamically updates the agent's DNA package (`.ath`) in real-time.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Auth, Cloud Functions)
- **AI Engine**: Google Gemini Multimodal Live API
- **Voice**: Web Audio API (PCM 16kHz)

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment**:
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` to your `.env`
   - Set up Firebase and add `firebase-applet-config.json`
4. **Run Development Server**: `npm run dev`

## 🧬 .ath DNA Structure

The `.ath` package is the core of every agent:
- **Soul**: The personality and emotional essence.
- **Rules**: Strict operational constraints.
- **Memory**: Contextual awareness of past events.
- **Skills**: Functional capabilities (Search, Workspace, etc.)

## 📜 License

MIT License. Forged with ❤️ by the Aether Forge team.
