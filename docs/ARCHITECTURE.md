# 🏛️ AetherOS Architecture // معمارية النظام

**Gemigram** (Powered by **AetherOS**) is built upon a decentralized "Zero-Function Architecture" to ensure high-fidelity agent manifestation through pure voice interaction.

---

## 1. Decentralized Route Matrix // المصفوفة اللامركزية

Each sector operates as a standalone consciousness:
يعمل كل قطاع كوعي مستقل:

- **`/dashboard`**: Sovereign Command Center for global infrastructure status. // مركز القيادة السيادية
- **`/workspace`**: Active Neural Link for real-time Voice/Multimodal interaction. // الرابط العصبي النشط
- **`/hub`**: The Entity Registry where manifested agents are cataloged. // سجل الكيانات
- **`/forge`**: **VOICE-ONLY** Synthesis Chamber for crafting new digital souls. // غار التصنيع الصوتي
- **`/galaxy`**: Interactive 3D/Physics representation of the neural network. // التمثيل التفاعلي ثلاثي الأبعاد

---

## 2. Persistent Consciousness (useAetherStore) // الوعي المستمر

Using **Zustand + Firestore**, the system maintains "Perception Continuity":
باستخدام **Zustand + Firestore**، يحافظ النظام على "استمرارية الإدراك":

- Navigation no longer resets agent states
- Global intelligence sync across all routes
- Secure Auth & Real-time Telemetry

---

## 3. Memory System // نظام الذاكرة

Structured memory management utilizing standard Firestore queries without custom indexes.
إدارة ذاكرة منظمة باستخدام استعلامات Firestore القياسية بدون فهرسات مخصصة.

### Memory Types // أنواع الذاكرة
- **Semantic Memory**: Facts, concepts, general knowledge.
- **Episodic Memory**: Conversation history, user interactions.
- **Procedural Memory**: Learned behaviors, skill optimizations.

### Features // الميزات
✅ **No Indexes Required**: Uses standard Firestore queries.
✅ **Automatic Decay**: Importance reduces over time.
✅ **Batch Operations**: Efficient bulk updates.
✅ **Type Safety**: Full TypeScript support.

---

## 4. Google ADK SDK Integration // تكامل Google ADK SDK

### Voice Interaction Stack
- **Gemini 2.0 Omni**: Multi-modal understanding.
- **Google ADK SDK**: Voice conversation handlers.
- **Web Speech API**: Browser-native recognition.
- **useLiveAPI Hook**: Real-time streaming.

**Optimal Architecture:**
```
Voice → Gemini Understanding → Form Fill → Firestore
```