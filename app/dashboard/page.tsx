'use client';

import { useAuth } from '@/components/Providers';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { agents } = useGemigramStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="page-shell page-stack py-4 sm:py-6 md:py-8">
      <section className="flex flex-col gap-4 rounded-[2rem] border border-white/10 glass-strong p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
        <div className="space-y-2">
          <p className="page-kicker">Neural_Entity_Manager</p>
          <h1 className="page-title">Sovereign_OS</h1>
          <p className="page-copy max-w-2xl">Monitor your active agents, jump into the workspace, and keep the mobile dashboard readable before scaling up to larger breakpoints.</p>
        </div>
        <button onClick={() => router.push('/hub')} className="btn-primary w-full sm:w-auto">
          Access_Hub
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="page-section space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gemigram-neon">Active_Agents</h3>
          <p className="text-3xl font-black text-white sm:text-4xl">{agents.length}</p>
          <p className="text-sm text-white/50">Total sovereign entities currently available across your account.</p>
        </div>

        <div className="page-section space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Session_Uptime</h3>
          <p className="text-3xl font-black text-white sm:text-4xl">100%</p>
          <p className="text-sm text-white/50">All primary dashboard services are stable and available for voice-first workflows.</p>
        </div>

        <button
          onClick={() => router.push('/forge')}
          className="page-section flex flex-col items-start gap-3 text-left transition-all hover:border-gemigram-neon/30"
        >
          <h3 className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400">Forge_Stability</h3>
          <p className="text-3xl font-black text-white sm:text-4xl">Nominal</p>
          <p className="text-sm text-white/50">Create a new agent blueprint with a compact mobile-first CTA that expands naturally on larger screens.</p>
        </button>
      </section>
    </div>
  );
}
