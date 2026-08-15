import {
  AIModelKey,
  ApprovalActionType,
  ApprovalStatus,
  CreditSummary,
  GovernedTask,
  LoomStage,
  PendingApproval,
  PrivateSource,
  RepoState,
  RPCLogEntry,
  TaskStatus,
  WorkReceipt,
} from '../types';
import { calculateCreditEstimate } from './rateCard';

const STORAGE_KEY = 'pulpo_governance_state_v1';

export interface PulpoState {
  stages: LoomStage[];
  tasks: GovernedTask[];
  sources: PrivateSource[];
  receipts: WorkReceipt[];
  approvals: PendingApproval[];
  repoState: RepoState;
  activeModel: AIModelKey;
  tokenSaved: boolean;
  principal: string;
  session: string;
  creditSummary: CreditSummary;
  rpcLogs: RPCLogEntry[];
  latestPacket: {
    method: string;
    params: Record<string, any>;
    result: Record<string, any>;
    timestamp: string;
    durationMs: number;
  };
}

const DEFAULT_STAGES: LoomStage[] = [
  {
    id: 'intent',
    label: 'Intent',
    order: 1,
    status: 'Verified',
    detail: 'Principal chatgpt.board-manager declared bounded operator intent',
    state: 'complete',
    metadata: { scope: 'bounded_work', principal: 'chatgpt.board-manager' },
  },
  {
    id: 'policy',
    label: 'Policy',
    order: 2,
    status: 'Passed',
    detail: 'Zero egress violations, sandbox constraint rule-set 4.2 applied',
    state: 'allowed',
    metadata: { sandbox_v: '4.2', network_isolation: true },
  },
  {
    id: 'budget',
    label: 'Budget',
    order: 3,
    status: 'Pre-Approved',
    detail: '1,587 tokens saved (0.07935 credits allocated on GPT-5.6 Terra)',
    state: 'allowed',
    metadata: { credit_cap: 1.0, estimated_charge: 0.07935 },
  },
  {
    id: 'permit',
    label: 'Permit',
    order: 4,
    status: 'Granted',
    detail: 'Permit signature valid: ed25519:8f1e290a (expires in 52m)',
    state: 'allowed',
    metadata: { permit_id: 'pmt_9921_valid', expiry: '52m' },
  },
  {
    id: 'execute',
    label: 'Execute',
    order: 5,
    status: 'In Progress',
    detail: 'Active task tsk_8891 compiling diff at head e174e0c',
    state: 'ready',
    metadata: { thread_id: 'th_01', cwd: '/work/pulpo' },
  },
  {
    id: 'evidence',
    label: 'Evidence',
    order: 6,
    status: 'Collecting',
    detail: 'Test suite passed (18/18), sha256 AST hash tree verified',
    state: 'ready',
    metadata: { tests_passed: 18, uncompressed_size: '14.2kb' },
  },
  {
    id: 'human_gate',
    label: 'Human Gate',
    order: 7,
    status: 'Pending Push',
    detail: 'Action git.push holds 1 pending approval before remote sync',
    state: 'warning',
    metadata: { pending_approvals: 1, target: 'origin/main' },
  },
];

const DEFAULT_SOURCES: PrivateSource[] = [
  {
    id: 'src_01',
    name: 'pulpo-core/spec-v2',
    hash: 'sha256:4f8e91a7b0032c819ef3e21199',
    matchedFiles: 42,
    uniqueBodies: 38,
    duplicateBodies: 4,
    categoryCounts: { specs: 18, types: 12, policies: 8, fixtures: 4 },
    assessmentSummary: 'Deterministic compilation ready. No policy regressions or memory leakage detected in AST.',
    lastIndexed: '2026-08-15T08:14:00Z',
    classification: 'Restricted',
    suggestedIntent: 'Synchronize spec-v2 deterministic AST schemas with evidence pipeline',
  },
  {
    id: 'src_02',
    name: 'infra/guardrails-acl',
    hash: 'sha256:99c011e4f552981bc881023aa4',
    matchedFiles: 19,
    uniqueBodies: 19,
    duplicateBodies: 0,
    categoryCounts: { iam: 7, network: 6, secrets: 6 },
    assessmentSummary: 'Strict principal boundary validated. Zero wildcards in sandbox permission matrix.',
    lastIndexed: '2026-08-15T07:45:00Z',
    classification: 'Confidential',
    suggestedIntent: 'Audit network isolation guardrails against latest CVE matrix',
  },
  {
    id: 'src_03',
    name: 'memory/board-minutes',
    hash: 'sha256:d37ba20988ccaa14592019fe88',
    matchedFiles: 84,
    uniqueBodies: 71,
    duplicateBodies: 13,
    categoryCounts: { governance: 35, audits: 24, resolutions: 12, receipts: 13 },
    assessmentSummary: 'Historical precedent corpus mapped. 13 deduplicated redundancy blocks indexed with compressed offsets.',
    lastIndexed: '2026-08-14T21:30:00Z',
    classification: 'Internal',
    suggestedIntent: 'Deduplicate historical governance records and synthesize quarterly audit digest',
  },
];

const DEFAULT_TASKS: GovernedTask[] = [
  {
    id: 'tsk_8891',
    status: 'queued',
    intent: 'Verify sandbox isolation invariants and compress AST diffs before push',
    packetSha: 'sha256:8f1e290a12ce88bf102',
    rawChars: 14280,
    packetChars: 8170,
    tokensSaved: 1587,
    creditsSaved: 0.07935,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    session: 'selfhost',
    createdAt: '2026-08-15T09:10:00Z',
    sourceRef: 'infra/guardrails-acl',
    summary: 'Queued for execution under permit signature ed25519:8f1e290a',
  },
  {
    id: 'tsk_8890',
    status: 'running',
    intent: 'Compile cryptographically signed evidence packet for receipt rcpt_5501',
    packetSha: 'sha256:a312bc8f9911e204c32',
    rawChars: 9120,
    packetChars: 5498,
    tokensSaved: 940,
    creditsSaved: 0.04700,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    session: 'selfhost',
    createdAt: '2026-08-15T08:50:00Z',
    claimedBy: 'worker-local-01',
    sourceRef: 'pulpo-core/spec-v2',
    summary: 'Running test harness assertion suite (18/18 passing)',
  },
  {
    id: 'tsk_8889',
    status: 'completed',
    intent: 'Deduplicate AST bodies in memory/board-minutes and prune stale receipts',
    packetSha: 'sha256:7712ba4de9901aa8841',
    rawChars: 24800,
    packetChars: 12440,
    tokensSaved: 3210,
    creditsSaved: 0.16050,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    session: 'selfhost',
    createdAt: '2026-08-15T08:05:00Z',
    completedAt: '2026-08-15T08:12:00Z',
    sourceRef: 'memory/board-minutes',
    summary: '13 redundant bodies stripped with lossless AST reference indexing',
  },
  {
    id: 'tsk_8888',
    status: 'claimed',
    intent: 'Evaluate model rate card parity across GPT-5.6 family for batch compression',
    packetSha: 'sha256:19ef44ca00812bb5633',
    rawChars: 6800,
    packetChars: 4410,
    tokensSaved: 620,
    creditsSaved: 0.03100,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    session: 'selfhost',
    createdAt: '2026-08-15T07:30:00Z',
    claimedBy: 'worker-local-02',
    summary: 'Claimed by worker-local-02; checking budget ceiling',
  },
  {
    id: 'tsk_8887',
    status: 'blocked',
    intent: 'Direct remote socket bind attempt during test run without egress grant',
    packetSha: 'sha256:009fa12b88aa334190c',
    rawChars: 4100,
    packetChars: 2520,
    tokensSaved: 410,
    creditsSaved: 0.02050,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    session: 'selfhost',
    createdAt: '2026-08-15T06:45:00Z',
    completedAt: '2026-08-15T06:46:00Z',
    summary: 'Blocked by Policy Engine: egress to unauthorized IP:443 forbidden in sandbox',
  },
];

const DEFAULT_RECEIPTS: WorkReceipt[] = [
  {
    id: 'rcpt_5501',
    taskId: 'tsk_8889',
    status: 'completed',
    summary: 'Verified repo clean state and locked audit trail e174e0c',
    tests: 'passed',
    audit: 'valid',
    packetSha: 'sha256:a174e0c88121bc99401',
    creditEstimate: 0.07935,
    tokensSaved: 1587,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    timestamp: '2026-08-15T08:12:00Z',
    executionTimeMs: 420,
    evidenceSignature: 'sig:ed25519:9981bcfe174e0c',
    details: 'Full AST parity validated across 38 modules. Clean exit code 0.',
  },
  {
    id: 'rcpt_5500',
    taskId: 'tsk_8886',
    status: 'completed',
    summary: 'Compiled deterministic policy permit for principal chatgpt.board-manager',
    tests: 'passed',
    audit: 'valid',
    packetSha: 'sha256:f89c001277a012d99aa',
    creditEstimate: 0.04700,
    tokensSaved: 940,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    timestamp: '2026-08-15T07:15:00Z',
    executionTimeMs: 310,
    evidenceSignature: 'sig:ed25519:7719aa01824cb',
    details: 'Policy digest signed and committed to local proof log.',
  },
  {
    id: 'rcpt_5499',
    taskId: 'tsk_8885',
    status: 'completed',
    summary: 'Deduplication & compression of source corpus memory/board-minutes',
    tests: 'passed',
    audit: 'valid',
    packetSha: 'sha256:e01149ab88c031d77aa',
    creditEstimate: 0.16050,
    tokensSaved: 3210,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    timestamp: '2026-08-14T21:40:00Z',
    executionTimeMs: 890,
    evidenceSignature: 'sig:ed25519:44109fe8271ab',
    details: '13 redundant bodies replaced with compressed pointers. Zero information loss.',
  },
  {
    id: 'rcpt_5498',
    taskId: 'tsk_8884',
    status: 'completed',
    summary: 'Static AST boundary verification on infra/guardrails-acl',
    tests: 'passed',
    audit: 'valid',
    packetSha: 'sha256:c55198ef019283ba412',
    creditEstimate: 0.03100,
    tokensSaved: 620,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    timestamp: '2026-08-14T19:10:00Z',
    executionTimeMs: 240,
    evidenceSignature: 'sig:ed25519:19283ba41289c',
    details: '19 files parsed, all AST nodes conform to sandbox capability profile.',
  },
  {
    id: 'rcpt_5497',
    taskId: 'tsk_8887',
    status: 'blocked',
    summary: 'Halted unpermitted external egress probe on port 443 during dry-run',
    tests: 'failed',
    audit: 'valid',
    packetSha: 'sha256:9900ee1288c991ba001',
    creditEstimate: 0.02050,
    tokensSaved: 410,
    model: 'GPT-5.6 Terra',
    principal: 'chatgpt.board-manager',
    timestamp: '2026-08-14T18:22:00Z',
    executionTimeMs: 150,
    evidenceSignature: 'sig:ed25519:0091823bbca89',
    details: 'Socket permit interceptor rejected outbound handshake. Trace safely dumped to evidence vault.',
  },
];

const DEFAULT_APPROVALS: PendingApproval[] = [
  {
    id: 'appr_101',
    actionType: 'git.push',
    target: 'origin/main (commit e174e0c)',
    requestedBy: 'chatgpt.board-manager',
    requestedAt: '2026-08-15T09:12:00Z',
    status: 'pending',
    riskLevel: 'medium',
    justification: 'Push signed evidence bundle and audited policy updates to trunk at HEAD e174e0c.',
    diffSummary: '+142 lines across 3 governance files, 0 secrets exposed, test suite 100% green.',
  },
];

const DEFAULT_REPO: RepoState = {
  head: 'e174e0c',
  branch: 'main',
  dirtyFiles: ['governance/loom.lock', 'receipts/rcpt_5501.json'],
  lastTestRun: {
    status: 'passed',
    passed: 18,
    failed: 0,
    skipped: 0,
    durationMs: 412,
    timestamp: '2026-08-15T09:05:00Z',
  },
  auditValid: true,
  auditHash: 'sha256:779bc901e174e0c8812199201aa88bf1',
  unpushedCommits: 1,
};

const DEFAULT_CREDIT_SUMMARY: CreditSummary = {
  rawChars: 14280,
  packetChars: 8170,
  tokensSaved: 1587,
  creditsSaved: 0.07935,
  activeModel: 'GPT-5.6 Terra',
  cachedHits: 14,
  compressionRatio: 0.428,
};

export class PulpoRPCService {
  private state: PulpoState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): PulpoState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    const initial: PulpoState = {
      stages: DEFAULT_STAGES,
      tasks: DEFAULT_TASKS,
      sources: DEFAULT_SOURCES,
      receipts: DEFAULT_RECEIPTS,
      approvals: DEFAULT_APPROVALS,
      repoState: DEFAULT_REPO,
      activeModel: 'GPT-5.6 Terra',
      tokenSaved: true,
      principal: 'chatgpt.board-manager',
      session: 'selfhost',
      creditSummary: DEFAULT_CREDIT_SUMMARY,
      rpcLogs: [],
      latestPacket: {
        method: 'pulpo.overview',
        params: { principal: 'chatgpt.board-manager', session: 'selfhost' },
        result: {
          status: 'ok',
          governance_state: 'active',
          repo_head: 'e174e0c',
          audit_valid: true,
          active_tasks: 2,
          pending_approvals: 1,
          tokens_saved: 1587,
          credits_saved: 0.07935,
        },
        timestamp: new Date().toISOString(),
        durationMs: 14,
      },
    };
    this.saveState(initial);
    return initial;
  }

  private saveState(state: PulpoState) {
    this.state = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localstorage full or restricted
    }
  }

  public getState(): PulpoState {
    return this.state;
  }

  public resetToDefaults(): PulpoState {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    return this.state;
  }

  public async callRPC(method: string, params: Record<string, any> = {}): Promise<any> {
    const startTime = performance.now();
    let result: any;
    let isError = false;

    try {
      switch (method) {
        case 'pulpo.overview':
          result = this.handleOverview(params);
          break;
        case 'pulpo.context.packet':
        case 'pulpo.packet.build':
          result = this.handleContextPacket(params);
          break;
        case 'pulpo.task.submit':
          result = this.handleTaskSubmit(params);
          break;
        case 'pulpo.task.list':
          result = this.handleTaskList(params);
          break;
        case 'pulpo.task.claim':
          result = this.handleTaskClaim(params);
          break;
        case 'pulpo.task.complete':
          result = this.handleTaskComplete(params);
          break;
        case 'pulpo.task.run':
          result = this.handleTaskRun(params);
          break;
        case 'pulpo.task.run_next':
          result = this.handleTaskRunNext(params);
          break;
        case 'pulpo.source.list':
          result = this.handleSourceList(params);
          break;
        case 'pulpo.source.task':
        case 'pulpo.source.synthesize_task':
          result = this.handleSourceTask(params);
          break;
        case 'pulpo.receipt.list':
          result = this.handleReceiptList(params);
          break;
        case 'pulpo.credit.summary':
          result = this.handleCreditSummary(params);
          break;
        case 'pulpo.credit.estimate':
          result = this.handleCreditEstimate(params);
          break;
        case 'pulpo.repo.status':
          result = this.handleRepoStatus(params);
          break;
        case 'pulpo.repo.diff':
          result = this.handleRepoDiff(params);
          break;
        case 'pulpo.repo.test':
          result = this.handleRepoTest(params);
          break;
        case 'pulpo.audit.verify':
          result = this.handleAuditVerify(params);
          break;
        case 'pulpo.approve':
          result = this.handleApprove(params);
          break;
        case 'pulpo.approval.decide':
          if (params.decision === 'cancel' || params.decision === 'reject') {
            result = this.handleApprovalCancel(params);
          } else {
            result = this.handleApprove(params);
          }
          break;
        case 'pulpo.approval.create':
          result = this.handleApprovalCreate(params);
          break;
        case 'pulpo.approval.cancel':
          result = this.handleApprovalCancel(params);
          break;
        default:
          isError = true;
          result = { error: `Method ${method} not found in Pulpo RPC table`, code: -32601 };
      }
    } catch (err: any) {
      isError = true;
      result = { error: err.message || 'Internal RPC error', code: -32000 };
    }

    const durationMs = Math.round(performance.now() - startTime) + Math.floor(Math.random() * 8 + 4);

    const logEntry: RPCLogEntry = {
      id: `rpc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      method,
      params,
      result,
      durationMs,
      status: isError ? 'error' : 'ok',
    };

    const updatedLogs = [logEntry, ...(this.state.rpcLogs || [])].slice(0, 50);
    const updatedState = {
      ...this.state,
      rpcLogs: updatedLogs,
      latestPacket: {
        method,
        params,
        result,
        timestamp: logEntry.timestamp,
        durationMs,
      },
    };

    this.saveState(updatedState);
    return result;
  }

  // --- Handlers ---

  private handleOverview(params: any) {
    return {
      status: 'ok',
      principal: params.principal || this.state.principal,
      session: params.session || this.state.session,
      repo_head: this.state.repoState.head,
      branch: this.state.repoState.branch,
      audit_valid: this.state.repoState.auditValid,
      tasks_total: this.state.tasks.length,
      tasks_queued: this.state.tasks.filter((t) => t.status === 'queued').length,
      tasks_running: this.state.tasks.filter((t) => t.status === 'running').length,
      receipts_total: this.state.receipts.length,
      pending_approvals: this.state.approvals.filter((a) => a.status === 'pending').length,
      credit_summary: this.state.creditSummary,
      loom_status: {
        all_passed: this.state.stages.every((s) => s.state !== 'blocked'),
        blocked_stages: this.state.stages.filter((s) => s.state === 'blocked').map((s) => s.id),
      },
    };
  }

  private handleContextPacket(params: any) {
    const rawChars = params.rawChars || 14280;
    const packetChars = params.packetChars || Math.round(rawChars * 0.572);
    const tokensSaved = Math.round((rawChars - packetChars) / 3.85);
    const model = (params.model as AIModelKey) || this.state.activeModel;
    const creditsSaved = calculateCreditEstimate(tokensSaved, model);

    const packetSha = `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

    return {
      status: 'ok',
      packet_sha: packetSha,
      raw_chars: rawChars,
      packet_chars: packetChars,
      compression_ratio: Number((packetChars / rawChars).toFixed(3)),
      tokens_saved: tokensSaved,
      credits_saved: creditsSaved,
      model,
      permit_signature: `sig:ed25519:${packetSha.substring(7, 19)}`,
      governance_claims: [
        'Zero unauthorized filesystem breakout',
        'Deterministic AST normalization verified',
        'Rate-card quota reservation confirmed',
      ],
    };
  }

  private handleTaskSubmit(params: any) {
    const intent = params.intent || 'Inspect and compile local governance packet';
    const principal = params.principal || this.state.principal;
    const session = params.session || this.state.session;
    const model = (params.model as AIModelKey) || this.state.activeModel;

    const rawChars = intent.length * 35 + 4200;
    const packetChars = Math.round(rawChars * 0.57);
    const tokensSaved = Math.max(120, Math.round((rawChars - packetChars) / 3.85));
    const creditsSaved = calculateCreditEstimate(tokensSaved, model);

    const newTask: GovernedTask = {
      id: `tsk_${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'queued',
      intent,
      packetSha: `sha256:${Math.random().toString(36).substring(2, 12)}a1`,
      rawChars,
      packetChars,
      tokensSaved,
      creditsSaved,
      model,
      principal,
      session,
      createdAt: new Date().toISOString(),
      sourceRef: params.sourceRef || 'operator/manual-intent',
      summary: 'Task queued by operator console under sandbox policy',
    };

    const updatedTasks = [newTask, ...this.state.tasks];
    
    // Update loom stage
    const updatedStages = this.state.stages.map((st) => {
      if (st.id === 'intent') {
        return {
          ...st,
          status: 'Submitted',
          detail: `Intent received for ${newTask.id}: "${intent.substring(0, 48)}..."`,
          state: 'complete' as const,
        };
      }
      if (st.id === 'permit') {
        return {
          ...st,
          status: 'Permit Ready',
          detail: `Permit generated for ${newTask.id} (${model})`,
          state: 'allowed' as const,
        };
      }
      return st;
    });

    this.state = {
      ...this.state,
      tasks: updatedTasks,
      stages: updatedStages,
      creditSummary: {
        ...this.state.creditSummary,
        rawChars: this.state.creditSummary.rawChars + rawChars,
        packetChars: this.state.creditSummary.packetChars + packetChars,
        tokensSaved: this.state.creditSummary.tokensSaved + tokensSaved,
        creditsSaved: Number((this.state.creditSummary.creditsSaved + creditsSaved).toFixed(5)),
      },
    };
    this.saveState(this.state);

    return {
      status: 'ok',
      task: newTask,
      queue_depth: updatedTasks.filter((t) => t.status === 'queued').length,
    };
  }

  private handleTaskList(params: any) {
    let tasks = [...this.state.tasks];
    if (params.status) {
      tasks = tasks.filter((t) => t.status === params.status);
    }
    return {
      status: 'ok',
      total: tasks.length,
      tasks,
    };
  }

  private handleTaskClaim(params: any) {
    const taskId = params.taskId || params.id;
    const worker = params.worker || 'operator-local';

    const updatedTasks = this.state.tasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, status: 'claimed' as TaskStatus, claimedBy: worker };
      }
      return t;
    });

    this.state = { ...this.state, tasks: updatedTasks };
    this.saveState(this.state);

    return { status: 'ok', taskId, claimedBy: worker };
  }

  private handleTaskRun(params: any) {
    const taskId = params.taskId || params.id;
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!task) {
      return { status: 'error', message: `Task ${taskId} not found` };
    }

    const updatedTasks = this.state.tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'running' as TaskStatus,
          summary: `Executing governed workflow for: "${t.intent.substring(0, 36)}..."`,
        };
      }
      return t;
    });

    const updatedStages = this.state.stages.map((st) => {
      if (st.id === 'execute') {
        return {
          ...st,
          status: 'Running',
          detail: `Active task ${taskId} compiling evidence at HEAD ${this.state.repoState.head}`,
          state: 'ready' as const,
        };
      }
      return st;
    });

    this.state = { ...this.state, tasks: updatedTasks, stages: updatedStages };
    this.saveState(this.state);

    return { status: 'ok', taskId, state: 'running' };
  }

  private handleTaskRunNext(params: any) {
    const queuedTask = this.state.tasks.find((t) => t.status === 'queued');
    if (!queuedTask) {
      return { status: 'noop', message: 'No queued tasks found in backlog' };
    }

    return this.handleTaskRun({ taskId: queuedTask.id });
  }

  private handleTaskComplete(params: any) {
    const taskId = params.taskId || params.id;
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!task) {
      return { status: 'error', message: `Task ${taskId} not found` };
    }

    const newReceipt: WorkReceipt = {
      id: `rcpt_${Math.floor(5500 + Math.random() * 500)}`,
      taskId,
      status: 'completed',
      summary: `Completed: ${task.intent}`,
      tests: 'passed',
      audit: 'valid',
      packetSha: task.packetSha,
      creditEstimate: task.creditsSaved,
      tokensSaved: task.tokensSaved,
      model: task.model,
      principal: task.principal,
      timestamp: new Date().toISOString(),
      executionTimeMs: Math.floor(250 + Math.random() * 400),
      evidenceSignature: `sig:ed25519:${task.packetSha.substring(7, 19)}`,
      details: 'Governed run completed with full receipt proof bundle written to storage.',
    };

    const updatedTasks = this.state.tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'completed' as TaskStatus,
          completedAt: new Date().toISOString(),
          summary: `Finished with receipt ${newReceipt.id}`,
        };
      }
      return t;
    });

    const updatedReceipts = [newReceipt, ...this.state.receipts];

    const updatedStages = this.state.stages.map((st) => {
      if (st.id === 'evidence') {
        return {
          ...st,
          status: 'Receipt Sealed',
          detail: `Receipt ${newReceipt.id} minted for ${taskId} (${task.tokensSaved} tokens saved)`,
          state: 'complete' as const,
        };
      }
      return st;
    });

    this.state = {
      ...this.state,
      tasks: updatedTasks,
      receipts: updatedReceipts,
      stages: updatedStages,
    };
    this.saveState(this.state);

    return { status: 'ok', receipt: newReceipt, taskId };
  }

  private handleSourceList(params: any) {
    return {
      status: 'ok',
      total: this.state.sources.length,
      sources: this.state.sources,
    };
  }

  private handleSourceTask(params: any) {
    const sourceId = params.sourceId;
    const source = this.state.sources.find((s) => s.id === sourceId || s.name === sourceId);
    if (!source) {
      return { status: 'error', message: `Source ${sourceId} not found` };
    }

    const intent = `Governed processing of source [${source.name}]: ${source.suggestedIntent}`;
    return this.handleTaskSubmit({
      intent,
      sourceRef: source.name,
      model: this.state.activeModel,
    });
  }

  private handleReceiptList(params: any) {
    return {
      status: 'ok',
      total: this.state.receipts.length,
      receipts: this.state.receipts,
    };
  }

  private handleCreditSummary(params: any) {
    return {
      status: 'ok',
      summary: this.state.creditSummary,
      disclaimer: 'Planning estimates only, not billing records.',
    };
  }

  private handleCreditEstimate(params: any) {
    const tokens = params.tokens || 1587;
    const model = (params.model as AIModelKey) || this.state.activeModel;
    const estimate = calculateCreditEstimate(tokens, model);

    return {
      status: 'ok',
      tokens_saved: tokens,
      model,
      credits_saved: estimate,
      formula: `${tokens} tokens * (rate / 1M)`,
      disclaimer: 'Planning estimates only, not billing records.',
    };
  }

  private handleRepoStatus(params: any) {
    return {
      status: 'ok',
      head: this.state.repoState.head,
      branch: this.state.repoState.branch,
      dirty_files: this.state.repoState.dirtyFiles,
      clean: this.state.repoState.dirtyFiles.length === 0,
      unpushed_commits: this.state.repoState.unpushedCommits,
      audit_valid: this.state.repoState.auditValid,
      audit_hash: this.state.repoState.auditHash,
    };
  }

  private handleRepoDiff(params: any) {
    return {
      status: 'ok',
      head: this.state.repoState.head,
      diff_stat: '3 files changed, 142 insertions(+), 18 deletions(-)',
      files: [
        {
          path: 'governance/loom.lock',
          insertions: 42,
          deletions: 4,
          diff: `@@ -12,6 +12,12 @@
- permit_id: "pmt_old_7701"
+ permit_id: "pmt_9921_valid"
+ permit_signature: "ed25519:8f1e290a"
+ sandbox_constraints: ["no_egress", "read_only_root"]
+ budget_credits_cap: 1.00000`,
        },
        {
          path: 'receipts/rcpt_5501.json',
          insertions: 88,
          deletions: 0,
          diff: `@@ -0,0 +1,18 @@
+{
+  "id": "rcpt_5501",
+  "task_id": "tsk_8889",
+  "status": "completed",
+  "audit": "valid",
+  "tokens_saved": 1587,
+  "credits_saved": 0.07935
+}`,
        },
        {
          path: 'packages/core/src/compressor.ts',
          insertions: 12,
          deletions: 14,
          diff: `@@ -84,14 +84,12 @@
- export function rawPack(input: string) { return compress(input, false); }
+ export function rawPack(input: string) { return astDeduplicate(input); }`,
        },
      ],
    };
  }

  private handleRepoTest(params: any) {
    const updatedRepo = {
      ...this.state.repoState,
      lastTestRun: {
        status: 'passed' as const,
        passed: 18,
        failed: 0,
        skipped: 0,
        durationMs: Math.floor(380 + Math.random() * 50),
        timestamp: new Date().toISOString(),
      },
    };

    this.state = { ...this.state, repoState: updatedRepo };
    this.saveState(this.state);

    return {
      status: 'ok',
      test_suite: 'pulpo-governance-core',
      results: updatedRepo.lastTestRun,
      suites: [
        { name: 'PolicyEngine.spec.ts', status: 'passed', tests: 6, duration: '82ms' },
        { name: 'CompressionCodec.spec.ts', status: 'passed', tests: 5, duration: '144ms' },
        { name: 'EvidenceSignature.spec.ts', status: 'passed', tests: 4, duration: '98ms' },
        { name: 'SandboxPermit.spec.ts', status: 'passed', tests: 3, duration: '88ms' },
      ],
    };
  }

  private handleAuditVerify(params: any) {
    const isValid = true;
    const auditHash = `sha256:779bc901e174e0c8812199201aa88bf1`;

    const updatedRepo = {
      ...this.state.repoState,
      auditValid: isValid,
      auditHash,
    };

    const updatedStages = this.state.stages.map((st) => {
      if (st.id === 'policy') {
        return {
          ...st,
          status: 'Audit Verified',
          detail: 'Cryptographic audit tree verified against root authority',
          state: 'allowed' as const,
        };
      }
      return st;
    });

    this.state = { ...this.state, repoState: updatedRepo, stages: updatedStages };
    this.saveState(this.state);

    return {
      status: 'ok',
      audit_valid: isValid,
      audit_hash: auditHash,
      checked_at: new Date().toISOString(),
      root_certificate: 'cert:pulpo-local-root-2026',
      receipts_validated: this.state.receipts.length,
      zero_policy_violations: true,
    };
  }

  private handleApprovalCreate(params: any) {
    const newAppr: PendingApproval = {
      id: `appr_${Math.floor(100 + Math.random() * 900)}`,
      actionType: (params.actionType as ApprovalActionType) || 'git.push',
      target: params.target || 'origin/main (commit e174e0c)',
      requestedBy: params.requestedBy || this.state.principal,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      riskLevel: 'high',
      justification: params.justification || 'Operator requested gated permission override.',
    };
    this.state = {
      ...this.state,
      approvals: [newAppr, ...this.state.approvals],
    };
    this.saveState(this.state);
    return { status: 'ok', approval: newAppr };
  }

  private handleApprove(params: any) {
    const approvalId = params.approvalId || params.id || this.state.approvals[0]?.id;
    if (!approvalId) {
      // Create a new approval if none exists
      const newAppr: PendingApproval = {
        id: `appr_${Math.floor(100 + Math.random() * 900)}`,
        actionType: (params.actionType as ApprovalActionType) || 'git.push',
        target: params.target || 'origin/main (commit e174e0c)',
        requestedBy: params.requestedBy || this.state.principal,
        requestedAt: new Date().toISOString(),
        status: 'approved',
        riskLevel: 'medium',
        justification: params.justification || 'Operator granted permit authorization.',
      };
      this.state = {
        ...this.state,
        approvals: [newAppr, ...this.state.approvals],
      };
      this.saveState(this.state);
      return { status: 'ok', approval: newAppr };
    }

    const updatedApprovals = this.state.approvals.map((a) => {
      if (a.id === approvalId) {
        return { ...a, status: 'approved' as ApprovalStatus };
      }
      return a;
    });

    const updatedStages = this.state.stages.map((st) => {
      if (st.id === 'human_gate') {
        return {
          ...st,
          status: 'Authorized',
          detail: `Action approved by operator console (${approvalId})`,
          state: 'complete' as const,
        };
      }
      return st;
    });

    this.state = { ...this.state, approvals: updatedApprovals, stages: updatedStages };
    this.saveState(this.state);

    return { status: 'ok', approvalId, result: 'Action approved and unlocked for remote push' };
  }

  private handleApprovalCancel(params: any) {
    const approvalId = params.approvalId || params.id || this.state.approvals[0]?.id;
    if (!approvalId) {
      return { status: 'error', message: 'No approval ID provided' };
    }

    const updatedApprovals = this.state.approvals.map((a) => {
      if (a.id === approvalId) {
        return { ...a, status: 'cancelled' as ApprovalStatus };
      }
      return a;
    });

    const updatedStages = this.state.stages.map((st) => {
      if (st.id === 'human_gate') {
        return {
          ...st,
          status: 'Cancelled',
          detail: `Approval ${approvalId} was cancelled by operator`,
          state: 'blocked' as const,
        };
      }
      return st;
    });

    this.state = { ...this.state, approvals: updatedApprovals, stages: updatedStages };
    this.saveState(this.state);

    return { status: 'ok', approvalId, result: 'Approval cancelled' };
  }

  public setModel(model: AIModelKey) {
    const updatedSummary = {
      ...this.state.creditSummary,
      activeModel: model,
      creditsSaved: calculateCreditEstimate(this.state.creditSummary.tokensSaved, model),
    };
    this.state = { ...this.state, activeModel: model, creditSummary: updatedSummary };
    this.saveState(this.state);
  }

  public setPrincipal(principal: string) {
    this.state = { ...this.state, principal };
    this.saveState(this.state);
  }

  public setSession(session: string) {
    this.state = { ...this.state, session };
    this.saveState(this.state);
  }

  public setTokenSaved(saved: boolean) {
    this.state = { ...this.state, tokenSaved: saved };
    this.saveState(this.state);
  }
}

export const rpcService = new PulpoRPCService();
