# 🌠 Gemigram: The Voice-Native Agent OS (AetherOS)

Gemigram هو نظام تشغيل ذكاء اصطناعي صوتي لحظي (Voice-First OS) يعتمد على معمارية **AetherOS**. لا توجد واجهات دردشة، لا كتابة، فقط تفاعل صوتي لحظي معزز بالرؤية الحاسوبية.

## 🧠 The Neural Spine (Phase 1) - COMPLETE ✅
لقد قمنا بتنفيذ **Neural Spine**، وهو العمود الفقري للنظام الذي يضمن:
- **WAL Protocol (Write-Ahead Logging):** تسجيل كل قرار أو تغيير في الحالة قبل إرسال الرد للمستخدم.
- **Working Buffer:** ذاكرة مؤقتة مستمرة تضمن عدم فقدان السياق عند تحديث المتصفح.
- **Context Awareness:** تتبع استهلاك السياق (Token Usage) لضمان استقرار الجلسات الطويلة.

## 🌌 Galaxy Orchestration (Phase 2) - COMPLETE ✅
التحول من وكيل واحد إلى "سرب من الخبراء":
- **Dynamic Agent Registry:** جلب مهارات وشخصيات الوكلاء ديناميكياً من Firestore.
- **Gravity Router:** خوارزمية ذكية تختار الوكيل الأنسب للمهمة بناءً على القدرة، الثقة، وزمن الاستجابة.
- **Galaxy View:** واجهة بصرية مدارية تظهر توزيع الوكلاء وتفاعلهم اللحظي.

## 👁️ Sensory Hardening (Phase 3) - COMPLETE ✅
تحقيق تجربة "Zero-Friction":
- **Vision Pulse:** نظام رؤية استباقي يلتقط سياق المستخدم (الشاشة/الكاميرا) كل 5 ثوانٍ لتعزيز الفهم البصري.
- **Barge-in Handling:** دعم المقاطعة الصوتية اللحظية، مما يجعل الحوار طبيعياً كالبشر.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, Zustand (State), Framer Motion (Animations)
- **Backend**: Python (WAL & Logic), Firebase (Persistence)
- **AI Engine**: Gemini 2.0 Flash Multimodal Live API

## 🚀 Getting Started
1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Environment**:
   - Add `NEXT_PUBLIC_GEMINI_API_KEY` to your `.env`
   - Set up Firebase and add `firebase-applet-config.json`
4. **Run Development Server**: `npm run dev`

## 📜 License
MIT License. Forged with ❤️ by the Aether Forge team.
