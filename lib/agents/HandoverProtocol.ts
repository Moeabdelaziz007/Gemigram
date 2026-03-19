/**
 * Handover Protocol — Deep Context Preservation for Agent Switching
 * 
 * Ported from Gemigram-Voice-OS core/ai/handover/models.py and adapted
 * to TypeScript with Firestore persistence.
 * 
 * Enables seamless agent-to-agent context transfer with:
 * - Task tree decomposition
 * - Working memory (short-term + attention focus)
 * - Intent confidence scoring
 * - Conversation history
 * - Snapshot/rollback support
 */

// ─── Handover Status Lifecycle ──────────────────────────────
export type HandoverStatus =
  | 'PENDING'
  | 'NEGOTIATING'
  | 'PREPARING'
  | 'VALIDATING'
  | 'TRANSFERRING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ROLLED_BACK';

// ─── Intent Confidence ──────────────────────────────────────
export interface IntentConfidence {
  sourceAgent: string;
  targetAgent: string;
  confidenceScore: number; // 0.0 - 1.0
  reasoning: string;
  alternativesConsidered: string[];
}

// ─── Task Decomposition ─────────────────────────────────────
export interface TaskNode {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  parentId?: string;
  children: string[];
  assignedTo?: string;
  completedAt?: number;
  metadata: Record<string, unknown>;
}

// ─── Working Memory ─────────────────────────────────────────
export interface WorkingMemory {
  shortTerm: Record<string, unknown>;
  attentionFocus: string[];
  scratchpad: string;
  sessionDurationSeconds: number;
}

// ─── Conversation Entry ─────────────────────────────────────
export interface ConversationEntry {
  timestamp: number;
  speaker: string;
  message: string;
  metadata?: Record<string, unknown>;
}

// ─── Handover Context (Core Model) ─────────────────────────
export interface HandoverContext {
  handoverId: string;
  sourceAgent: string;
  targetAgent: string;
  status: HandoverStatus;
  task: string;
  taskTree: TaskNode[];
  currentNodeId?: string;
  workingMemory: WorkingMemory;
  intentConfidence?: IntentConfidence;
  conversationHistory: ConversationEntry[];
  payload: Record<string, unknown>;
  history: string[]; // Audit trail
  createdAt: number;
  updatedAt: number;
  snapshot?: HandoverContext; // For rollback
  rollbackAvailable: boolean;
}

// ─── Helper Functions ───────────────────────────────────────

function generateHandoverId(): string {
  return `hov-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

function generateTaskNodeId(index: number): string {
  return `task-${index}-${Date.now()}`;
}

// ─── Handover Manager ───────────────────────────────────────

export class HandoverManager {
  private activeContext: HandoverContext | null = null;

  /**
   * Create a new handover context for an agent switch.
   */
  createHandover(
    sourceAgent: string,
    targetAgent: string,
    task: string,
    confidence?: IntentConfidence
  ): HandoverContext {
    const now = Date.now();

    this.activeContext = {
      handoverId: generateHandoverId(),
      sourceAgent,
      targetAgent,
      status: 'PENDING',
      task,
      taskTree: [],
      workingMemory: {
        shortTerm: {},
        attentionFocus: [],
        scratchpad: '',
        sessionDurationSeconds: 0,
      },
      intentConfidence: confidence,
      conversationHistory: [],
      payload: {},
      history: [`[${new Date(now).toISOString()}] ${sourceAgent}: Handover initiated to ${targetAgent}`],
      createdAt: now,
      updatedAt: now,
      rollbackAvailable: false,
    };

    return this.activeContext;
  }

  /**
   * Add a history entry to the audit trail.
   */
  addHistory(action: string, agent?: string): void {
    if (!this.activeContext) return;
    const agentName = agent || this.activeContext.sourceAgent;
    const entry = `[${new Date().toISOString()}] ${agentName}: ${action}`;
    this.activeContext.history.push(entry);
    this.activeContext.updatedAt = Date.now();
  }

  /**
   * Add a conversation entry for context preservation.
   */
  addConversationEntry(speaker: string, message: string, metadata?: Record<string, unknown>): void {
    if (!this.activeContext) return;
    this.activeContext.conversationHistory.push({
      timestamp: Date.now(),
      speaker,
      message,
      metadata,
    });
  }

  /**
   * Add a task node to the decomposition tree.
   */
  addTaskNode(description: string, parentId?: string, assignedTo?: string): string {
    if (!this.activeContext) return '';

    const nodeId = generateTaskNodeId(this.activeContext.taskTree.length);
    const node: TaskNode = {
      id: nodeId,
      description,
      status: 'pending',
      parentId,
      children: [],
      assignedTo,
      metadata: {},
    };

    this.activeContext.taskTree.push(node);

    // Link to parent
    if (parentId) {
      const parent = this.activeContext.taskTree.find(n => n.id === parentId);
      if (parent) parent.children.push(nodeId);
    }

    return nodeId;
  }

  /**
   * Mark a task node as the current active task.
   */
  setCurrentTask(nodeId: string): void {
    if (!this.activeContext) return;
    this.activeContext.currentNodeId = nodeId;
    const node = this.activeContext.taskTree.find(n => n.id === nodeId);
    if (node) node.status = 'in_progress';
  }

  /**
   * Mark a task node as completed.
   */
  completeTask(nodeId: string): void {
    if (!this.activeContext) return;
    const node = this.activeContext.taskTree.find(n => n.id === nodeId);
    if (node) {
      node.status = 'completed';
      node.completedAt = Date.now();
    }
  }

  /**
   * Update handover status with audit trail logging.
   */
  updateStatus(status: HandoverStatus): void {
    if (!this.activeContext) return;
    const oldStatus = this.activeContext.status;
    this.activeContext.status = status;
    this.activeContext.updatedAt = Date.now();
    this.addHistory(`Status changed: ${oldStatus} → ${status}`);
  }

  /**
   * Create a deep snapshot for rollback capability.
   */
  createSnapshot(): void {
    if (!this.activeContext) return;
    this.activeContext.snapshot = structuredClone(this.activeContext);
    this.activeContext.rollbackAvailable = true;
    this.addHistory('Snapshot created for rollback');
  }

  /**
   * Rollback to the last saved snapshot.
   */
  rollback(): boolean {
    if (!this.activeContext?.snapshot || !this.activeContext.rollbackAvailable) {
      return false;
    }

    try {
      const snapshotData = structuredClone(this.activeContext.snapshot);
      const handoverId = this.activeContext.handoverId; // Preserve ID
      this.activeContext = snapshotData;
      this.activeContext.handoverId = handoverId;
      this.activeContext.status = 'ROLLED_BACK';
      this.addHistory('Rolled back to previous snapshot');
      return true;
    } catch (err) {
      console.error('[Handover] Rollback failed:', err);
      return false;
    }
  }

  /**
   * Store working memory key-value pair.
   */
  remember(key: string, value: unknown): void {
    if (!this.activeContext) return;
    this.activeContext.workingMemory.shortTerm[key] = value;
  }

  /**
   * Set attention focus priorities.
   */
  setAttentionFocus(priorities: string[]): void {
    if (!this.activeContext) return;
    this.activeContext.workingMemory.attentionFocus = priorities;
  }

  /**
   * Write to the temporary scratchpad.
   */
  writeScratchpad(content: string): void {
    if (!this.activeContext) return;
    this.activeContext.workingMemory.scratchpad = content;
  }

  /**
   * Get the current active context (for serialization to Firestore).
   */
  getContext(): HandoverContext | null {
    return this.activeContext;
  }

  /**
   * Serialize the handover context as a system instruction fragment
   * for injection into the next agent's Gemini session.
   */
  toSystemInstruction(): string {
    if (!this.activeContext) return '';

    const ctx = this.activeContext;
    const lines: string[] = [
      `[HANDOVER CONTEXT: ${ctx.handoverId}]`,
      `From: ${ctx.sourceAgent} → To: ${ctx.targetAgent}`,
      `Task: ${ctx.task}`,
      `Status: ${ctx.status}`,
    ];

    if (ctx.intentConfidence) {
      lines.push(`Confidence: ${(ctx.intentConfidence.confidenceScore * 100).toFixed(0)}% — ${ctx.intentConfidence.reasoning}`);
    }

    if (ctx.workingMemory.attentionFocus.length > 0) {
      lines.push(`Focus: ${ctx.workingMemory.attentionFocus.join(', ')}`);
    }

    if (ctx.workingMemory.scratchpad) {
      lines.push(`Notes: ${ctx.workingMemory.scratchpad}`);
    }

    // Include last 5 conversation entries
    const recentConvo = ctx.conversationHistory.slice(-5);
    if (recentConvo.length > 0) {
      lines.push(`Recent context:`);
      for (const entry of recentConvo) {
        lines.push(`  ${entry.speaker}: ${entry.message}`);
      }
    }

    // Task tree summary
    const pendingTasks = ctx.taskTree.filter(t => t.status !== 'completed');
    if (pendingTasks.length > 0) {
      lines.push(`Pending tasks:`);
      for (const task of pendingTasks) {
        lines.push(`  - [${task.status}] ${task.description}`);
      }
    }

    lines.push(`[END HANDOVER CONTEXT]`);
    return lines.join('\n');
  }

  /**
   * Clear the active context (after successful handover completion).
   */
  clear(): void {
    this.activeContext = null;
  }
}

// ─── Singleton Instance ─────────────────────────────────────
export const handoverManager = new HandoverManager();
