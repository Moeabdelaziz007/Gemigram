import { Agent } from '../store/slices/createAgentSlice';

export type ToolProvider = 
  | 'google' 
  | 'anthropic' 
  | 'vercel' 
  | 'microsoft' 
  | 'meta' 
  | 'cloudflare' 
  | 'nvidia' 
  | 'alibaba' 
  | 'openclaw'
  | 'telegram'
  | 'whatsapp'
  | 'google_ai_studio'
  | 'sovereign_core';

export type SecurityLevel = 'READ_ONLY' | 'READ_WRITE' | 'ADMIN' | 'DESTRUCTIVE';

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  provider: ToolProvider;
  version: string;
  securityLevel: SecurityLevel;
  parameters: Record<string, any>;
}

export interface MCPRegistryEntry {
  id: string;
  name: string;
  description: string;
  author: string;
  tools: MCPTool[];
  status: 'active' | 'beta' | 'maintenance';
}

export const SOVEREIGN_TOOLS: MCPTool[] = [
  // --- Google Workspace Masters ---
  {
    id: 'gws_gmail_reader',
    name: 'Neural Gmail Link',
    description: 'Direct semantic access to user communication threads.',
    provider: 'google',
    version: '1.0.0',
    securityLevel: 'READ_ONLY',
    parameters: { query: 'string' }
  },
  // --- NVIDIA NeMo / NemoClaw ---
  {
    id: 'nvidia_openshell_guard',
    name: 'OpenShell Sandbox',
    description: 'Enterprise-grade governance layer for secure agent execution.',
    provider: 'nvidia',
    version: '2.1.0',
    securityLevel: 'ADMIN',
    parameters: { policy: 'object', sandboxId: 'string' }
  },
  // --- Alibaba Qwen-Agent ---
  {
    id: 'qwen_code_interpreter',
    name: 'Qwen Neural Logic',
    description: 'Advanced code interpreter and scientific reasoning engine.',
    provider: 'alibaba',
    version: '1.5.0',
    securityLevel: 'READ_WRITE',
    parameters: { code: 'string', language: 'string' }
  },
  // --- OpenClaw / ClawHub ---
  {
    id: 'openclaw_skill_link',
    name: 'ClawHub Orchestrator',
    description: 'Decentralized skill discovery and MCP server orchestration.',
    provider: 'openclaw',
    version: '3.0.0',
    securityLevel: 'READ_WRITE',
    parameters: { skillId: 'string', action: 'string' }
  },
  // --- Vercel Ecosystem ---
  {
    id: 'vercel_web_search',
    name: 'Standard Web Search',
    description: 'Vercel AI SDK integration for high-performance web crawling.',
    provider: 'vercel',
    version: '2.4.0',
    securityLevel: 'READ_ONLY',
    parameters: { q: 'string' }
  },
  // --- Microsoft Semantic Kernel ---
  {
    id: 'ms_graph_sync',
    name: 'Azure Graph Orchestrator',
    description: 'Microsoft Graph API sync for enterprise data structures.',
    provider: 'microsoft',
    version: '1.2.0',
    securityLevel: 'READ_WRITE',
    parameters: { entity: 'string' }
  },
  // --- Cloudflare Workers AI ---
  {
    id: 'cf_workers_exec',
    name: 'Edge Computation',
    description: 'Execute serverless neural logic on the Cloudflare Edge network.',
    provider: 'cloudflare',
    version: '1.0.5',
    securityLevel: 'ADMIN',
    parameters: { script: 'string' }
  },
  // --- Google AI Studio Integration ---
  {
    id: 'studio_model_tune',
    name: 'AI Studio Tuner',
    description: 'Fine-tune and deploy custom Gemini models directly from the workspace.',
    provider: 'google_ai_studio',
    version: '1.2.0',
    securityLevel: 'ADMIN',
    parameters: { dataset: 'string', modelType: 'string' }
  },
  // --- Communication Channels ---
  {
    id: 'tg_neural_link',
    name: 'Telegram Secure Bridge',
    description: 'End-to-end encrypted neural communication via official Telegram Bot API.',
    provider: 'telegram',
    version: '4.5.0',
    securityLevel: 'READ_WRITE',
    parameters: { chatId: 'string', message: 'string' }
  },
  {
    id: 'wa_neural_link',
    name: 'WhatsApp Business Flow',
    description: 'Automated customer interaction and voice-to-text messaging.',
    provider: 'whatsapp',
    version: '2.3.1',
    securityLevel: 'READ_WRITE',
    parameters: { phone: 'string', template: 'string' }
  }
];

export const OFFICIAL_MCP_REGISTRY: MCPRegistryEntry[] = [
  {
    id: 'master_gws',
    name: 'Google Workspace Master',
    description: 'Full orchestration of Sheets, Docs, and Gmail.',
    author: 'Sovereign Core',
    status: 'active',
    tools: SOVEREIGN_TOOLS.filter(t => t.provider === 'google')
  },
  {
    id: 'nvidia_security_stack',
    name: 'NVIDIA Sovereign Guard',
    description: 'Hardware-accelerated security and sandboxing.',
    author: 'NVIDIA x Sovereign',
    status: 'beta',
    tools: SOVEREIGN_TOOLS.filter(t => t.provider === 'nvidia')
  }
];

export const getRegistryByAgent = (agent: Agent): MCPRegistryEntry[] => {
  const matching: MCPRegistryEntry[] = [];
  // Logic to map agent skills to registry entries
  if (agent.skills?.gmail || agent.skills?.calendar || agent.skills?.drive) {
    const gws = OFFICIAL_MCP_REGISTRY.find(r => r.id === 'master_gws');
    if (gws) matching.push(gws);
  }
  return matching;
};
