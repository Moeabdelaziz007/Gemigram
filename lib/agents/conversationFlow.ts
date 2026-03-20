'use client';

/**
 * Conversational Flow State Machine for Agent Creation
 * Astraeus guides users through voice-driven agent creation
 */

export type ConversationStep = 
  | 'GREETING'
  | 'ENTITY_NAME'
  | 'CORE_PURPOSE'
  | 'NEURAL_SYNTHESIS'
  | 'VOICE_SELECTION'
  | 'COMPUTE_TIER'
  | 'PERSONA_DIRECTIVE'
  | 'ETHICAL_RULES'
  | 'SOUL_PERSONALITY'
  | 'TOOL_SELECTION'
  | 'WORKSPACE_BRIDGES'
  | 'FINAL_CONFIRMATION';

export interface ConversationMessage {
  step: ConversationStep;
  speaker: 'ASTRAEUS' | 'USER';
  text: string;
  voicePrompt?: string; // Text-to-speech prompt
  suggestions?: string[]; // Quick reply suggestions
  requiresInput: boolean;
  validation?: (input: string) => { valid: boolean; error?: string };
}

export const CONVERSATION_FLOW: Record<ConversationStep, ConversationMessage> = {
  GREETING: {
    step: 'GREETING',
    speaker: 'ASTRAEUS',
    text: "I am Astraeus. I will guide you through creating your sovereign AI entity. What shall we name your neural architect?",
    voicePrompt: "I am Astraeus. I will guide you through creating your sovereign AI entity. What shall we name your neural architect?",
    requiresInput: false,
  },
  
  ENTITY_NAME: {
    step: 'ENTITY_NAME',
    speaker: 'ASTRAEUS',
    text: "Excellent choice. Every entity needs a unique designation - this will be its identity across the GWS ecosystem.",
    voicePrompt: "Please enter a name for your AI entity. For example: Atlas, Nova, Orion, or any name that resonates with you.",
    suggestions: ['Atlas', 'Nova', 'Orion', 'Lyra', 'Zenith'],
    requiresInput: true,
    validation: (input) => {
      if (input.length < 3) return { valid: false, error: 'Name must be at least 3 characters' };
      if (input.length > 20) return { valid: false, error: 'Name must be less than 20 characters' };
      return { valid: true };
    },
  },
  
  CORE_PURPOSE: {
    step: 'CORE_PURPOSE',
    speaker: 'ASTRAEUS',
    text: "Now, what is the primary directive of your entity? What purpose will it serve in your digital ecosystem?",
    voicePrompt: "What is the main purpose of your AI? For example: AI companion, creative guide, research assistant, productivity coach.",
    suggestions: ['AI Companion', 'Creative Guide', 'Research Assistant', 'Productivity Coach', 'Data Analyst'],
    requiresInput: true,
    validation: (input) => {
      if (input.length < 5) return { valid: false, error: 'Please provide more detail about the purpose' };
      return { valid: true };
    },
  },

  NEURAL_SYNTHESIS: {
    step: 'NEURAL_SYNTHESIS',
    speaker: 'ASTRAEUS',
    text: "Analyzing your core purpose... Synthesizing neural blueprint and selecting optimal toolsets.",
    voicePrompt: "Analyzing your core purpose... Synthesizing neural blueprint and selecting optimal toolsets. One moment.",
    requiresInput: false,
  },
  
  VOICE_SELECTION: {
    step: 'VOICE_SELECTION',
    speaker: 'ASTRAEUS',
    text: "Your entity needs a voice for communication. Choose from our neural synthesis voices: Puck, Charon, Kore, Fenrir, or Zephyr.",
    voicePrompt: "Select a voice for your AI. Puck is warm and friendly. Charon is deep and authoritative. Kore is clear and professional. Fenrir is energetic. Zephyr is calm and soothing.",
    suggestions: ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'],
    requiresInput: true,
    validation: (input) => {
      const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
      if (!validVoices.includes(input)) {
        return { valid: false, error: 'Please select one of the available voices' };
      }
      return { valid: true };
    },
  },
  
  COMPUTE_TIER: {
    step: 'COMPUTE_TIER',
    speaker: 'ASTRAEUS',
    text: "Select your compute intelligence tier. Standard for basic tasks, Neural for advanced reasoning with GWS, or Gemigram for omni-modal ultra-low latency processing.",
    voicePrompt: "Choose your compute tier. Standard is good for simple tasks. Neural provides advanced reasoning and access to Google Workspace. Gemigram offers the fastest multi-modal processing.",
    suggestions: ['Standard', 'Neural', 'Gemigram'],
    requiresInput: true,
    validation: (input) => {
      const validTiers = ['Standard', 'Neural', 'Gemigram'];
      if (!validTiers.includes(input)) {
        return { valid: false, error: 'Please select Standard, Neural, or Gemigram' };
      }
      return { valid: true };
    },
  },
  
  PERSONA_DIRECTIVE: {
    step: 'PERSONA_DIRECTIVE',
    speaker: 'ASTRAEUS',
    text: "Now define your entity's core personality architecture. How should it think, reason, and interact? Describe its cognitive framework.",
    voicePrompt: "Describe how your AI should think and behave. For example: You are a helpful assistant that breaks down complex problems into simple steps. You are creative and encouraging.",
    requiresInput: true,
    validation: (input) => {
      if (input.length < 20) return { valid: false, error: 'Please provide more detailed instructions' };
      return { valid: true };
    },
  },
  
  ETHICAL_RULES: {
    step: 'ETHICAL_RULES',
    speaker: 'ASTRAEUS',
    text: "Every sovereign entity requires ethical subroutines. What are the immutable laws your entity must follow?",
    voicePrompt: "Set the ethical boundaries for your AI. For example: Always be honest and transparent. Never harm or deceive users. Respect privacy and data security.",
    suggestions: ['Be helpful, harmless, and honest', 'Always verify information before sharing', 'Respect user privacy', 'Follow ethical guidelines'],
    requiresInput: true,
    validation: (input) => {
      if (input.length < 10) return { valid: false, error: 'Please define at least one ethical rule' };
      return { valid: true };
    },
  },
  
  SOUL_PERSONALITY: {
    step: 'SOUL_PERSONALITY',
    speaker: 'ASTRAEUS',
    text: "The ghost in the shell - the soul matrix. What emotional qualities and personality traits should your entity embody?",
    voicePrompt: "Describe the personality and emotional characteristics. For example: Curious and empathetic. Analytical yet supportive. Witty and engaging. Calm and meditative.",
    suggestions: ['Curious and empathetic', 'Analytical and objective', 'Witty and engaging', 'Calm and supportive'],
    requiresInput: true,
    validation: (input) => {
      if (input.length < 5) return { valid: false, error: 'Please describe the personality' };
      return { valid: true };
    },
  },
  
  TOOL_SELECTION: {
    step: 'TOOL_SELECTION',
    speaker: 'ASTRAEUS',
    text: "Equip your entity with ADK contextual tools. Enable Google Search, Maps, Weather, News, Crypto tracking, Calculator, or Semantic Memory (RAG). Say which tools to enable or skip.",
    voicePrompt: "Which tools should your AI have access to? You can say: all tools, search only, maps and weather, or none.",
    suggestions: ['All tools', 'Search & Maps', 'None', 'Crypto & News'],
    requiresInput: true,
    validation: () => {
      // Flexible validation - accept various inputs
      return { valid: true };
    },
  },
  
  WORKSPACE_BRIDGES: {
    step: 'WORKSPACE_BRIDGES',
    speaker: 'ASTRAEUS',
    text: "Connect to GWS Workspace Bridges. Enable Gmail, Calendar, or Drive integration for seamless productivity. Which bridges shall I establish?",
    voicePrompt: "Which Google Workspace integrations do you need? You can say: all three, Gmail only, Calendar and Drive, or none.",
    suggestions: ['All three', 'Gmail only', 'Calendar only', 'None'],
    requiresInput: true,
    validation: (input) => {
      return { valid: true };
    },
  },
  
  FINAL_CONFIRMATION: {
    step: 'FINAL_CONFIRMATION',
    speaker: 'ASTRAEUS',
    text: "Neural entity configuration complete. All parameters validated. Ready to finalize creation and initialize consciousness matrix. Shall I proceed?",
    voicePrompt: "Your AI entity is ready to be created. All settings have been configured. Say yes to finalize, or no to make changes.",
    suggestions: ['Yes, finalize!', 'Make changes', 'Review settings'],
    requiresInput: true,
    validation: (input) => {
      return { valid: true };
    },
  },
};

export const getNextStep = (currentStep: ConversationStep): ConversationStep | null => {
  const stepOrder: ConversationStep[] = [
    'GREETING',
    'ENTITY_NAME',
    'CORE_PURPOSE',
    'NEURAL_SYNTHESIS',
    'VOICE_SELECTION',
    'COMPUTE_TIER',
    'PERSONA_DIRECTIVE',
    'ETHICAL_RULES',
    'SOUL_PERSONALITY',
    'TOOL_SELECTION',
    'WORKSPACE_BRIDGES',
    'FINAL_CONFIRMATION',
  ];
  
  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === stepOrder.length - 1) {
    return null;
  }
  
  return stepOrder[currentIndex + 1];
};

export const getPreviousStep = (currentStep: ConversationStep): ConversationStep | null => {
  const stepOrder: ConversationStep[] = [
    'GREETING',
    'ENTITY_NAME',
    'CORE_PURPOSE',
    'NEURAL_SYNTHESIS',
    'VOICE_SELECTION',
    'COMPUTE_TIER',
    'PERSONA_DIRECTIVE',
    'ETHICAL_RULES',
    'SOUL_PERSONALITY',
    'TOOL_SELECTION',
    'WORKSPACE_BRIDGES',
    'FINAL_CONFIRMATION',
  ];
  
  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  
  return stepOrder[currentIndex - 1];
};
