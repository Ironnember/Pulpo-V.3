import { tourAudio } from './tourAudio';

export interface OperatorBadge {
  id: string;
  name: string;
  title?: string;
  category: 'Security' | 'Efficiency' | 'Pipeline' | 'Governance';
  icon: string;
  description: string;
  unlockedAt?: string;
  xpReward: number;
}

export interface OperatorQuest {
  id: string;
  title: string;
  category: 'Trust' | 'Pipeline' | 'Execution' | 'Economy' | 'Audit' | 'Governance';
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  actionHint: string;
}

export interface OperatorProfile {
  name: string;
  principal: string;
  xp: number;
  level: number;
  rankTitle: string;
  streakDays: number;
  totalActions: number;
  tokensSavedTotal: number;
  unlockedBadges: string[]; // Badge IDs
  completedQuests: string[]; // Quest IDs
  walkthroughCompleted: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  principal: string;
  avatar: string;
  level: number;
  rankTitle: string;
  xp: number;
  tokensSaved: number;
  streakDays: number;
  badgeCount: number;
  status: 'online' | 'active' | 'syncing';
  isUser: boolean;
}

export interface XPToastEvent {
  amount: number;
  reason: string;
  newLevel?: number;
}

export const OPERATOR_RANKS = [
  { level: 1, minXp: 0, title: 'Junior Auditor', badgeColor: '#6B7280' },
  { level: 2, minXp: 200, title: 'Pipeline Controller', badgeColor: '#475569' },
  { level: 3, minXp: 500, title: 'Cryptographic Verifier', badgeColor: '#4A5D4E' },
  { level: 4, minXp: 900, title: 'Sovereign Lead Architect', badgeColor: '#D97706' },
  { level: 5, minXp: 1400, title: 'Zero-Egress Master Custodian', badgeColor: '#1A1A1A' },
];

export const INITIAL_BADGES: OperatorBadge[] = [
  {
    id: 'badge-zero-egress',
    name: 'Zero-Egress Guardian',
    category: 'Security',
    icon: '🛡️',
    description: 'Verify local Git HEAD commit isolation and assert zero external cloud egress.',
    xpReward: 100,
  },
  {
    id: 'badge-token-squeezer',
    name: 'AST Token Squeezer',
    category: 'Efficiency',
    icon: '⚡',
    description: 'Compress AST payload diffs and save over 1,500 tokens in a single turn.',
    xpReward: 150,
  },
  {
    id: 'badge-loom-master',
    name: 'Loom Navigator',
    category: 'Pipeline',
    icon: '🧬',
    description: 'Inspect execution stages and verify all 7 deterministic pipeline fences.',
    xpReward: 100,
  },
  {
    id: 'badge-gatekeeper',
    name: 'Sovereign Gatekeeper',
    category: 'Governance',
    icon: '🔒',
    description: 'Review and approve/reject a sensitive gated permission request.',
    xpReward: 150,
  },
  {
    id: 'badge-audit-general',
    name: 'Auditor General',
    category: 'Security',
    icon: '📜',
    description: 'Inspect cryptographic Ed25519 root signatures and receipt audit chains.',
    xpReward: 120,
  },
  {
    id: 'badge-green-suite',
    name: '100% Green Certified',
    category: 'Pipeline',
    icon: '🧪',
    description: 'Run the full local governance test suite with zero regressions.',
    xpReward: 100,
  },
  {
    id: 'badge-tour-graduate',
    name: 'Certified Operator Graduate',
    category: 'Governance',
    icon: '🎓',
    description: 'Complete the complete interactive Virtual POV Walkthrough training.',
    xpReward: 250,
  },
];

export const ALL_ACHIEVEMENTS = INITIAL_BADGES;

export const INITIAL_QUESTS: OperatorQuest[] = [
  {
    id: 'quest-verify-trust',
    title: 'Verify Trust Anchor',
    category: 'Trust',
    description: 'Inspect the local Git HEAD (@e174e0c) and confirm clean working tree status.',
    xpReward: 75,
    completed: false,
    actionHint: 'Click "@e174e0c" in the top bar to inspect repository state',
  },
  {
    id: 'quest-inspect-stage',
    title: 'Inspect Loom Stage',
    category: 'Pipeline',
    description: 'Click any stage pill in the Evidence Loom to view its execution constraints.',
    xpReward: 75,
    completed: false,
    actionHint: 'Click "Intent", "Corpus Map", or "Sandbox" in the Evidence Loom',
  },
  {
    id: 'quest-switch-model',
    title: 'Explore Token Savings',
    category: 'Economy',
    description: 'Switch between GPT-5, Claude, or Gemini in the Compression Meter.',
    xpReward: 60,
    completed: false,
    actionHint: 'Click Claude 3.7 or GPT-5 rate cards to recalculate economy credits',
  },
  {
    id: 'quest-claim-task',
    title: 'Claim a Governed Task',
    category: 'Execution',
    description: 'Claim or run an autonomous task from the active Task Queue.',
    xpReward: 100,
    completed: false,
    actionHint: 'Click "Claim" or "Run" on any queued task in the Task Queue',
  },
  {
    id: 'quest-source-task',
    title: 'Spawn Task from Memory',
    category: 'Trust',
    description: 'Generate an autonomous task from the indexed private source registry.',
    xpReward: 90,
    completed: false,
    actionHint: 'Click "Make Task" on the core or governance memory corpus',
  },
  {
    id: 'quest-receipt-proof',
    title: 'Inspect Cryptographic Receipt',
    category: 'Audit',
    description: 'Expand a signed Ed25519 work receipt in the Work Receipts drawer.',
    xpReward: 80,
    completed: false,
    actionHint: 'Click any receipt card in the Work Receipts section to inspect proof details',
  },
  {
    id: 'quest-gate-action',
    title: 'Execute Gated Review',
    category: 'Audit',
    description: 'Approve, cancel, or create a gated permission request in Pending Approvals.',
    xpReward: 120,
    completed: false,
    actionHint: 'Click "Approve" or "Reject" on the gated git.push permit',
  },
  {
    id: 'quest-complete-tour',
    title: 'Complete Operator Walkthrough',
    category: 'Governance',
    description: 'Finish all 9 stations in the interactive Virtual POV Walkthrough.',
    xpReward: 200,
    completed: false,
    actionHint: 'Launch the Virtual Walkthrough and complete all training stations',
  },
];

const PEER_OPERATORS = [
  {
    id: 'peer-1',
    name: 'Elena Rostova',
    principal: 'elena.zero-trust',
    avatar: '🛡️',
    xp: 2840,
    tokensSaved: 14200,
    streakDays: 19,
    badgeCount: 7,
    status: 'online' as const,
  },
  {
    id: 'peer-2',
    name: 'Kai Takahashi',
    principal: 'kai.loom-controller',
    avatar: '🧬',
    xp: 1920,
    tokensSaved: 9800,
    streakDays: 14,
    badgeCount: 6,
    status: 'online' as const,
  },
  {
    id: 'peer-3',
    name: 'Zackariah Vance',
    principal: 'zack.ast-squeezer',
    avatar: '⚡',
    xp: 1650,
    tokensSaved: 8450,
    streakDays: 9,
    badgeCount: 5,
    status: 'active' as const,
  },
  {
    id: 'peer-4',
    name: 'Maya Lin',
    principal: 'maya.gate-officer',
    avatar: '🔒',
    xp: 820,
    tokensSaved: 4200,
    streakDays: 6,
    badgeCount: 4,
    status: 'online' as const,
  },
  {
    id: 'peer-5',
    name: 'Tariq Al-Mansoor',
    principal: 'tariq.audit-sentinel',
    avatar: '📜',
    xp: 430,
    tokensSaved: 2150,
    streakDays: 4,
    badgeCount: 3,
    status: 'syncing' as const,
  },
  {
    id: 'peer-6',
    name: 'Dev-Node-09',
    principal: 'bot.ci-auditor',
    avatar: '🤖',
    xp: 180,
    tokensSaved: 920,
    streakDays: 2,
    badgeCount: 2,
    status: 'active' as const,
  },
];

const STORAGE_KEY = 'pulpo_operator_gamification_v2';

class GamificationEngine {
  private profile: OperatorProfile;
  private listeners: ((profile: OperatorProfile) => void)[] = [];
  private toastListeners: ((event: XPToastEvent) => void)[] = [];

  constructor() {
    this.profile = this.loadProfile();
  }

  private getInitialProfile(): OperatorProfile {
    return {
      name: 'Operator You',
      principal: 'chatgpt.board-manager',
      xp: 220,
      level: 2,
      rankTitle: 'Pipeline Controller',
      streakDays: 3,
      totalActions: 16,
      tokensSavedTotal: 1587,
      unlockedBadges: ['badge-zero-egress'],
      completedQuests: ['quest-verify-trust'],
      walkthroughCompleted: false,
    };
  }

  private loadProfile(): OperatorProfile {
    if (typeof window === 'undefined') return this.getInitialProfile();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...this.getInitialProfile(),
          ...parsed,
        };
      }
    } catch {
      // Fallback
    }
    return this.getInitialProfile();
  }

  private saveProfile() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch {
      // Storage error
    }
    this.notify();
  }

  public getProfile(): OperatorProfile {
    return { ...this.profile };
  }

  public setPrincipal(principal: string) {
    this.profile.principal = principal;
    this.saveProfile();
  }

  public getRankForLevel(level: number) {
    return OPERATOR_RANKS.find((r) => r.level === level) || OPERATOR_RANKS[0];
  }

  public getNextRank(level: number) {
    return OPERATOR_RANKS.find((r) => r.level === level + 1) || null;
  }

  public getLeaderboard(): LeaderboardEntry[] {
    const userRankInfo = this.getRankForLevel(this.profile.level);
    const userEntry = {
      id: 'user-self',
      name: 'You (Local Operator)',
      principal: this.profile.principal,
      avatar: '👑',
      level: this.profile.level,
      rankTitle: userRankInfo.title,
      xp: this.profile.xp,
      tokensSaved: this.profile.tokensSavedTotal,
      streakDays: this.profile.streakDays,
      badgeCount: this.profile.unlockedBadges.length,
      status: 'online' as const,
      isUser: true,
    };

    const all = [
      userEntry,
      ...PEER_OPERATORS.map((p) => {
        let lvl = 1;
        for (const r of OPERATOR_RANKS) {
          if (p.xp >= r.minXp) lvl = r.level;
        }
        return {
          ...p,
          level: lvl,
          rankTitle: this.getRankForLevel(lvl).title,
          isUser: false,
        };
      }),
    ];

    all.sort((a, b) => b.xp - a.xp);

    return all.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  public subscribe(cb: (profile: OperatorProfile) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public subscribeToast(cb: (event: XPToastEvent) => void) {
    this.toastListeners.push(cb);
    return () => {
      this.toastListeners = this.toastListeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb({ ...this.profile }));
  }

  private notifyToast(event: XPToastEvent) {
    this.toastListeners.forEach((cb) => cb(event));
  }

  public addXP(amount: number, reason: string) {
    const oldLevel = this.profile.level;
    this.profile.xp += amount;
    this.profile.totalActions += 1;

    // Calculate new level
    let newLevel = 1;
    for (const rank of OPERATOR_RANKS) {
      if (this.profile.xp >= rank.minXp) {
        newLevel = rank.level;
      }
    }

    const currentRank = this.getRankForLevel(newLevel);
    this.profile.level = newLevel;
    this.profile.rankTitle = currentRank.title;

    if (newLevel > oldLevel) {
      tourAudio.playLevelUp();
      this.notifyToast({
        amount,
        reason: `LEVEL UP! Promoted to ${currentRank.title}`,
        newLevel,
      });
    } else {
      tourAudio.playQuestComplete();
      this.notifyToast({ amount, reason });
    }

    this.saveProfile();
  }

  public recordTokensSaved(tokens: number) {
    this.profile.tokensSavedTotal += tokens;
    this.saveProfile();
  }

  public completeQuest(questId: string) {
    if (this.profile.completedQuests.includes(questId)) return;

    const quest = INITIAL_QUESTS.find((q) => q.id === questId);
    if (!quest) return;

    this.profile.completedQuests.push(questId);
    this.addXP(quest.xpReward, `Quest Completed: ${quest.title}`);

    // Check badge unlocks
    if (questId === 'quest-verify-trust') {
      this.unlockBadge('badge-zero-egress');
    } else if (questId === 'quest-switch-model') {
      this.unlockBadge('badge-token-squeezer');
    } else if (questId === 'quest-inspect-stage') {
      this.unlockBadge('badge-loom-master');
    } else if (questId === 'quest-gate-action') {
      this.unlockBadge('badge-gatekeeper');
    } else if (questId === 'quest-receipt-proof') {
      this.unlockBadge('badge-audit-general');
    } else if (questId === 'quest-complete-tour') {
      this.profile.walkthroughCompleted = true;
      this.unlockBadge('badge-tour-graduate');
    }

    this.saveProfile();
  }

  public unlockBadge(badgeId: string) {
    if (this.profile.unlockedBadges.includes(badgeId)) return;

    const badge = INITIAL_BADGES.find((b) => b.id === badgeId);
    if (!badge) return;

    this.profile.unlockedBadges.push(badgeId);
    this.addXP(badge.xpReward, `Badge Unlocked: ${badge.name}`);
    this.saveProfile();
  }

  public resetProgress() {
    this.profile = this.getInitialProfile();
    this.saveProfile();
  }
}

export const gamificationEngine = new GamificationEngine();
