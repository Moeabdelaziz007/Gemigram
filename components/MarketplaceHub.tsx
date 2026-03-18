'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Globe, Zap, Download, Star, ShieldCheck, Terminal } from 'lucide-react';

import { MarketplaceCardSkeleton } from './ui/Skeleton';
import { apiMarketplaceClient } from '../lib/api-marketplace/marketplace-client';
import { mcpMarketplaceConnector } from '../lib/mcp/marketplace-connector';

const MARKETPLACE_CATEGORIES = [
  { id: 'mcp', label: 'MCP_Servers', icon: Package, desc: 'Protocol-level integrations for local & cloud services' },
  { id: 'api', label: 'Universal_APIs', icon: Globe, desc: '20,000+ External neural endpoints' },
  { id: 'skills', label: 'Neural_Skills', icon: Zap, desc: 'Pre-trained autonomous task blocks' },
  { id: 'tools', label: 'System_Tools', icon: Terminal, desc: 'Native OS utilities for debugging & terminal access' },
];

export function MarketplaceHub() {
  const [activeTab, setActiveTab] = useState('mcp');
  const [isLoading, setIsLoading] = React.useState(true);
  const [marketData, setMarketData] = useState<Record<string, any[]>>({});

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'mcp') {
          const servers = await mcpMarketplaceConnector.fetchFromOfficialRegistry();
          setMarketData((prev) => ({ ...prev, mcp: servers }));
        } else if (activeTab === 'api') {
          const apis = await apiMarketplaceClient.fetchFromRapidAPI();
          setMarketData((prev) => ({ ...prev, api: apis }));
        }
      } catch (err) {
        console.error('Marketplace fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="page-shell page-stack py-4 sm:py-6 md:py-8">
      <div className="flex flex-col gap-6 rounded-[2rem] border border-white/10 glass-strong p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between lg:p-8">
        <div className="space-y-3">
          <h2 className="page-title">Gemi_Market</h2>
          <p className="text-xs font-mono uppercase tracking-[0.28em] text-white/30">{MARKETPLACE_CATEGORIES.find((c) => c.id === activeTab)?.desc}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {MARKETPLACE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all sm:px-6 ${
                activeTab === cat.id
                  ? 'border-gemigram-neon/30 bg-gemigram-neon/10 text-gemigram-neon shadow-[0_0_30px_rgba(16,255,135,0.1)]'
                  : 'border-white/10 bg-white/5 text-white/30 hover:border-white/20'
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading ? (
          [...Array(8)].map((_, i) => <MarketplaceCardSkeleton key={i} />)
        ) : (
          marketData[activeTab]?.map((item, i) => <MarketplaceCard key={i} item={item} type={activeTab} />)
        )}
      </div>
    </div>
  );
}

function MarketplaceCard({ item, type }: { item: any; type: string }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="flex min-h-[300px] flex-col justify-between rounded-[2rem] border border-white/5 p-5 sovereign-glass sm:p-6">
      <div>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all group-hover:scale-110 ${
              type === 'mcp'
                ? 'border-gemigram-neon/20 bg-gemigram-neon/5 text-gemigram-neon shadow-[0_0_20px_rgba(16,255,135,0.1)]'
                : type === 'api'
                  ? 'border-blue-400/20 bg-blue-400/5 text-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.1)]'
                  : type === 'skills'
                    ? 'border-fuchsia-500/20 bg-fuchsia-500/5 text-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.1)]'
                    : 'border-orange-500/20 bg-orange-500/5 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
            }`}
          >
            {type === 'mcp' && <Package className="h-6 w-6" />}
            {type === 'api' && <Globe className="h-6 w-6" />}
            {type === 'skills' && <Zap className="h-6 w-6" />}
            {type === 'tools' && <Terminal className="h-6 w-6" />}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <Star className="h-3 w-3 text-yellow-400" />
              <span className="text-[10px] font-bold text-white/60">{item.stars}</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{item.provider}</span>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-black uppercase tracking-tight text-white transition-colors group-hover:text-gemigram-neon sm:text-xl">{item.name}</h3>
        <p className="mb-6 text-sm font-medium leading-relaxed text-white/30 line-clamp-3">{item.desc}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-white/20">
          <span>{item.version}</span>
          <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Verified</span>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 transition-all group-hover:border-gemigram-neon group-hover:bg-gemigram-neon group-hover:text-black">
          <Download className="h-4 w-4" /> {type === 'api' ? 'Link_Nexus' : type === 'skills' ? 'Acquire_Skill' : 'Install_Protocol'}
        </button>
      </div>
    </motion.div>
  );
}
