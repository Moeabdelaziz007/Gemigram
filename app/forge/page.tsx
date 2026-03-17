'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useAetherStore, Agent } from '@/lib/store/useAetherStore';
import ForgeArchitect from '@/components/ForgeArchitect';
import ForgeChamber from '@/components/ForgeChamber';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/firebase';
import { createMemory } from '@/lib/memory/memory-store';
import { startAgentHeartbeat } from '@/lib/agents/heartbeat';

export default function ForgePage() {
  const { user } = useAuth();
  const { setActiveAgentId, pendingManifest, setPendingManifest } = useAetherStore();
  const [isForging, setIsForging] = useState(false);
  const [pendingAgentData, setPendingAgentData] = useState<any>(null);
  const router = useRouter();

  // 🧬 Genesis Protocol: Handle automated forging from Voice Prompt
  useEffect(() => {
    if (pendingManifest && !isForging) {
      console.log("[ForgePage] Genesis Intent Detected. Materializing...");
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
        createdAt: serverTimestamp()
      });
      
      // Initialize agent's memory system with core memories
      console.log('[ForgePage] Initializing memory system for agent:', agentId);
      await createMemory({
        agentId: agentId,
        userId: user.uid,
        type: 'semantic',
        content: `Agent ${data.name} created with purpose: ${data.description}`,
        importance: 1.0,
        decay: data.memoryDecay || 0.01, // Default slow decay
        accessCount: 0,
        tags: ['creation', 'origin', 'core_directive', 'identity'],
        metadata: {
          source: 'agent_learning',
          context: 'Initial memory imprint during forging',
          soulType: data.soul,
          personaType: data.persona || 'default'
        }
      });
      
      // Create second core memory for skills/purpose
      await createMemory({
        agentId: agentId,
        userId: user.uid,
        type: 'procedural',
        content: `Primary operational directive: ${data.description}. Configured with tools and skills as specified.`,
        importance: 0.95,
        decay: 0.005, // Very slow decay for procedural knowledge
        accessCount: 0,
        tags: ['skills', 'directives', 'operational'],
        metadata: {
          source: 'agent_learning',
          context: 'Skill and tool configuration during creation',
          configuredTools: data.tools,
          configuredSkills: data.skills
        }
      });
      
      console.log('[ForgePage] Memory system initialized successfully');
      
      // Start heartbeat monitoring for this agent
      console.log('[ForgePage] Starting heartbeat monitor for:', agentId);
      startAgentHeartbeat(agentId);
      
      setPendingAgentData(null);
      setPendingManifest(null);
      setIsForging(false);
      setActiveAgentId(agentId);
      router.push('/workspace');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
      setIsForging(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="w-full h-full bg-carbon-black relative overflow-hidden">
      {/* Dynamic unified background layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] bg-gemigram-neon/5 rounded-full blur-[150px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute bottom-1/4 -right-1/4 w-[50vw] h-[50vw] bg-neon-blue/5 rounded-full blur-[150px] mix-blend-screen transition-all duration-1000" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="relative z-10 w-full h-full transition-opacity duration-1000">
        {!isForging ? (
          <ForgeArchitect onCancel={() => router.push('/dashboard')} onComplete={handleCreateAgent} />
        ) : (
          <ForgeChamber onComplete={handleForgeComplete} />
        )}
      </div>
    </div>
  );
}
