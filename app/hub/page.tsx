'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { Search, Plus } from 'lucide-react';
import { AgentCard } from '@/components/ui/AgentCard';
import { useRouter } from 'next/navigation';
import { AgentCardSkeleton } from '@/components/ui/Skeleton';

export default function HubPage() {
  const { agents, setActiveAgentId, activeAgentId } = useGemigramStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'AI Companion' | 'Creative Guide' | 'Specialist'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const nameMatch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = agent.role.toLowerCase().includes(searchTerm.toLowerCase());
      const roleFilter = filterRole === 'All' || agent.role === filterRole;
      return (nameMatch || roleMatch) && roleFilter;
    });
  }, [agents, searchTerm, filterRole]);

  return (
    <div className="page-shell page-stack py-4 sm:py-6 md:py-8">
      <section className="flex flex-col gap-5 rounded-[2rem] border border-white/10 glass-strong p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
        <div className="space-y-2">
          <p className="page-kicker">Integrated_Sovereign_Registry</p>
          <h1 className="page-title">Neural_Hub</h1>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="group relative flex-1 lg:min-w-[18rem]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-hover:text-cyan-400" />
            <input
              type="text"
              placeholder="Search Registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/5 bg-white/[0.03] py-3 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-cyan-500/50 focus:bg-white/[0.05]"
            />
          </div>

          <button onClick={() => router.push('/forge')} className="btn-primary w-full sm:w-auto">
            <span className="inline-flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Materialize_Entity</span>
          </button>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {(['All', 'AI Companion', 'Creative Guide', 'Specialist'] as const).map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              filterRole === role
                ? 'border-gemigram-neon bg-gemigram-neon text-black shadow-[0_0_15px_rgba(16,255,135,0.2)]'
                : 'border-white/5 bg-white/[0.03] text-white/40 hover:border-white/20'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          [...Array(8)].map((_, i) => <AgentCardSkeleton key={i} />)
        ) : (
          filteredAgents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              role={agent.role}
              status={activeAgentId === agent.id ? 'connected' : 'sleeping'}
              color={i % 3 === 0 ? 'cyan' : i % 3 === 1 ? 'purple' : 'emerald'}
              onClick={() => {
                setActiveAgentId(agent.id);
                router.push('/workspace');
              }}
            />
          ))
        )}

        {filteredAgents.length === 0 && !isLoading && (
          <div className="col-span-full flex flex-col items-center py-16 text-center sm:py-20">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-white/[0.02]">
              <Search className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-500">No matching entities found</h3>
            <p className="mt-2 text-sm text-slate-600">Adjust your search parameters or forge a new consciousness.</p>
          </div>
        )}
      </div>
    </div>
  );
}
