import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { useSearchParams } from 'next/navigation';

export function useWorkspaceLogic() {
  const { user, googleAccessToken } = useAuth();
  const { agents, activeAgentId } = useGemigramStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const agentParam = searchParams.get('agent');
  const setActiveAgentId = useGemigramStore(state => state.setActiveAgentId);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Simulate initial loading for agent initialization
    const timer = setTimeout(() => {
      try {
        // Validate agents data
        if (!agents || !Array.isArray(agents)) {
          console.warn('No agents found in store');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Workspace initialization error:', error);
        setHasError(true);
        setErrorDetails(error instanceof Error ? error.message : 'Unknown error occurred');
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [user, router, agents]);

  useEffect(() => {
    if (user && agents.length > 0) {
      setIsLoading(false);
      
      // If agent is specified in URL, set it as active
      if (agentParam) {
        const found = agents.find(a => a.id === agentParam || a.aetherId === agentParam);
        if (found) {
          setActiveAgentId(found.id);
        }
      }
    }
  }, [user, agents, agentParam, setActiveAgentId]);

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  return {
    user,
    googleAccessToken,
    activeAgent,
    isLoading,
    hasError,
    errorDetails,
    router
  };
}
