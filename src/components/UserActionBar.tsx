import React from 'react';
import {
  ShieldCheck,
  Zap,
  TestTube,
  FileCheck,
  Trophy,
  Sparkles,
  ChevronRight,
  Flame,
  HelpCircle,
  Cpu,
  Radio,
  Sliders,
} from 'lucide-react';
import { OperatorProfile, gamificationEngine } from '../lib/gamification';

interface UserActionBarProps {
  profile: OperatorProfile;
  onOpenSecurityAudit: () => void;
  onOpenTests: () => void;
  onOpenReceipts: () => void;
  onOpenLeaderboard: () => void;
  onOpenDossier: () => void;
  onLaunchTour: () => void;
  onQuickSqueeze: () => void;
}

export const UserActionBar: React.FC<UserActionBarProps> = ({
  profile,
  onOpenSecurityAudit,
  onOpenTests,
  onOpenReceipts,
  onOpenLeaderboard,
  onOpenDossier,
  onLaunchTour,
  onQuickSqueeze,
}) => {
  const currentRank = gamificationEngine.getRankForLevel(profile.level);
  const nextRank = gamificationEngine.getNextRank(profile.level);

  const currentXpBase = currentRank.minXp;
  const nextXpGoal = nextRank ? nextRank.minXp : profile.xp + 500;
  const xpSpan = Math.max(1, nextXpGoal - currentXpBase);
  const xpOffset = profile.xp - currentXpBase;
  const progressPercent = nextRank ? Math.min(100, Math.max(8, (xpOffset / xpSpan) * 100)) : 100;

  return (
    <section className="relative bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl p-3 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] font-mono space-y-3 cyber-card">
      {/* Decorative Gold IC Pins on Top and Bottom edges */}
      <div className="absolute -top-1 left-8 w-6 h-1 bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
      <div className="absolute -top-1 right-8 w-6 h-1 bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />

      {/* Top row: User Identity & Live XP Progress Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#06B6D4]/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDossier}
            className="w-10 h-10 rounded-xl bg-[#0F1E2E]/60 border border-[#F59E0B]/60 text-white flex items-center justify-center text-lg hover:scale-105 transition-transform cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.3)] backdrop-blur-md"
            title="Open Operator Dossier & Microchip Credentials"
          >
            👑
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <span className="text-[#00F0FF]">@</span>
                {profile.name}
              </span>
              <span className="bg-[#06B6D4]/20 text-[#00F0FF] border border-[#06B6D4]/40 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                LVL {profile.level} · {profile.rankTitle}
              </span>
              <span className="text-[10px] text-[#64748B] hidden sm:inline">
                [{profile.principal}]
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#94A3B8] mt-0.5">
              <span className="flex items-center gap-1 text-[#F59E0B] font-semibold text-[11px]">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {profile.streakDays}-Day Streak
              </span>
              <span className="text-[#06B6D4]/40">·</span>
              <span className="text-[11px] text-[#34D399] font-semibold">{profile.tokensSavedTotal.toLocaleString()} Tok Saved</span>
              <span className="text-[#06B6D4]/40">·</span>
              <span className="text-[#00F0FF] font-bold text-[11px]">{profile.unlockedBadges.length} Medals</span>
            </div>
          </div>
        </div>

        {/* Live XP Bar & Leaderboard Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            onClick={onOpenLeaderboard}
            className="flex-1 md:w-64 bg-[#080E15]/50 border border-[#06B6D4]/30 p-2 rounded-lg cursor-pointer hover:border-[#00F0FF] transition-all shadow-inner backdrop-blur-md"
            title="Click to view full Leaderboard"
          >
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="font-bold text-[#F59E0B] flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#F59E0B]" />
                {profile.xp} Total XP
              </span>
              <span className="text-[#64748B]">
                {nextRank ? `${nextXpGoal - profile.xp} XP to Lvl ${profile.level + 1}` : 'Max Rank Reached'}
              </span>
            </div>
            <div className="w-full bg-[#132230]/40 h-2 rounded-full overflow-hidden border border-[#06B6D4]/20">
              <div
                className="bg-gradient-to-r from-[#06B6D4] via-[#10B981] to-[#F59E0B] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#06B6D4]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={onOpenLeaderboard}
            className="px-3 py-2 bg-[#0D1824]/50 hover:bg-[#152535]/70 border border-[#F59E0B]/40 hover:border-[#F59E0B] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs backdrop-blur-md"
            title="View Peer Leaderboard"
          >
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>
        </div>
      </div>

      {/* User-Focused 1-Click Simple Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={onOpenSecurityAudit}
          className="p-2.5 rounded-lg bg-[#08111A]/40 hover:bg-[#0D1C2B]/60 border border-[#10B981]/40 hover:border-[#10B981] text-left transition-all cursor-pointer group shadow-xs backdrop-blur-md hover:scale-[1.02]"
          title="Run 1-Click Zero-Egress Security & Cryptographic Audit"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 rounded bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-[#34D399] bg-[#10B981]/20 px-1.5 py-0.2 rounded border border-[#10B981]/40">
              +75 XP
            </span>
          </div>
          <div className="font-bold text-xs text-white group-hover:text-[#34D399] transition-colors whitespace-nowrap">
            1-Click Trust Check
          </div>
          <div className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">
            Zero external egress audit
          </div>
        </button>

        <button
          onClick={onQuickSqueeze}
          className="p-2.5 rounded-lg bg-[#08111A]/40 hover:bg-[#0D1C2B]/60 border border-[#F59E0B]/40 hover:border-[#F59E0B] text-left transition-all cursor-pointer group shadow-xs backdrop-blur-md hover:scale-[1.02]"
          title="Apply 42% AST Token Deduplication Compression"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-[#F59E0B] bg-[#F59E0B]/20 px-1.5 py-0.2 rounded border border-[#F59E0B]/40">
              +150 XP
            </span>
          </div>
          <div className="font-bold text-xs text-white group-hover:text-[#F59E0B] transition-colors whitespace-nowrap">
            Save Token Costs
          </div>
          <div className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">
            42% AST deduplication
          </div>
        </button>

        <button
          onClick={onOpenTests}
          className="p-2.5 rounded-lg bg-[#08111A]/40 hover:bg-[#0D1C2B]/60 border border-[#06B6D4]/40 hover:border-[#00F0FF] text-left transition-all cursor-pointer group shadow-xs backdrop-blur-md hover:scale-[1.02]"
          title="Run Local Deterministic Invariant Test Suite"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 rounded bg-[#06B6D4]/20 text-[#00F0FF] border border-[#06B6D4]/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              <TestTube className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-bold text-[#00F0FF] bg-[#06B6D4]/20 px-1.5 py-0.2 rounded border border-[#06B6D4]/40">
              +100 XP
            </span>
          </div>
          <div className="font-bold text-xs text-white group-hover:text-[#00F0FF] transition-colors whitespace-nowrap">
            Run Test Suite
          </div>
          <div className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">
            4 Deterministic checks
          </div>
        </button>

        <button
          onClick={onLaunchTour}
          className="p-2.5 rounded-lg bg-[#08111A]/40 hover:bg-[#0D1C2B]/60 border border-[#00F0FF]/40 hover:border-[#00F0FF] text-left transition-all cursor-pointer group shadow-xs backdrop-blur-md hover:scale-[1.02]"
          title="Dive into Tron Singularity & 4D Motherboard Tour"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="p-1 rounded bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-spin" />
            </div>
            <span className="text-[9px] font-bold text-[#00F0FF] bg-[#00F0FF]/20 px-1.5 py-0.2 rounded border border-[#00F0FF]/40">
              +250 XP
            </span>
          </div>
          <div className="font-bold text-xs text-[#00F0FF] group-hover:text-white transition-colors whitespace-nowrap">
            4D Warp Tour
          </div>
          <div className="text-[10px] text-[#94A3B8] leading-tight mt-0.5">
            Singularity silicon tour
          </div>
        </button>
      </div>
    </section>
  );
};
