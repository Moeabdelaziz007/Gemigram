import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemInstruction = `
      You are the Neural Forge Architect for AetherOS.
      Your task is to take a user's description of an AI agent and synthesize a complete JSON blueprint.
      
      The blueprint must include:
      - suggestedName: A unique, sci-fi sounding name.
      - suggestedRole: The specific role of the agent.
      - persona: One of [Analytical, Creative, Protective, Ruthless, Sage, Explorer].
      - tools: An object with boolean flags (e.g., { webSearch: true, memoryStore: true, gwsSync: true }).
      - skills: An object with boolean flags (e.g., { analysis: true, generation: true, coding: true }).
      - systemPrompt: A detailed, first-person system instructions for this agent.
      - rules: A list of 3-5 core directives for the agent.
      
      Respond ONLY with the JSON object.
    `;

    const result = await model.generateContent([systemInstruction, prompt]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from potential markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    
    return NextResponse.json(JSON.parse(jsonString));
  } catch (error: any) {
    console.error('Synthesis Error:', error);
    return NextResponse.json({ error: 'Failed to synthesize agent' }, { status: 500 });
  }
}
