'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { useAetherStore } from '@/lib/store/useAetherStore';

export function DashboardClient() {
  const { user } = useAuth();
  const agents = useAetherStore((state) => state.agents);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);

  if (!user) return null;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Sovereign_OS</h1>
          <p className="text-xs font-mono text-white/30 uppercase tracking-[0.3em]">Neural_Entity_Manager</p>
        </div>
        <button onClick={() => router.push('/hub')} className="btn-primary">
          Access_Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="sovereign-glass p-8 space-y-4">
          <h3 className="text-[10px] font-black text-gemigram-neon uppercase tracking-widest">Active_Agents</h3>
          <p className="text-4xl font-black text-white">{agents.length}</p>
        </div>
        <div className="sovereign-glass p-8 space-y-4">
          <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Session_Uptime</h3>
          <p className="text-4xl font-black text-white">100%</p>
        </div>
        <button onClick={() => router.push('/forge')} className="sovereign-glass p-8 space-y-4 text-left cursor-pointer hover:border-gemigram-neon/30 transition-all">
          <h3 className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">Forge_Stability</h3>
          <p className="text-4xl font-black text-white">Nominal</p>
        </button>
      </div>
    </div>
  );
}
