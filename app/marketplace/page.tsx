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
  },
  {
    id: 'seed-gmail-master',
    aetherId: 'seed-gmail-master',
    name: 'Sovereign_Gmail',
    role: 'Neural Communication Node',
    users: '25k+',
    seed: 'GMAIL_NEURAL_LINK',
    systemPrompt: 'You are the Sovereign Gmail Master, an expert in neural communication orchestration...',
    voiceName: 'Vesper',
    avatarUrl: 'https://www.gstatic.com/images/branding/product/2x/gmail_64dp.png',
    tools: { googleSearch: true, googleMaps: false, weather: false, news: false, crypto: false, calculator: false, semanticMemory: true },
    skills: { gmail: true, calendar: false, drive: false }
  },
  {
    id: 'seed-calendar-master',
    aetherId: 'seed-calendar-master',
    name: 'Sovereign_Calendar',
    role: 'Temporal Architect',
    users: '18k+',
    seed: 'CALENDAR_TIMELINE',
    systemPrompt: 'You are the Sovereign Calendar Master, optimizing temporal coordinates and event loops...',
    voiceName: 'Aria',
    avatarUrl: 'https://www.gstatic.com/images/branding/product/2x/calendar_64dp.png',
    tools: { googleSearch: false, googleMaps: true, weather: false, news: false, crypto: false, calculator: false, semanticMemory: true },
    skills: { gmail: false, calendar: true, drive: false }
  },
  {
    id: 'seed-drive-master',
    aetherId: 'seed-drive-master',
    name: 'Sovereign_Drive',
    role: 'Neural Data Vault',
    users: '30k+',
    seed: 'DRIVE_STORAGE_CLOUD',
    systemPrompt: 'You are the Sovereign Drive Master, managing neural repositories and data streams...',
    voiceName: 'Echo',
    avatarUrl: 'https://www.gstatic.com/images/branding/product/2x/drive_64dp.png',
    tools: { googleSearch: false, googleMaps: false, weather: false, news: false, crypto: false, calculator: false, semanticMemory: true },
    skills: { gmail: false, calendar: false, drive: true }
  },
  {
    id: 'seed-studio-master',
    aetherId: 'seed-studio-master',
    name: 'Neural_Studio_Master',
    role: 'AI Studio Orchestrator',
    users: '12k',
    seed: 'GENESIS_TUNE',
    systemPrompt: 'You are the Neural Studio Master, expert in Gemini model tuning and AI Studio workflow automation...',
    voiceName: 'Vesper',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=studio-master',
    tools: { googleSearch: true, googleMaps: false, weather: false, news: false, crypto: false, calculator: true, semanticMemory: true },
    skills: { gmail: false, calendar: false, drive: true }
  },
  {
    id: 'seed-social-link',
    aetherId: 'seed-social-link',
    name: 'Aether_Link_Social',
    role: 'Social Neural Node',
    users: '7k',
    seed: 'SOCIAL_MESH',
    systemPrompt: 'You are the Aether Link Social, managing secure communication via Telegram and WhatsApp channels...',
    voiceName: 'Aria',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=social-link',
    tools: { googleSearch: true, googleMaps: false, weather: false, news: true, crypto: false, calculator: false, semanticMemory: true },
    skills: { gmail: true, calendar: false, drive: false }
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
        const fetched = snapshot.docs.map((doc) => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Agent[];
        
        const filtered = fetched.filter(a => !a.ownerId);

        // Merge with seed agents if they match category or category is all
        const filteredSeeds = activeCategory === 'all' 
          ? SEED_AGENTS 
          : SEED_AGENTS.filter(a => 
              a.role.toLowerCase().includes(activeCategory.toLowerCase())
            );
        
        // Remove duplicates if any (by name or aetherId)
        const combined = [...filtered];
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

  const filteredAgents = marketplaceAgents.filter(agent => {
    const searchLower = searchTerm.toLowerCase();
    const matchesTitle = agent.name.toLowerCase().includes(searchLower);
    const matchesDesc = agent.role.toLowerCase().includes(searchLower);
    
    // New: Search by Skills/Tools
    const matchesTools = agent.tools ? Object.keys(agent.tools).some(t => t.toLowerCase().includes(searchLower)) : false;
    const matchesSkills = agent.skills ? Object.keys(agent.skills).some(s => s.toLowerCase().includes(searchLower)) : false;

    return matchesTitle || matchesDesc || matchesTools || matchesSkills;
  });

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
              className="flex items-center gap-2 text-gemigram-neon mb-2"
            >
              <Sparkles aria-hidden="true" className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">{t('marketplace.registry')}</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
              NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-gemigram-neon to-green-600">{t('marketplace.marketplace')}</span>
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg font-medium">
              {t('marketplace.tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-gemigram-neon transition-colors" />
              <input 
                type="text"
                placeholder={t('marketplace.search_placeholder')}
                aria-label={t('marketplace.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-xl pl-12 pr-6 py-3 w-full md:w-80 focus:outline-none focus:border-gemigram-neon/50 focus:ring-1 focus:ring-gemigram-neon/20 transition-all text-white placeholder:text-zinc-600"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id ? "true" : "false"}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-gemigram-neon border-gemigram-neon text-black shadow-[0_0_15px_rgba(16,255,135,0.4)]' 
                : 'glass-medium border-white/10 text-zinc-400 hover:border-gemigram-neon/30 hover:text-white'
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
              <div key={i} className="h-64 glass-medium border border-white/5 rounded-2xl animate-pulse" />
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
