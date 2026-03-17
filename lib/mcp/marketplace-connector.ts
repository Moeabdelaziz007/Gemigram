/**
 * 🏪 MCP Marketplace Connector
 * 
 * Discovers, validates, and installs MCP servers from official and community marketplaces.
 * Provides server metadata, compatibility checking, and one-click installation.
 */

import { mcpClient, mcpConfigManager, MCPServer } from '.';
import { SkillDefinition } from '../../agents/skill-types';

/**
 * Official MCP Registry URL
 */
const OFFICIAL_REGISTRY_URL = 'https://modelcontextprotocol.io';
const REGISTRY_API = `${OFFICIAL_REGISTRY_URL}/api/v1`;

/**
 * Marketplace server metadata
 */
interface MarketplaceServer {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  repository: string;
  endpoint?: string;
  category: string;
  tags: string[];
  capabilities: string[];
  rating?: number;
  downloadCount?: number;
  lastUpdated: number;
  compatibility: string[];
  requirements?: {
    environmentVars?: string[];
    apiKeys?: string[];
    dependencies?: string[];
  };
  documentationUrl?: string;
  supportUrl?: string;
}

/**
 * Marketplace search filters
 */
interface MarketplaceFilters {
  query?: string;
  category?: string;
  tag?: string;
  minRating?: number;
  sortBy?: 'popularity' | 'rating' | 'lastUpdated' | 'name';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Installation result
 */
interface InstallationResult {
  success: boolean;
  serverId: string;
  server?: MCPServer;
  error?: string;
  warnings?: string[];
}

/**
 * MCP Marketplace Connector
 */
class MCPMarketplaceConnector {
  private static instance: MCPMarketplaceConnector;
  
  // Local cache of marketplace data
  private cachedServers: MarketplaceServer[] = [];
  private lastCacheUpdate: number = 0;
  private cacheDuration: number = 3600000; // 1 hour
  
  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  static getInstance(): MCPMarketplaceConnector {
    if (!MCPMarketplaceConnector.instance) {
      MCPMarketplaceConnector.instance = new MCPMarketplaceConnector();
    }
    return MCPMarketplaceConnector.instance;
  }
  
  /**
   * Fetch all servers from official registry
   */
  async fetchFromOfficialRegistry(): Promise<MarketplaceServer[]> {
    try {
      console.log('[MCP Marketplace] Fetching from official registry...');
      
      const response = await fetch(`${REGISTRY_API}/servers`);
      
      if (!response.ok) {
        throw new Error(`Registry API returned ${response.status}`);
      }
      
      const data = await response.json();
      const servers: MarketplaceServer[] = data.servers || [];
      
      // Cache the results
      this.cachedServers = servers;
      this.lastCacheUpdate = Date.now();
      
      // Also cache in config manager
      mcpConfigManager.cacheDiscoveredServers(
        servers.map(s => ({
          id: s.id,
          name: s.name,
          providerId: 'community',
          endpoint: s.endpoint || '',
          version: s.version,
          description: s.description,
          capabilities: s.capabilities,
          category: s.category,
          rating: s.rating,
          installCount: s.downloadCount
        }))
      );
      
      console.log(`[MCP Marketplace] Fetched ${servers.length} servers from registry`);
      return servers;
      
    } catch (error) {
      console.error('[MCP Marketplace] Failed to fetch from registry:', error);
      
      // Return cached data if available
      if (this.cachedServers.length > 0) {
        console.log('[MCP Marketplace] Using cached server list');
        return [...this.cachedServers];
      }
      
      throw error;
    }
  }
  
  /**
   * Search marketplace with filters
   */
  async searchMarketplace(filters: MarketplaceFilters = {}): Promise<MarketplaceServer[]> {
    // Check cache first
    const now = Date.now();
    if (now - this.lastCacheUpdate > this.cacheDuration || this.cachedServers.length === 0) {
      await this.fetchFromOfficialRegistry();
    }
    
    let results = [...this.cachedServers];
    
    // Apply query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(server =>
        server.name.toLowerCase().includes(query) ||
        server.description.toLowerCase().includes(query) ||
        server.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(server =>
        server.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }
    
    // Apply tag filter
    if (filters.tag) {
      results = results.filter(server =>
        server.tags.some(tag => tag.toLowerCase() === filters.tag!.toLowerCase())
      );
    }
    
    // Apply rating filter
    if (filters.minRating !== undefined) {
      results = results.filter(server =>
        (server.rating || 0) >= filters.minRating!
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      results.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'popularity':
            comparison = (b.downloadCount || 0) - (a.downloadCount || 0);
            break;
          case 'rating':
            comparison = (b.rating || 0) - (a.rating || 0);
            break;
          case 'lastUpdated':
            comparison = b.lastUpdated - a.lastUpdated;
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || results.length;
    results = results.slice(offset, offset + limit);
    
    return results;
  }
  
  /**
   * Get server details by ID
   */
  async getServerDetails(serverId: string): Promise<MarketplaceServer | null> {
    try {
      const response = await fetch(`${REGISTRY_API}/servers/${serverId}`);
      
      if (!response.ok) {
        // Try to find in cache
        const cached = this.cachedServers.find(s => s.id === serverId);
        if (cached) {
          return cached;
        }
        return null;
      }
      
      const data = await response.json();
      return data.server as MarketplaceServer;
      
    } catch (error) {
      console.error('[MCP Marketplace] Failed to fetch server details:', error);
      return null;
    }
  }
  
  /**
   * Check server compatibility
   */
  checkCompatibility(server: MarketplaceServer): {
    compatible: boolean;
    issues: string[];
    warnings: string[];
  } {
    const issues: string[] = [];
    const warnings: string[] = [];
    
    // Check required environment variables
    if (server.requirements?.environmentVars) {
      const missingVars = server.requirements.environmentVars.filter(
        envVar => !process.env[envVar]
      );
      
      if (missingVars.length > 0) {
        issues.push(`Missing environment variables: ${missingVars.join(', ')}`);
      }
    }
    
    // Check required API keys
    if (server.requirements?.apiKeys) {
      const missingKeys = server.requirements.apiKeys.filter(
        key => !mcpConfigManager.getCredential('default', 'api_key')
      );
      
      if (missingKeys.length > 0) {
        warnings.push(`Requires API keys: ${missingKeys.join(', ')}`);
      }
    }
    
    // Check endpoint availability
    if (server.endpoint) {
      try {
        new URL(server.endpoint);
      } catch {
        issues.push('Invalid endpoint URL format');
      }
    } else {
      warnings.push('No endpoint specified - manual configuration required');
    }
    
    return {
      compatible: issues.length === 0,
      issues,
      warnings
    };
  }
  
  /**
   * Install MCP server from marketplace
   */
  async installServer(serverId: string): Promise<InstallationResult> {
    try {
      console.log(`[MCP Marketplace] Installing server: ${serverId}`);
      
      // Get server details
      const serverDetails = await this.getServerDetails(serverId);
      
      if (!serverDetails) {
        return {
          success: false,
          serverId,
          error: 'Server not found in marketplace'
        };
      }
      
      // Check compatibility
      const compatibility = this.checkCompatibility(serverDetails);
      
      if (!compatibility.compatible) {
        return {
          success: false,
          serverId,
          error: `Compatibility issues: ${compatibility.issues.join(', ')}`,
          warnings: compatibility.warnings
        };
      }
      
      // Create MCP server configuration
      const mcpServer: MCPServer = {
        id: serverDetails.id,
        providerId: 'marketplace',
        name: serverDetails.name,
        endpoint: serverDetails.endpoint || '',
        version: serverDetails.version,
        capabilities: serverDetails.capabilities,
        status: 'inactive'
      };
      
      // Validate server configuration
      const validation = mcpConfigManager.validateServerConfiguration(mcpServer);
      
      if (!validation.valid) {
        return {
          success: false,
          serverId,
          error: `Invalid configuration: ${validation.errors.join(', ')}`,
          warnings: compatibility.warnings
        };
      }
      
      // Register with MCP client
      try {
        await mcpClient.connectToServer(mcpServer);
        
        console.log(`[MCP Marketplace] Successfully installed server: ${serverDetails.name}`);
        
        return {
          success: true,
          serverId,
          server: mcpServer,
          warnings: compatibility.warnings
        };
        
      } catch (error) {
        return {
          success: false,
          serverId,
          error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          warnings: compatibility.warnings
        };
      }
      
    } catch (error) {
      console.error('[MCP Marketplace] Installation failed:', error);
      return {
        success: false,
        serverId,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Uninstall MCP server
   */
  uninstallServer(serverId: string): void {
    try {
      mcpClient.disconnectFromServer(serverId);
      console.log(`[MCP Marketplace] Uninstalled server: ${serverId}`);
    } catch (error) {
      console.error('[MCP Marketplace] Uninstall failed:', error);
      throw error;
    }
  }
  
  /**
   * Get installed servers
   */
  getInstalledServers(): MCPServer[] {
    return mcpClient.getConnectedServers();
  }
  
  /**
   * Get available categories from marketplace
   */
  async getCategories(): Promise<string[]> {
    if (this.cachedServers.length === 0) {
      await this.fetchFromOfficialRegistry();
    }
    
    const categories = new Set(
      this.cachedServers.map(server => server.category)
    );
    
    return Array.from(categories).sort();
  }
  
  /**
   * Get available tags from marketplace
   */
  async getTags(): Promise<string[]> {
    if (this.cachedServers.length === 0) {
      await this.fetchFromOfficialRegistry();
    }
    
    const tags = new Set(
      this.cachedServers.flatMap(server => server.tags)
    );
    
    return Array.from(tags).sort();
  }
  
  /**
   * Get trending servers (most downloaded in last 7 days)
   */
  async getTrendingServers(limit: number = 10): Promise<MarketplaceServer[]> {
    const allServers = await this.searchMarketplace({
      sortBy: 'popularity',
      sortOrder: 'desc',
      limit
    });
    
    return allServers;
  }
  
  /**
   * Get newly added servers (last 30 days)
   */
  async getNewServers(limit: number = 10): Promise<MarketplaceServer[]> {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const allServers = await this.searchMarketplace({
      sortBy: 'lastUpdated',
      sortOrder: 'desc'
    });
    
    return allServers
      .filter(server => server.lastUpdated > thirtyDaysAgo)
      .slice(0, limit);
  }
  
  /**
   * Rate server (for future implementation)
   */
  async rateServer(serverId: string, rating: number): Promise<void> {
    // TODO: Implement rating submission to registry
    console.log(`[MCP Marketplace] Rating ${serverId}: ${rating}/5`);
  }
  
  /**
   * Report issue with server (for future implementation)
   */
  async reportServer(serverId: string, reason: string): Promise<void> {
    // TODO: Implement issue reporting to registry
    console.log(`[MCP Marketplace] Reporting ${serverId}: ${reason}`);
  }
  
  /**
   * Clear marketplace cache
   */
  clearCache(): void {
    this.cachedServers = [];
    this.lastCacheUpdate = 0;
    console.log('[MCP Marketplace] Cache cleared');
  }
  
  /**
   * Get marketplace statistics
   */
  getStatistics(): {
    totalServers: number;
    installedServers: number;
    categories: number;
    lastUpdate: number;
  } {
    const categories = new Set(
      this.cachedServers.map(s => s.category)
    );
    
    return {
      totalServers: this.cachedServers.length,
      installedServers: this.getInstalledServers().length,
      categories: categories.size,
      lastUpdate: this.lastCacheUpdate
    };
  }
}

// Export singleton instance
export const mcpMarketplaceConnector = MCPMarketplaceConnector.getInstance();

/**
 * MCP Marketplace Browser Skill
 */
export const MARKETPLACE_BROWSER_SKILL: SkillDefinition = {
  id: 'mcp_marketplace_browser',
  name: 'MCP Marketplace Browser',
  description: 'Discover, explore, and install MCP servers from official and community marketplaces',
  category: 'mcp_integration',
  capabilities: [
    'server_discovery',
    'category_browsing',
    'search_filtering',
    'compatibility_check',
    'one_click_install',
    'version_management',
    'update_notifications'
  ],
  permissions: ['read', 'write', 'network', 'mcp_access'],
  requirements: {
    minMemoryMB: 256,
    externalServices: ['MCP Registry API']
  },
  dependencies: [],
  conflicts: [],
  metadata: {
    icon: 'Store',
    color: 'text-indigo-600',
    difficulty: 'intermediate',
    estimatedSetupTime: '5 minutes',
    tags: ['mcp', 'marketplace', 'discovery', 'installation', 'servers'],
    version: '1.0.0',
    author: 'Gemigram',
    documentationUrl: 'https://gemigram.ai/docs/skills/mcp-marketplace-browser'
  }
};
