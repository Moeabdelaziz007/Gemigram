'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/components/Providers';
import { useAetherStore } from '@/lib/store/useAetherStore';
import { Search, Plus } from 'lucide-react';
import { AgentCard } from '@/components/ui/AgentCard';
import { useRouter } from 'next/navigation';

export default function HubPage() {
  const { user } = useAuth();
  const { agents, setActiveAgentId, activeAgentId } = useAetherStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'All' | 'AI Companion' | 'Creative Guide' | 'Specialist'>('All');
  const router = useRouter();

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const nameMatch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = agent.role.toLowerCase().includes(searchTerm.toLowerCase());
      const roleFilter = filterRole === 'All' || agent.role === filterRole;
      return (nameMatch || roleMatch) && roleFilter;
    });
  }, [agents, searchTerm, filterRole]);

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 uppercase">Agents Hub</h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em]">Sovereign Entity Registry & Orchestration</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search Registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all outline-none text-sm w-full md:w-64 font-medium"
            />
          </div>
          
          <button 
            onClick={() => router.push('/forge')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gemigram-neon text-black border border-gemigram-neon/30 hover:shadow-[0_0_30px_rgba(16,255,135,0.4)] transition-all font-black uppercase text-xs tracking-widest"
          >
            <Plus className="w-4 h-4" /> Materialize_Entity
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {(['All', 'AI Companion', 'Creative Guide', 'Specialist'] as const).map((role) => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              filterRole === role 
                ? 'bg-gemigram-neon text-black border-gemigram-neon shadow-[0_0_15px_rgba(16,255,135,0.2)]' 
                : 'bg-white/[0.03] text-white/40 border-white/5 hover:border-white/20'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
        {filteredAgents.map((agent, i) => (
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
        ))}
        
        {filteredAgents.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-500">No matching entities found</h3>
            <p className="text-slate-600 text-sm mt-2">Adjust your search parameters or forge a new consciousness.</p>
          </div>
        )}
      </div>
    </div>
  );
}
