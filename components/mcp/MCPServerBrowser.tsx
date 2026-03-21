'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Cpu,
  Zap,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { mcpMarketplaceConnector } from '@/lib/mcp/marketplace-connector';

interface MCPServerBrowserProps {
  onServerInstall?: (serverId: string) => void;
  onServerUninstall?: (serverId: string) => void;
}

interface ServerCardProps {
  server: Record<string, unknown>;
  isInstalled: boolean;
  onInstall: () => void;
  onUninstall: () => void;
}

/**
 * MCP Server Card Component
 */
const ServerCard: React.FC<ServerCardProps> = ({
  server,
  isInstalled,
  onInstall,
  onUninstall
}) => {
  const [expanded, setExpanded] = useState(false);
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await mcpMarketplaceConnector.installServer(server.id);
      onInstall();
    } catch (error) {
      console.error('Failed to install server:', error);
    } finally {
      setInstalling(false);
    }
  };

  const handleUninstall = async () => {
    try {
      mcpMarketplaceConnector.uninstallServer(server.id);
      onUninstall();
    } catch (error) {
      console.error('Failed to uninstall server:', error);
    }
  };

  return (
    <motion.div
      className="bg-black/40 border border-white/5 rounded-xl overflow-hidden 
                 backdrop-blur-sm hover:border-gemigram-neon/50 transition-all duration-300 sovereign-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-accent-purple/20 to-gemigram-neon/20 rounded-lg">
              <Package className="w-6 h-6 text-gemigram-neon" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{server.name}</h3>
              <p className="text-sm text-gray-400">v{server.version}</p>
            </div>
          </div>

          {isInstalled && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
        </div>

        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {server.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{server.rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{server.installCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(server.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {server.tags?.slice(0, 4).map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-gemigram-neon/10 text-gemigram-neon rounded-md font-mono"
            >
              {tag}
            </span>
          ))}
          {server.tags && server.tags.length > 4 && (
            <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-md">
              +{server.tags.length - 4}
            </span>
          )}
        </div>

        {/* Capabilities */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-300 mb-2">Capabilities:</h4>
            <div className="grid grid-cols-2 gap-2">
              {server.capabilities?.map((cap: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>

            {server.requirements && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <h4 className="text-xs font-medium text-yellow-400 mb-1">Requirements:</h4>
                {server.requirements.environmentVars && (
                  <p className="text-xs text-yellow-300">
                    Env vars: {server.requirements.environmentVars.join(', ')}
                  </p>
                )}
                {server.requirements.apiKeys && (
                  <p className="text-xs text-yellow-300">
                    API keys: {server.requirements.apiKeys.join(', ')}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isInstalled ? (
            <>
              <button
                onClick={handleUninstall}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-400 
                         bg-red-500/10 border border-red-500/50 rounded-lg
                         hover:bg-red-500/20 transition-colors"
              >
                Uninstall
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-4 py-2 text-sm font-medium text-gray-400 
                         bg-gray-700 border border-gray-600 rounded-lg
                         hover:bg-gray-600 flex items-center gap-1"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    More
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-1 px-4 py-2 text-sm font-black uppercase tracking-widest text-white 
                         bg-gradient-to-r from-accent-purple to-gemigram-neon rounded-lg
                         hover:shadow-[0_0_20px_rgba(16,255,135,0.3)] 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
              >
                {installing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Install
                  </>
                )}
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="px-4 py-2 text-sm font-medium text-gray-400 
                         bg-gray-700 border border-gray-600 rounded-lg
                         hover:bg-gray-600"
              >
                Details
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * MCP Server Browser Main Component
 */
export default function MCPServerBrowser({
  onServerInstall,
  onServerUninstall
}: MCPServerBrowserProps) {
  const [servers, setServers] = useState<Record<string, unknown>[]>([]);
  const [installedServers, setInstalledServers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'lastUpdated'>('popularity');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      setLoading(true);
      
      // Fetch from marketplace
      const allServers = await mcpMarketplaceConnector.fetchFromOfficialRegistry();
      setServers(allServers);
      
      // Get installed servers
      const installed = mcpMarketplaceConnector.getInstalledServers();
      setInstalledServers(new Set(installed.map(s => s.id)));
      
      // Load categories
      const cats = await mcpMarketplaceConnector.getCategories();
      setCategories(['all', ...cats]);
      
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServers = servers
    .filter(server => {
      const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           server.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || 
                             server.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.installCount || 0) - (a.installCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'lastUpdated':
          return b.lastUpdated - a.lastUpdated;
        default:
          return 0;
      }
    });

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          MCP Server Marketplace
        </h2>
        <p className="text-gray-400">
          Discover and install MCP servers to extend your agent capabilities
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search servers..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 
                     rounded-lg text-white placeholder-white/20
                     focus:outline-none focus:border-gemigram-neon"
          />
        </div>

        {/* Category Filter */}
        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 
                   rounded-lg text-white focus:outline-none focus:border-gemigram-neon"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          aria-label="Sort servers by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'popularity' | 'rating' | 'lastUpdated')}
          className="px-4 py-2.5 bg-white/5 border border-white/10 
                   rounded-lg text-white focus:outline-none focus:border-gemigram-neon"
        >
          <option value="popularity">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="lastUpdated">Recently Updated</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{servers.length}</div>
          <div className="text-sm text-gray-400">Total Servers</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {installedServers.size}
          </div>
          <div className="text-sm text-gray-400">Installed</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">
              {servers.filter(s => s.installCount && s.installCount > 1000).length}
            </div>
          </div>
          <div className="text-sm text-gray-400">Trending</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div className="text-2xl font-bold text-cyan-400">
              {categories.length - 1}
            </div>
          </div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading servers...</span>
        </div>
      )}

      {/* Servers Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredServers.map(server => (
              <ServerCard
                key={server.id}
                server={server}
                isInstalled={installedServers.has(server.id)}
                onInstall={() => {
                  setInstalledServers(prev => new Set(prev).add(server.id));
                  onServerInstall?.(server.id);
                }}
                onUninstall={() => {
                  setInstalledServers(prev => {
                    const next = new Set(prev);
                    next.delete(server.id);
                    return next;
                  });
                  onServerUninstall?.(server.id);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredServers.length === 0 && (
        <div className="text-center py-20">
          <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Servers Found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
