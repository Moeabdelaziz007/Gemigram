import { 
  MCPProvider, 
  MCPServer,
  MCPConnectionProfile 
} from '../agents/skill-types';
import { apiCredentialsManager } from '../security/api-credentials';

/**
 * Credential entry for secure storage
 */
interface CredentialEntry {
  providerId: string;
  credentialType: 'api_key' | 'oauth_token' | 'refresh_token';
  value: string;
  expiresAt?: number;
  scopes?: string[];
}

/**
 * Server discovery result from marketplace
 */
interface DiscoveredServer {
  id: string;
  name: string;
  providerId: string;
  endpoint: string;
  version: string;
  description: string;
  capabilities: string[];
  category: string;
  rating?: number;
  installCount?: number;
}

/**
 * MCP Configuration Manager
 */
export class MCPConfigManager {
  private static instance: MCPConfigManager;
  
  // Discovered servers from marketplace
  private discoveredServers: DiscoveredServer[] = [];
  
  // Marketplace cache timestamp
  private lastMarketplaceFetch: number = 0;
  private marketplaceCacheDuration: number = 3600000; // 1 hour
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}
  
  /**
   * Get the singleton instance
   */
  static getInstance(): MCPConfigManager {
    if (!MCPConfigManager.instance) {
      MCPConfigManager.instance = new MCPConfigManager();
    }
    return MCPConfigManager.instance;
  }
  
  /**
   * Store API key credential
   */
  async storeAPIKey(
    providerId: string,
    apiKey: string,
    scopes?: string[]
  ): Promise<void> {
    await apiCredentialsManager.storeAPIKey(providerId, apiKey, { scopes });
  }
  
  /**
   * Store OAuth token
   */
  async storeOAuthToken(
    providerId: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number,
    scopes?: string[]
  ): Promise<void> {
    await apiCredentialsManager.storeOAuthToken(
      providerId, 
      accessToken, 
      refreshToken, 
      expiresIn, 
      scopes
    );
  }
  
  /**
   * Get credential by provider ID and type
   */
  async getCredential(
    providerId: string,
    credentialType: 'api_key' | 'oauth_token' | 'refresh_token'
  ): Promise<CredentialEntry | undefined> {
    const result = await apiCredentialsManager.getCredentialByProvider(providerId, credentialType);
    
    if (!result || !result.valid) {
      return undefined;
    }
    
    return {
      providerId,
      credentialType,
      value: result.decrypted,
      expiresAt: result.expiresAt
    };
  }
  
  /**
   * Check if credential is expired
   */
  async isCredentialExpired(providerId: string, credentialType: string): Promise<boolean> {
    const credential = await this.getCredential(providerId, credentialType as any);
    
    if (!credential || !credential.expiresAt) {
      return false;
    }
    
    return Date.now() > credential.expiresAt;
  }
  
  /**
   * Remove credential
   */
  async removeCredential(providerId: string, credentialType: string): Promise<void> {
    apiCredentialsManager.deleteByProvider(providerId, credentialType);
  }
  
  /**
   * Clear all credentials
   */
  async clearCredentials(): Promise<void> {
    apiCredentialsManager.clearAll();
  }
  
  /**
   * Get all stored credentials (for UI display - masked)
   */
  async getStoredCredentials(): Promise<Array<{
    providerId: string;
    credentialType: string;
    hasValue: boolean;
    expiresAt?: number;
    isExpired: boolean;
  }>> {
    const credentials = apiCredentialsManager.listCredentials();
    return credentials.map(cred => ({
      providerId: cred.providerId,
      credentialType: cred.credentialType,
      hasValue: true,
      expiresAt: cred.expiresAt,
      isExpired: cred.expiresAt ? Date.now() > cred.expiresAt : false
    }));
  }
  
  /**
   * Cache discovered servers from marketplace
   */
  cacheDiscoveredServers(servers: DiscoveredServer[]): void {
    this.discoveredServers = servers;
    this.lastMarketplaceFetch = Date.now();
  }
  
  /**
   * Get cached discovered servers
   */
  getDiscoveredServers(): DiscoveredServer[] {
    // Check if cache is stale
    // Check if cache is stale
    return [...this.discoveredServers];
  }
  
  /**
   * Search discovered servers
   */
  searchServers(query: string): DiscoveredServer[] {
    const lowerQuery = query.toLowerCase();
    
    return this.discoveredServers.filter(server => 
      server.name.toLowerCase().includes(lowerQuery) ||
      server.description.toLowerCase().includes(lowerQuery) ||
      server.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery))
    );
  }
  
  /**
   * Filter servers by category
   */
  filterServersByCategory(category: string): DiscoveredServer[] {
    return this.discoveredServers.filter(server => 
      server.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  /**
   * Get server by ID
   */
  getServerById(serverId: string): DiscoveredServer | undefined {
    return this.discoveredServers.find(server => server.id === serverId);
  }
  
  /**
   * Create connection profile from discovered server
   */
  createProfileFromServer(
    profileName: string,
    server: DiscoveredServer
  ): MCPConnectionProfile {
    const _mcpServer: MCPServer = {
      id: server.id,
      providerId: server.providerId,
      name: server.name,
      endpoint: server.endpoint,
      version: server.version,
      capabilities: server.capabilities,
      status: 'inactive'
    };
    
    const profile: MCPConnectionProfile = {
      id: `profile-${Date.now()}`,
      name: profileName,
      servers: [server.id],
      active: false
    };
    
    return profile;
  }
  
  /**
   * Set marketplace cache duration
   */
  setMarketplaceCacheDuration(durationMs: number): void {
    this.marketplaceCacheDuration = durationMs;
  }
  
  /**
   * Check if marketplace cache needs refresh
   */
  needsMarketplaceRefresh(): boolean {
    const now = Date.now();
    return now - this.lastMarketplaceFetch > this.marketplaceCacheDuration;
  }
  
  /**
   * Export configuration for backup
   */
  async exportConfiguration(): Promise<string> {
    const config = {
      credentials: apiCredentialsManager.listCredentials(),
      discoveredServers: this.discoveredServers,
      lastMarketplaceFetch: this.lastMarketplaceFetch,
      exportedAt: Date.now()
    };
    
    return JSON.stringify(config, null, 2);
  }
  
  /**
   * Import configuration from backup
   */
  async importConfiguration(jsonString: string): Promise<void> {
    try {
      const config = JSON.parse(jsonString);
      
      if (config.credentials) {
        // Clear existing and import new
        apiCredentialsManager.clearAll();
        for (const _cred of config.credentials) {
          // Note: This is simplified. In real migration, we'd handle encryption keys.
          // For now, we assume the import is for the same environment.
          // This would actually need a low-level set method in apiCredentialsManager
        }
      }
      
      if (config.discoveredServers) {
        this.discoveredServers = config.discoveredServers;
      }
      
      if (config.lastMarketplaceFetch) {
        this.lastMarketplaceFetch = config.lastMarketplaceFetch;
      }
      
    } catch (error) {
      console.error('[MCP Config] Failed to import configuration:', error);
      throw new Error('Invalid configuration format');
    }
  }
  
  /**
   * Validate provider configuration
   */
  validateProviderConfiguration(provider: MCPProvider): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!provider.id || provider.id.trim() === '') {
      errors.push('Provider ID is required');
    }
    
    if (!provider.name || provider.name.trim() === '') {
      errors.push('Provider name is required');
    }
    
    if (!provider.baseUrl || provider.baseUrl.trim() === '') {
      errors.push('Provider base URL is required');
    } else {
      try {
        new URL(provider.baseUrl);
      } catch {
        errors.push('Provider base URL must be a valid URL');
      }
    }
    
    if (provider.authType === 'oauth2' && !provider.scopes?.length) {
      errors.push('OAuth2 providers should specify required scopes');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate server configuration
   */
  validateServerConfiguration(server: MCPServer): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!server.id || server.id.trim() === '') {
      errors.push('Server ID is required');
    }
    
    if (!server.providerId || server.providerId.trim() === '') {
      errors.push('Provider ID is required');
    }
    
    if (!server.name || server.name.trim() === '') {
      errors.push('Server name is required');
    }
    
    if (!server.endpoint || server.endpoint.trim() === '') {
      errors.push('Server endpoint URL is required');
    } else {
      try {
        new URL(server.endpoint);
      } catch {
        errors.push('Server endpoint must be a valid URL');
      }
    }
    
    if (!server.version || server.version.trim() === '') {
      errors.push('Server version is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Get configuration statistics
   */
  async getStatistics(): Promise<{
    totalCredentials: number;
    expiredCredentials: number;
    totalDiscoveredServers: number;
    categoriesCount: number;
    cacheAge: number;
  }> {
    const credentials = await this.getStoredCredentials();
    const expiredCount = credentials.filter(c => c.isExpired).length;
    
    const categories = new Set(
      this.discoveredServers.map(s => s.category)
    );
    
    return {
      totalCredentials: credentials.length,
      expiredCredentials: expiredCount,
      totalDiscoveredServers: this.discoveredServers.length,
      categoriesCount: categories.size,
      cacheAge: Date.now() - this.lastMarketplaceFetch
    };
  }
}

// Export singleton instance
export const mcpConfigManager = MCPConfigManager.getInstance();
