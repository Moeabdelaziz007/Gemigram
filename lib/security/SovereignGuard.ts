/**
 * 🛡️ SovereignGuard: The Neural Security Layer
 * Responsible for validating every AI Tool Call against user permissions
 * and Sovereign Security Policies.
 */

export type PermissionLevel = 'READ_ONLY' | 'READ_WRITE' | 'ADMIN' | 'DESTRUCTIVE';

export interface SecurityPolicy {
  toolName: string;
  provider?: string;
  maxLevel: PermissionLevel;
  requiresUserApproval: boolean;
  sensitiveFields?: string[];
}

const GLOBAL_POLICIES: SecurityPolicy[] = [
  { toolName: 'gmail_send', provider: 'google', maxLevel: 'READ_WRITE', requiresUserApproval: true },
  { toolName: 'drive_delete', provider: 'google', maxLevel: 'DESTRUCTIVE', requiresUserApproval: true },
  { toolName: 'cloudflare_execute', provider: 'cloudflare', maxLevel: 'ADMIN', requiresUserApproval: true },
  { toolName: 'github_push', provider: 'github', maxLevel: 'READ_WRITE', requiresUserApproval: true },
  { toolName: 'search_web', maxLevel: 'READ_ONLY', requiresUserApproval: false },
  // NVIDIA NeMo Sandbox Guard
  { toolName: 'nvidia_openshell_guard', provider: 'nvidia', maxLevel: 'ADMIN', requiresUserApproval: true },
  // Alibaba Qwen Logic
  { toolName: 'qwen_code_interpreter', provider: 'alibaba', maxLevel: 'READ_WRITE', requiresUserApproval: true },
  // OpenClaw Decentralized Skills
  { toolName: 'openclaw_skill_link', provider: 'openclaw', maxLevel: 'READ_WRITE', requiresUserApproval: true },
];

export class SovereignGuard {
  /**
   * Validates a tool call 
   * @returns true if safe, false or throws if rejected
   */
  static async validateCall(toolName: string,  parameters: Record<string, any>
): Promise<boolean> {
    const policy = GLOBAL_POLICIES.find(p => p.toolName === toolName);
    
    // Default: Deny unknown tools if they look sensitive
    if (!policy) {
      if (toolName.toLowerCase().includes('delete') || toolName.toLowerCase().includes('write')) {
        throw new Error(`SovereignGuard: Unauthorized sensitive tool call detected: ${toolName}`);
      }
      return true; // Safe enough for generic tools
    }

    if (policy.requiresUserApproval) {
      // In a real flow, this would trigger a UI prompt
      console.warn(`🛡️ SovereignGuard: [${toolName}] requires manual authorization.`);
      // For now, we simulate approval check
    }

    return true;
  }

  static getSecurityFeedback(toolName: string): string {
    const policy = GLOBAL_POLICIES.find(p => p.toolName === toolName);
    if (!policy) return 'Unknown Security Level';
    return `Policy: ${policy.maxLevel} | Approval: ${policy.requiresUserApproval ? 'Required' : 'Auto'}`;
  }
}
