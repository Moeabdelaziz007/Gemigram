import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import { useAetherStore, Agent } from '@/lib/store/useAetherStore';
import { ToolResult, Tool, FunctionDeclaration } from '@/lib/types/live-api';

export interface UseVoiceAgentLogicProps {
  activeAgent: Agent;
  googleAccessToken?: string;
}

export function useVoiceAgentLogic({ activeAgent, googleAccessToken }: UseVoiceAgentLogicProps) {
  const [apiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const [activeWidget, setActiveWidget] = useState<ToolResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  
  const transcript = useAetherStore(state => state.transcript);
  const linkType = useAetherStore(state => state.linkType);
  const setLinkType = useAetherStore(state => state.setLinkType);

  // Connection Bridge Check
  useEffect(() => {
    const checkBridge = async () => {
      try {
        const res = await fetch('http://localhost:9999/status');
        if (res.ok) setLinkType('bridge');
        else setLinkType('stateless');
      } catch (e) {
        setLinkType('stateless');
      }
    };
    checkBridge();
  }, [setLinkType]);

  const { 
    isConnected, 
    isRecording, 
    logs, 
    volume: cloudVolume, 
    connect, 
    disconnect, 
    startRecording, 
    stopRecording,
  } = useLiveAPI(apiKey, (call) => {
    setActiveWidget(call);
    setIsThinking(false);
  }, googleAccessToken);

  const { getVolume, isWasmLoaded, isSpeaking } = useAudioProcessor();

  // Optimized volume selection
  const volume = isWasmLoaded || isSpeaking ? getVolume() : cloudVolume;

  const agentStatus = useMemo(() => {
    if (linkType === 'hibernating') return 'Hibernating';
    if (!isConnected) return 'Disconnected';
    if (activeWidget) return 'Executing';
    if (isThinking) return 'Thinking';
    if (isRecording || isSpeaking) return 'Listening';
    return 'Speaking';
  }, [isConnected, isThinking, isRecording, isSpeaking, activeWidget, linkType]);

  const toggleConnection = useCallback(() => {
    if (isConnected) {
      disconnect();
      stopRecording();
    } else {
      const tools: Tool[] = [];
      const functionDeclarations: FunctionDeclaration[] = [];

      if (activeAgent?.tools?.googleSearch) {
        tools.push({ googleSearch: {} });
      }
      
      // Standard Tools Definition
      const addTool = (name: string, desc: string, props: any, req: string[] = []) => {
        functionDeclarations.push({
          name,
          description: desc,
          parameters: { type: "OBJECT", properties: props, required: req }
        });
      };

      if (activeAgent?.tools?.weather) {
        addTool("getWeather", "Get current weather", { location: { type: "STRING" } }, ["location"]);
      }
      if (activeAgent?.tools?.crypto) {
        addTool("getCryptoPrice", "Get crypto price", { symbol: { type: "STRING" } }, ["symbol"]);
      }
      if (activeAgent?.tools?.googleMaps) {
        addTool("getMapLocation", "Get geographical data", { location: { type: "STRING" } });
      }

      // Agent Materialization Tool
      functionDeclarations.push({
        name: "create_agent",
        description: "Materialize a new specialized Sovereign Intelligence agent.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            role: { type: "STRING" },
            systemPrompt: { type: "STRING" },
            voiceName: { type: "STRING", enum: ["Charon", "Puck", "Kore", "Fenrir"] },
            tools: { type: "ARRAY", items: { type: "STRING" } },
            skills: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["name", "role", "systemPrompt"]
        }
      });

      // Firebase Project Tools
      addTool("listProjects", "List all Firebase projects", {});
      addTool("getProjectDetails", "Get detailed info for a project", { projectId: { type: "STRING" } }, ["projectId"]);

      if (functionDeclarations.length > 0) {
        tools.push({ functionDeclarations });
      }
      
      connect(activeAgent?.systemPrompt, activeAgent?.voiceName, tools);
    }
  }, [isConnected, disconnect, stopRecording, connect, activeAgent]);

  return {
    isConnected,
    isRecording,
    logs,
    volume,
    agentStatus,
    activeWidget,
    transcript,
    linkType,
    showLogs,
    setShowLogs,
    toggleConnection,
    startRecording,
    stopRecording,
    setActiveWidget
  };
}
