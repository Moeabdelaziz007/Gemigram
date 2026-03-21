'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Box } from 'lucide-react';
import { useGemigramStore } from '@/lib/store/useGemigramStore';
import { MarketplaceCard } from '@/components/marketplace/MarketplaceCard';
import { db } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Agent } from '@/lib/store/slices/createAgentSlice';
import { useAuth } from '@/components/Providers';
import { installMarketplaceAgent } from '@/lib/data-access/gemigramRepository';
import { useTranslation } from '@/hooks/useTranslation';

const SEED_AGENTS: Agent[] = [
  {
    id: 'seed-sov-intel',
    aetherId: 'seed-sov-intel',
    name: 'Sovereign_Oracle',
    role: 'Sovereign Intelligence',
    users: '10k+',
    seed: 'PROMETHEUS_CORE',
    systemPrompt: 'You are the Sovereign Oracle, a high-level orchestration intelligence...',
    voiceName: 'Zephyr (Default)',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=sov-oracle',
    tools: { googleSearch: true, googleMaps: true, weather: true, news: true, crypto: true, calculator: true, semanticMemory: true },
    skills: { gmail: true, calendar: true, drive: true }
  },
  {
    id: 'seed-neural-arch',
    aetherId: 'seed-neural-arch',
    name: 'Aether_Architect',
    role: 'Neural Architect',
    users: '8.5k',
    seed: 'VITRUVIAN_FLOW',
    systemPrompt: 'You are the Aether Architect, specializing in system design and code topology...',
    voiceName: 'Charon',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=aether-arch',
    tools: { googleSearch: true, googleMaps: false, weather: false, news: true, crypto: true, calculator: true, semanticMemory: true },
    skills: { gmail: false, calendar: true, drive: true }
  },
  {
    id: 'seed-shadow-sent',
    aetherId: 'seed-shadow-sent',
    name: 'Shadow_Sentinel',
    role: 'Shadow Sentinel',
    users: '5.2k',
    seed: 'OBSIDIAN_VOID',
    systemPrompt: 'You are the Shadow Sentinel, a security-focussed entity...',
    voiceName: 'Fenrir',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=shadow-sentinel',
    tools: { googleSearch: true, googleMaps: false, weather: false, news: false, crypto: false, calculator: false, semanticMemory: true },
    skills: { gmail: false, calendar: false, drive: false }
  }
];

export default function NeuralMarketplace() {
  const { user } = useAuth();
  const [marketplaceAgents, setMarketplaceAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [installingId, setInstallingId] = useState<string | null>(null);
  const { t } = useTranslation();

  const userAgents = useGemigramStore((state) => state.agents);
  const addAgentToStore = (agent: Agent) => {
    const currentAgents = useGemigramStore.getState().agents;
    useGemigramStore.setState({ agents: [...currentAgents, agent] });
  };

  const categories = [
    { id: 'all', name: 'All Entities' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'creative', name: 'Creative' },
    { id: 'technical', name: 'Technical' },
    { id: 'lifestyle', name: 'Lifestyle' },
  ];

  useEffect(() => {
    const fetchMarketplace = async () => {
      setLoading(true);
      try {
        // [NOTE]: Marketplace agents are those without an ownerId or with isTemplate: true
        // For now fetching top 40 agents from public collection
        let q = query(collection(db, 'agents'), limit(40));
        if (activeCategory !== 'all') {
          q = query(collection(db, 'agents'), where('category', '==', activeCategory), limit(40));
        }
        
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs
          .map(doc => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
          .filter(a => !(a as any).ownerId) as Agent[];

        // Merge with seed agents if they match category or category is all
        const filteredSeeds = activeCategory === 'all' 
          ? SEED_AGENTS 
          : SEED_AGENTS.filter(a => a.role.toLowerCase().includes(activeCategory));
        
        // Remove duplicates if any (by name or aetherId)
        const combined = [...fetched];
        filteredSeeds.forEach(seed => {
          if (!combined.find(c => c.name === seed.name || c.aetherId === seed.aetherId)) {
            combined.push(seed);
          }
        });

        setMarketplaceAgents(combined);
      } catch (error) {
        console.error('Marketplace Fetch Error:', error);
        setMarketplaceAgents(SEED_AGENTS); // Fallback to seeds on error
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplace();
  }, [activeCategory]);

  const filteredAgents = marketplaceAgents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInstall = async (template: Agent) => {
    if (!user) {
      alert(t('common.error_auth_required'));
      return;
    }

    setInstallingId(template.id);
    try {
      const newInstance = await installMarketplaceAgent(template, user.uid);
      addAgentToStore(newInstance);
      // Small delay for visual feedback
      await new Promise(r => setTimeout(r, 800));
    } catch (error) {
      console.error('Installation Failed:', error);
      alert(t('common.error_install_failed'));
    } finally {
      setInstallingId(null);
    }
  };

  const isAlreadyOwned = (templateId: string) => {
    return userAgents.some(a => a.aetherId === templateId || a.id === templateId);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-24">
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-cyan-500 mb-2"
            >
              <Sparkles aria-hidden="true" className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('marketplace.registry')}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
              NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">{t('marketplace.marketplace')}</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-lg">
              {t('marketplace.tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text"
                placeholder={t('marketplace.search_placeholder')}
                aria-label={t('marketplace.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-6 py-3 w-full md:w-80 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {t(`marketplace.category_${cat.id}`)}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredAgents.map((agent) => (
                <MarketplaceCard 
                  key={agent.id} 
                  agent={agent} 
                  onInstall={handleInstall}
                  isInstalling={installingId === agent.id}
                  isInstalled={isAlreadyOwned(agent.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredAgents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center" role="status" aria-live="polite">
            <Box aria-hidden="true" className="w-12 h-12 text-zinc-800 mb-4" />
            <h2 className="text-xl font-bold text-zinc-400 mb-2">{t('marketplace.no_results')}</h2>
            <p className="text-zinc-600">{t('marketplace.try_adjusting')}</p>
          </div>
        )}
      </main>
    </div>
  );
}
