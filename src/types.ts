export type StageId =
  | 'intent'
  | 'policy'
  | 'budget'
  | 'permit'
  | 'execute'
  | 'evidence'
  | 'human_gate';

export type StageVisualState = 'ready' | 'allowed' | 'blocked' | 'warning' | 'complete';

export interface LoomStage {
  id: StageId;
  label: string;
  title?: string;
  order: number;
  status: string;
  detail: string;
  summary?: string;
  state: StageVisualState;
  updatedAt?: string;
  metadata?: Record<string, string | number | boolean>;
}

export type AIModelKey =
  | 'GPT-5.6 Sol'
  | 'GPT-5.6 Terra'
  | 'GPT-5.6 Luna'
  | 'GPT-5.5'
  | 'GPT-5.3-Codex';

export interface ModelRateCard {
  name: AIModelKey;
  inputCostPer1M: number;
  cachedCostPer1M: number;
  outputCostPer1M: number;
  tier: string;
  contextWindow: string;
  description: string;
  speedRating?: number;
}

export type TaskStatus = 'queued' | 'claimed' | 'running' | 'completed' | 'blocked';

export interface GovernedTask {
  id: string;
  status: TaskStatus;
  intent: string;
  packetSha: string;
  rawChars: number;
  packetChars: number;
  tokensSaved: number;
  creditsSaved: number;
  model: AIModelKey;
  principal: string;
  session: string;
  createdAt: string;
  claimedBy?: string;
  completedAt?: string;
  sourceRef?: string;
  summary?: string;
  creditEstimate?: {
    tokenSavings: number;
    creditsSaved: number;
  };
}

export type ApprovalActionType = 'git.push' | 'policy.apply' | 'permit.override';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface PendingApproval {
  id: string;
  actionType: ApprovalActionType;
  target: string;
  justification: string;
  status: ApprovalStatus;
  createdAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  requestedBy?: string;
  requestedAt?: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical' | string;
  diffSummary?: string;
}

export type TestResultStatus = 'passed' | 'failed' | 'unknown';
export type AuditStatus = 'valid' | 'unchecked';

export interface WorkReceipt {
  id: string;
  taskId: string;
  intent?: string;
  packetSha: string;
  commitSha?: string;
  timestamp: string;
  testsPassed?: TestResultStatus;
  auditStatus?: AuditStatus;
  tokenSavings?: number;
  tokensSaved?: number;
  creditsSaved?: number;
  principal: string;
  session?: string;
  status?: string;
  summary?: string;
  tests?: any;
  audit?: any;
  creditEstimate?: any;
  model?: AIModelKey;
  executionTimeMs?: number;
  evidenceSignature?: string;
  details?: any;
}

export interface PrivateSource {
  id: string;
  name: string;
  hash: string;
  classification: string;
  matchedFiles: number;
  uniqueBodies: number;
  duplicateBodies: number;
  categoryCounts: Record<string, number>;
  assessment?: string;
  assessmentSummary?: string;
  suggestedIntent?: string;
  lastIndexed?: string;
}

export interface CreditSummary {
  rawChars: number;
  packetChars: number;
  tokensSaved: number;
  creditsSaved: number;
  activeModel?: AIModelKey;
  cachedHits?: number;
  compressionRatio?: number;
}

export interface RepoState {
  head: string;
  branch: string;
  dirtyFiles: string[];
  unpushedCommits: number;
  clean?: boolean;
  lastTestRun?: any;
  auditValid?: boolean;
  auditHash?: string;
}

export interface RPCLogEntry {
  id: string;
  method: string;
  params: any;
  result: any;
  timestamp: string;
  durationMs: number;
  status: 'success' | 'error' | 'ok';
}
