/**
 * 🔗 MCP Client Core
 * 
 * Singleton-based MCP client manager for connecting to external model providers,
 * MCP servers, and marketplace services. Handles connection pooling, authentication,
 * request/response serialization, and error management.
 */

import { 
  MCPProvider, 
  MCPServer, 
  MCPResource, 
  MCPTool, 
  MCPPrompt,
  MCPConnectionProfile 
} from '../agents/skill-types';

/**
 * MCP Request structure
 */
interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

/**
 * MCP Response structure
 */
interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * Connection state change event
 */
interface ConnectionStateChangeEvent {
  serverId: string;
  previousState: MCPServer['status'];
  currentState: MCPServer['status'];
  timestamp: number;
}

/**
 * MCP Client Event Listener type
 */
type MCPClientEventListener = (event: any) => void;

/**
 * MCP Client - Singleton for managing MCP connections
 */
export class MCPClient {
  private static instance: MCPClient;
  
  // Connection pools
  private providers: Map<string, MCPProvider> = new Map();
  private servers: Map<string, MCPServer> = new Map();
  private resources: Map<string, MCPResource> = new Map();
  private tools: Map<string, MCPTool> = new Map();
  private prompts: Map<string, MCPPrompt> = new Map();
  private profiles: Map<string, MCPConnectionProfile> = new Map();
  
  // Connection management
  private connectionTimeout: number = 30000; // 30 seconds
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second
  
  // Event listeners
  private eventListeners: Map<string, MCPClientEventListener[]> = new Map();
  
  // Rate limiting
  private rateLimiters: Map<string, {
    requests: number[];
    limit: number;
    window: number;
  }> = new Map();
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}
  
  /**
   * Get the singleton instance of the MCP client
   */
  static getInstance(): MCPClient {
    if (!MCPClient.instance) {
      MCPClient.instance = new MCPClient();
    }
    return MCPClient.instance;
  }
  
  /**
   * Register an MCP provider
   */
  registerProvider(provider: MCPProvider): void {
    if (this.providers.has(provider.id)) {
      throw new Error(`Provider "${provider.id}" is already registered.`);
    }
    this.providers.set(provider.id, provider);
  }
  
  /**
   * Update an existing provider
   */
  updateProvider(provider: MCPProvider): void {
    if (!this.providers.has(provider.id)) {
      throw new Error(`Provider "${provider.id}" not found.`);
    }
    this.providers.set(provider.id, provider);
  }
  
  /**
   * Get a provider by ID
   */
  getProvider(id: string): MCPProvider | undefined {
    return this.providers.get(id);
  }
  
  /**
   * Get all registered providers
   */
  getAllProviders(): MCPProvider[] {
    return Array.from(this.providers.values());
  }
  
  /**
   * Enable or disable a provider
   */
  setProviderEnabled(id: string, enabled: boolean): void {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider "${id}" not found.`);
    }
    provider.enabled = enabled;
    this.emitEvent('provider_state_changed', {
      providerId: id,
      enabled,
      timestamp: Date.now()
    });
  }
  
  /**
   * Connect to an MCP server
   */
  async connectToServer(serverConfig: MCPServer): Promise<void> {
    const existingServer = this.servers.get(serverConfig.id);
    if (existingServer && existingServer.status === 'active') {
      return;
    }
    
    // Set initial status to connecting
    serverConfig.status = 'connecting';
    this.servers.set(serverConfig.id, serverConfig);
    this.emitEvent('server_status_changed', {
      serverId: serverConfig.id,
      status: 'connecting',
      timestamp: Date.now()
    });
    
    try {
      // Perform health check / connection test
      await this.performHealthCheck(serverConfig);
      
      // Update server status to active
      serverConfig.status = 'active';
      serverConfig.lastHealthCheck = Date.now();
      this.servers.set(serverConfig.id, serverConfig);
      
      this.emitEvent('server_connected', {
        serverId: serverConfig.id,
        timestamp: Date.now()
      });
      
      // Discover server capabilities
      await this.discoverServerCapabilities(serverConfig);
      
    } catch (error) {
      serverConfig.status = 'error';
      serverConfig.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.servers.set(serverConfig.id, serverConfig);
      
      console.error(`[MCP] Failed to connect to server ${serverConfig.name}:`, error);
      
      this.emitEvent('server_connection_failed', {
        serverId: serverConfig.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  /**
   * Disconnect from an MCP server
   */
  disconnectFromServer(serverId: string): void {
    const server = this.servers.get(serverId);
    if (!server) {
      throw new Error(`Server "${serverId}" not found.`);
    }
    
    server.status = 'inactive';
    this.servers.set(serverId, server);
    
    this.emitEvent('server_disconnected', {
      serverId,
      timestamp: Date.now()
    });
  }
  
  /**
   * Get a server by ID
   */
  getServer(id: string): MCPServer | undefined {
    return this.servers.get(id);
  }
  
  /**
   * Get all connected servers
   */
  getConnectedServers(): MCPServer[] {
    return Array.from(this.servers.values()).filter(s => s.status === 'active');
  }
  
  /**
   * Call a remote tool on an MCP server
   */
  async callTool(
    serverId: string,
    toolId: string,
    args: Record<string, any>
  ): Promise<any> {
    const server = this.servers.get(serverId);
    if (!server || server.status !== 'active') {
      throw new Error(`Server "${serverId}" is not available. Status: ${server?.status || 'not found'}`);
    }
    
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" not found.`);
    }
    
    // Check rate limits
    await this.checkRateLimit(serverId);
    
    // Build MCP request
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: `tool-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: tool.name,
        arguments: args
      }
    };
    
    try {
      const response = await this.sendRequest(server.endpoint, request);
      
      if (response.error) {
        throw new Error(`Tool call failed: ${response.error.message}`);
      }
      
      return response.result;
    } catch (error) {
      console.error(`[MCP] Tool call failed:`, error);
      throw error;
    }
  }
  
  /**
   * Read a resource from an MCP server
   */
  async readResource(serverId: string, resourceUri: string): Promise<MCPResource> {
    const server = this.servers.get(serverId);
    if (!server || server.status !== 'active') {
      throw new Error(`Server "${serverId}" is not available.`);
    }
    
    await this.checkRateLimit(serverId);
    
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: `resource-${Date.now()}`,
      method: 'resources/read',
      params: {
        uri: resourceUri
      }
    };
    
    try {
      const response = await this.sendRequest(server.endpoint, request);
      
      if (response.error) {
        throw new Error(`Resource read failed: ${response.error.message}`);
      }
      
      return response.result;
    } catch (error) {
      console.error(`[MCP] Resource read failed:`, error);
      throw error;
    }
  }
  
  /**
   * List available resources from a server
   */
  async listResources(serverId: string): Promise<MCPResource[]> {
    const server = this.servers.get(serverId);
    if (!server || server.status !== 'active') {
      throw new Error(`Server "${serverId}" is not available.`);
    }
    
    await this.checkRateLimit(serverId);
    
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: `list-resources-${Date.now()}`,
      method: 'resources/list',
      params: {}
    };
    
    try {
      const response = await this.sendRequest(server.endpoint, request);
      
      if (response.error) {
        throw new Error(`Resource listing failed: ${response.error.message}`);
      }
      
      return response.result.resources || [];
    } catch (error) {
      console.error(`[MCP] Resource listing failed:`, error);
      throw error;
    }
  }
  
  /**
   * List available tools from a server
   */
  async listTools(serverId: string): Promise<MCPTool[]> {
    const server = this.servers.get(serverId);
    if (!server || server.status !== 'active') {
      throw new Error(`Server "${serverId}" is not available.`);
    }
    
    await this.checkRateLimit(serverId);
    
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: `list-tools-${Date.now()}`,
      method: 'tools/list',
      params: {}
    };
    
    try {
      const response = await this.sendRequest(server.endpoint, request);
      
      if (response.error) {
        throw new Error(`Tool listing failed: ${response.error.message}`);
      }
      
      const tools = response.result.tools || [];
      
      // Cache discovered tools
      tools.forEach((tool: any) => {
        const mcpTool: MCPTool = {
          id: `${serverId}:${tool.name}`,
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
          requiresConfirmation: tool.requiresConfirmation ?? false
        };
        this.tools.set(mcpTool.id, mcpTool);
      });
      
      return tools;
    } catch (error) {
      console.error(`[MCP] Tool listing failed:`, error);
      throw error;
    }
  }
  
  /**
   * List available prompts from a server
   */
  async listPrompts(serverId: string): Promise<MCPPrompt[]> {
    const server = this.servers.get(serverId);
    if (!server || server.status !== 'active') {
      throw new Error(`Server "${serverId}" is not available.`);
    }
    
    await this.checkRateLimit(serverId);
    
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: `list-prompts-${Date.now()}`,
      method: 'prompts/list',
      params: {}
    };
    
    try {
      const response = await this.sendRequest(server.endpoint, request);
      
      if (response.error) {
        throw new Error(`Prompt listing failed: ${response.error.message}`);
      }
      
      const prompts = response.result.prompts || [];
      
      // Cache discovered prompts
      prompts.forEach((prompt: any) => {
        const mcpPrompt: MCPPrompt = {
          id: `${serverId}:${prompt.name}`,
          name: prompt.name,
          description: prompt.description,
          template: prompt.template,
          variables: prompt.variables,
          defaultArgs: prompt.defaultArgs
        };
        this.prompts.set(mcpPrompt.id, mcpPrompt);
      });
      
      return prompts;
    } catch (error) {
      console.error(`[MCP] Prompt listing failed:`, error);
      throw error;
    }
  }
  
  /**
   * Save a connection profile
   */
  saveConnectionProfile(profile: MCPConnectionProfile): void {
    this.profiles.set(profile.id, profile);
  }
  
  /**
   * Get a connection profile
   */
  getConnectionProfile(id: string): MCPConnectionProfile | undefined {
    return this.profiles.get(id);
  }
  
  /**
   * Get all saved profiles
   */
  getAllProfiles(): MCPConnectionProfile[] {
    return Array.from(this.profiles.values());
  }
  
  /**
   * Load a connection profile and connect to servers
   */
  async loadConnectionProfile(profileId: string): Promise<void> {
    const profile = this.profiles.get(profileId);
    if (!profile) {
      throw new Error(`Profile "${profileId}" not found.`);
    }
    
    for (const serverId of profile.servers) {
      const server = this.servers.get(serverId);
      if (server) {
        try {
          await this.connectToServer(server);
        } catch (error) {
          console.warn(`[MCP] Failed to connect to server ${serverId} from profile:`, error);
        }
      }
    }
    
    profile.active = true;
    this.profiles.set(profileId, profile);
  }
  
  /**
   * Add event listener for MCP events
   */
  addEventListener(eventType: string, listener: MCPClientEventListener): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }
  
  /**
   * Remove event listener
   */
  removeEventListener(eventType: string, listener: MCPClientEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  /**
   * Emit an event to all listeners
   */
  private emitEvent(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`[MCP] Event listener error for ${eventType}:`, error);
        }
      });
    }
  }
  
  /**
   * Perform health check on a server
   */
  private async performHealthCheck(server: MCPServer): Promise<void> {
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id: `health-${Date.now()}`,
      method: 'ping',
      params: {}
    };
    
    try {
      await this.sendRequest(server.endpoint, request);
    } catch (error) {
      // Some servers might not support ping, try initialize instead
      const initRequest: MCPRequest = {
        jsonrpc: '2.0',
        id: `init-${Date.now()}`,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'Gemigram-GemigramOS',
            version: '1.0.0'
          }
        }
      };
      await this.sendRequest(server.endpoint, initRequest);
    }
  }
  
  /**
   * Discover server capabilities
   */
  private async discoverServerCapabilities(server: MCPServer): Promise<void> {
    try {
      // Try to list available capabilities
      const [resources, tools, prompts] = await Promise.allSettled([
        this.listResources(server.id),
        this.listTools(server.id),
        this.listPrompts(server.id)
      ]);
      
    } catch (error) {
      console.warn(`[MCP] Could not discover all capabilities for ${server.name}:`, error);
    }
  }
  
  /**
   * Send MCP request to server endpoint
   */
  private async sendRequest(
    endpoint: string,
    request: MCPRequest
  ): Promise<MCPResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.connectionTimeout);
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authentication headers will be added by middleware
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: MCPResponse = await response.json();
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.connectionTimeout}ms`);
      }
      
      throw error;
    }
  }
  
  /**
   * Check rate limits for a server
   */
  private async checkRateLimit(serverId: string): Promise<void> {
    const now = Date.now();
    const limiter = this.rateLimiters.get(serverId);
    
    if (limiter) {
      // Remove old requests outside the window
      limiter.requests = limiter.requests.filter(
        timestamp => now - timestamp < limiter.window
      );
      
      if (limiter.requests.length >= limiter.limit) {
        throw new Error(
          `Rate limit exceeded for server ${serverId}. ` +
          `Try again in ${Math.ceil((limiter.requests[0] + limiter.window - now) / 1000)}s`
        );
      }
      
      limiter.requests.push(now);
    }
  }
  
  /**
   * Set rate limit for a server
   */
  setRateLimit(
    serverId: string,
    requestsPerMinute: number,
    requestsPerHour?: number
  ): void {
    const window = 60000; // 1 minute
    const limit = requestsPerMinute;
    
    this.rateLimiters.set(serverId, {
      requests: [],
      limit,
      window
    });
  }
  
  /**
   * Clear all connections and reset state
   */
  clear(): void {
    this.providers.clear();
    this.servers.clear();
    this.resources.clear();
    this.tools.clear();
    this.prompts.clear();
    this.profiles.clear();
    this.rateLimiters.clear();
  }
  
  /**
   * Get statistics about MCP connections
   */
  getStatistics(): {
    totalProviders: number;
    activeProviders: number;
    totalServers: number;
    activeServers: number;
    totalTools: number;
    totalResources: number;
    totalPrompts: number;
    totalProfiles: number;
  } {
    const allProviders = this.getAllProviders();
    const activeServers = this.getConnectedServers();
    
    return {
      totalProviders: allProviders.length,
      activeProviders: allProviders.filter(p => p.enabled).length,
      totalServers: this.servers.size,
      activeServers: activeServers.length,
      totalTools: this.tools.size,
      totalResources: this.resources.size,
      totalPrompts: this.prompts.size,
      totalProfiles: this.profiles.size
    };
  }
}

// Export singleton instance
export const mcpClient = MCPClient.getInstance();
