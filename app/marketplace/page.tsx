'use client';
export const dynamic = 'force-static';

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

export default function NeuralMarketplace() {
  const { user } = useAuth();
  const [marketplaceAgents, setMarketplaceAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [installingId, setInstallingId] = useState<string | null>(null);

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
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(a => !(a as any).ownerId) as Agent[]; // Only show templates
        
        setMarketplaceAgents(fetched);
      } catch (error) {
        console.error('Marketplace Fetch Error:', error);
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
      alert('Authentication required for neural manifestation.');
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
      alert('Neural link interrupted. Please try again.');
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
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Sovereign Registry</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 italic">
              NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">MARKETPLACE</span>
            </h1>
            <p className="text-zinc-500 max-w-xl text-lg">
              Discover and deploy specialized intelligence entities to optimize your neural link.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search entities..."
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
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {cat.name}
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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Box className="w-12 h-12 text-zinc-800 mb-4" />
            <h2 className="text-xl font-bold text-zinc-400 mb-2">No entities found</h2>
            <p className="text-zinc-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}
