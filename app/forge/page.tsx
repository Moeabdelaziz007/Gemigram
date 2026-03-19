'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useGemigramStore, Agent } from '@/lib/store/useGemigramStore';
import ConversationalAgentCreator from '@/components/ConversationalAgentCreator';
import ForgeChamber from '@/components/ForgeChamber';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { createMemory } from '@/lib/memory/memory-store';
import { startAgentHeartbeat } from '@/lib/agents/heartbeat';

export default function ForgePage() {
  const { user } = useAuth();
  const { setActiveAgentId, pendingManifest, setPendingManifest, voiceSession, setVoiceSession } = useGemigramStore();
  const [isForging, setIsForging] = useState(false);
  const [pendingAgentData, setPendingAgentData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setVoiceSession({
      stage: 'forge',
      lastVoiceAction: isForging ? 'Finalizing your agent blueprint...' : 'Forge is ready. Start voice onboarding when you are ready.',
    });
  }, [isForging, setVoiceSession]);

  useEffect(() => {
    if (voiceSession.stage === 'workspace') {
      router.push('/workspace');
    }
  }, [voiceSession.stage, router]);

  useEffect(() => {
    if (pendingManifest && !isForging) {
      setPendingAgentData(pendingManifest);
      setIsForging(true);
    }
  }, [pendingManifest, isForging]);

  const handleCreateAgent = (data: any) => {
    setPendingAgentData(data);
    setIsForging(true);
  };

  const handleForgeComplete = async () => {
    if (!pendingAgentData || !user) {
      router.push('/dashboard');
      return;
    }

    const data = pendingAgentData;
    const agentId = data.name.toLowerCase().replace(/\s+/g, '-');
    const aetherId = `ath://${agentId}-${nanoid(6)}`;
    const newAgent: Agent = {
      id: agentId,
      aetherId,
      name: data.name,
      role: data.role || data.description,
      users: '0',
      seed: data.name.toLowerCase(),
      systemPrompt: data.systemPrompt,
      voiceName: data.voiceName,
      ownerId: user.uid,
      memory: data.memory || 'Initializing sovereign memory...',
      skills_desc: data.skills_desc || 'Sovereign Skillset',
      soul: data.soul,
      rules: data.rules,
      tools: data.tools,
      skills: data.skills,
    };

    try {
      await setDoc(doc(db, 'agents', agentId), {
        ...newAgent,
        createdAt: serverTimestamp(),
      });

      await createMemory({
        agentId,
        userId: user.uid,
        type: 'semantic',
        content: `Agent ${data.name} created with purpose: ${data.description}`,
        importance: 1.0,
        decay: data.memoryDecay || 0.01,
        accessCount: 0,
        tags: ['creation', 'origin', 'core_directive', 'identity'],
        metadata: {
          source: 'agent_learning',
          context: 'Initial memory imprint during forging',
          soulType: data.soul,
          personaType: data.persona || 'default',
        },
      });

      await createMemory({
        agentId,
        userId: user.uid,
        type: 'procedural',
        content: `Primary operational directive: ${data.description}. Configured with tools and skills as specified.`,
        importance: 0.95,
        decay: 0.005,
        accessCount: 0,
        tags: ['skills', 'directives', 'operational'],
        metadata: {
          source: 'agent_learning',
          context: 'Skill and tool configuration during creation',
          configuredTools: data.tools,
          configuredSkills: data.skills,
        },
      });

      startAgentHeartbeat(agentId);

      setPendingAgentData(null);
      setPendingManifest(null);
      setIsForging(false);
      setActiveAgentId(agentId);
      setVoiceSession({
        stage: 'workspace',
        lastVoiceAction: `Agent ${data.name} is active. Continue by establishing voice link.`,
      });
      router.push('/workspace');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
      setIsForging(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-theme-primary">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-1/4 top-1/4 h-[50vw] w-[50vw] rounded-full bg-gemigram-neon/5 blur-[150px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute -right-1/4 bottom-1/4 h-[50vw] w-[50vw] rounded-full bg-neon-blue/5 blur-[150px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute inset-0 opacity-[0.03] carbon-fiber" />
      </div>

      <div className="relative z-10 h-full w-full overflow-y-auto pb-nav-safe transition-opacity duration-1000">
        {!isForging ? (
          <ConversationalAgentCreator onClose={() => router.push('/dashboard')} onSubmit={handleCreateAgent} />
        ) : (
          <ForgeChamber onComplete={handleForgeComplete} />
        )}
      </div>
    </div>
  );
}
