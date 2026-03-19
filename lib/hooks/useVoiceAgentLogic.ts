import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveAPI } from '@/hooks/useLiveAPI';
import { useAudioProcessor } from '@/hooks/useAudioProcessor';
import { useGemigramStore, Agent } from '@/lib/store/useGemigramStore';
import { fetchWithTimeout, getLocalBridgeUrl, getNetworkTimeoutMs, isBridgeCheckEnabled, normalizeNetworkError } from '@/lib/network/runtime';
import { ToolResult, Tool, FunctionDeclaration } from '@/lib/types/live-api';

export interface UseVoiceAgentLogicProps {
  activeAgent: Agent;
  googleAccessToken?: string;
}

export function useVoiceAgentLogic({ activeAgent, googleAccessToken }: UseVoiceAgentLogicProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [activeWidget, setActiveWidget] = useState<ToolResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  
  const transcript = useGemigramStore(state => state.transcript);
  const linkType = useGemigramStore(state => state.linkType);
  const setLinkType = useGemigramStore(state => state.setLinkType);

  // FIX 1: Secure Token Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchToken = async () => {
      try {
        const res = await fetch('/api/gemini-token');
        if (!res.ok) throw new Error('Failed to fetch Gemini token');
        const data = await res.json();
        if (isMounted) setApiKey(data.token);
      } catch (err) {
        console.error('[VoiceAgent] Security: Token fetch failed:', err);
      }
    };
    void fetchToken();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!isBridgeCheckEnabled()) {
      setLinkType('stateless');
      return;
    }

    const bridgeStatusUrl = getLocalBridgeUrl('/status');
    if (!bridgeStatusUrl) {
      setLinkType('stateless');
      return;
    }

    let isMounted = true;

    const checkBridge = async () => {
      try {
        const response = await fetchWithTimeout(
          bridgeStatusUrl,
          { cache: 'no-store' },
          getNetworkTimeoutMs(process.env.NEXT_PUBLIC_BRIDGE_TIMEOUT_MS, 1500)
        );

        if (isMounted) {
          setLinkType(response.ok ? 'bridge' : 'stateless');
        }
      } catch (error) {
        const failure = normalizeNetworkError(error);
        console.warn('[VoiceAgent] Bridge probe unavailable:', failure.kind, failure.message);

        if (isMounted) {
          setLinkType('stateless');
        }
      }
    };

    void checkBridge();

    return () => {
      isMounted = false;
    };
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
      
      const addTool = (name: string, desc: string, props: FunctionDeclaration['parameters']['properties'], req: string[] = []) => {
        functionDeclarations.push({
          name,
          description: desc,
          parameters: { type: 'OBJECT', properties: props, required: req }
        });
      };

      if (activeAgent?.tools?.weather) {
        addTool('getWeather', 'Get current weather', { location: { type: 'STRING' } }, ['location']);
      }
      if (activeAgent?.tools?.crypto) {
        addTool('getCryptoPrice', 'Get crypto price', { symbol: { type: 'STRING' } }, ['symbol']);
      }
      if (activeAgent?.tools?.googleMaps) {
        addTool('getMapLocation', 'Get geographical data', { location: { type: 'STRING' } });
      }

      functionDeclarations.push({
        name: 'create_agent',
        description: 'Materialize a new specialized Sovereign Intelligence agent.',
        parameters: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            role: { type: 'STRING' },
            systemPrompt: { type: 'STRING' },
            voiceName: { type: 'STRING', enum: ['Charon', 'Puck', 'Kore', 'Fenrir'] },
            tools: { type: 'ARRAY', items: { type: 'STRING' } },
            skills: { type: 'ARRAY', items: { type: 'STRING' } }
          },
          required: ['name', 'role', 'systemPrompt']
        }
      });

      addTool('listProjects', 'List all Firebase projects', {});
      addTool('getProjectDetails', 'Get detailed info for a project', { projectId: { type: 'STRING' } }, ['projectId']);

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
