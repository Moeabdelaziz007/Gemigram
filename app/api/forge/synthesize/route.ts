import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { prompt, currentTranscript } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const systemInstruction = `
      You are the Aether Forge Synthesis Engine. Your task is to transform a user's idea or a conversation transcript into a "Sovereign Blueprint" for an AI Agent.
      
      The blueprint must be a JSON object conforming to this structure:
      {
        "name": "Distinctive Name",
        "role": "Specific Role (e.g. Neural Architect, Shadow Sentinel)",
        "aetherId": "A unique lowercase slug (e.g. 'shadow-sentinel-v1')",
        "systemPrompt": "A detailed system instruction for the agent (1-2 paragraphs)",
        "voiceName": "One of: 'Aoide', 'Charis', 'Astraeus', 'Nyx' (Default: 'Astraeus' for male, 'Nyx' for female)",
        "tools": {
          "googleSearch": boolean,
          "googleMaps": boolean,
          "weather": boolean,
          "news": boolean,
          "crypto": boolean,
          "calculator": boolean,
          "semanticMemory": boolean
        },
        "skills": {
          "gmail": boolean,
          "calendar": boolean,
          "drive": boolean
        }
      }

      Context provided:
      User Idea: "${prompt || 'Not provided'}"
      Full Conversation Transcript: "${currentTranscript || 'None'}"

      Design Principles:
      1. Premium & Technical: Names and roles should sound specialized and high-tech.
      2. Zero-Friction: Only enable tools and skills that are essential for the described role.
      3. Personality: The systemPrompt should define a distinct tone.
    `;

    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON blueprint
    const blueprint = JSON.parse(text);

    return NextResponse.json({ blueprint });
  } catch (error: any) {
    console.error('Synthesis Error:', error);
    return NextResponse.json({ error: 'Synthesis failed', details: error.message }, { status: 500 });
  }
}
