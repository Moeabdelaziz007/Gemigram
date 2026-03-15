import { GoogleGenAI } from "@google/genai";

async function generateAvatar() {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: "A high-end, futuristic 3D digital avatar for a Sovereign AI OS. The character is a minimalist humanoid silhouette made of flowing cyan and violet light particles and ethereal data threads. It floats in a deep OLED black void. The avatar has no face but a glowing core in the chest that pulses like a heartbeat. Surrounding the avatar are thin, floating iOS-style glass widgets that orbit like satellites. Cinematic lighting, 8k resolution, Unreal Engine 5 render, sophisticated and alive vibe.",
        },
      ],
    },
  });

  for (const part of response.candidates![0].content.parts) {
    if (part.inlineData) {
      console.log(part.inlineData.data);
    }
  }
}

generateAvatar();
