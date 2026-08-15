import React from 'react';
import {
  ShieldCheck,
  GitBranch,
  Cpu,
  Terminal,
  RefreshCw,
  Lock,
  Radio,
  SlidersHorizontal,
  Compass,
  Video,
  Trophy,
  Flame,
  Zap,
  Activity,
  Sparkles,
} from 'lucide-react';
import { RepoState, AIModelKey } from '../types';
import { OperatorProfile } from '../lib/gamification';

interface HeaderProps {
  repoState: RepoState;
  principal: string;
  session: string;
  activeModel: AIModelKey;
  tokenSaved: boolean;
  profile?: OperatorProfile;
  onRefresh: () => void;
  onOpenRepoStatus: () => void;
  onOpenAudit: () => void;
  onStartWalkthrough?: () => void;
  onOpenDossier?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  repoState,
  principal,
  session,
  activeModel,
  tokenSaved,
  profile,
  onRefresh,
  onOpenRepoStatus,
  onOpenAudit,
  onStartWalkthrough,
  onOpenDossier,
  onOpenLeaderboard,
}) => {
  return (
    <header
      id="pulpo-operator-header"
      className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#050A10]/50 backdrop-blur-xl border-b border-[#06B6D4]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] select-none transition-colors"
    >
      {/* Brand & System Identity */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-[#0A1622]/60 border border-[#06B6D4]/50 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <div className="w-2.5 h-2.5 bg-[#00F0FF] rounded-full shadow-[0_0_10px_#00F0FF] animate-pulse"></div>
            {/* Corner IC notches */}
            <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-[#00F0FF]" />
            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-[#00F0FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-white font-mono flex items-center gap-1.5">
                <span className="text-[#00F0FF]">PULPO</span>
                <span className="text-[10px] text-[#64748B] font-normal">CYBER-OS</span>
              </h1>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#06B6D4]/15 text-[#00F0FF] border border-[#06B6D4]/40 font-bold tracking-widest hidden sm:inline-block">
                ZERO-EGRESS
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] font-mono leading-none hidden md:block mt-0.5">
              4D Silicon Motherboard & Private Governance Vault
            </p>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-[#06B6D4]/20 hidden lg:block"></div>

        {/* Real-time State Indicators */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
          <button
            id="header-repo-head-btn"
            onClick={onOpenRepoStatus}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A1622]/40 hover:bg-[#0E2030]/60 border border-[#06B6D4]/30 text-[#E2E8F0] transition-all cursor-pointer shadow-xs hover:border-[#00F0FF]"
            title="Inspect Git Repository State"
          >
            <GitBranch className="w-3 h-3 text-[#00F0FF]" />
            <span className="text-[9px] text-[#94A3B8] uppercase">HEAD:</span>
            <span className="font-bold text-[#00F0FF]">@{repoState.head}</span>
            <span className="bg-[#10B981]/20 text-[#34D399] font-bold px-1 py-0.2 rounded text-[9px] border border-[#10B981]/40">
              CLEAN
            </span>
          </button>

          <button
            id="header-audit-status-btn"
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 text-[#34D399] transition-all cursor-pointer font-bold shadow-xs hover:border-[#34D399]"
            title="Cryptographic Audit Status"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="text-[10px] uppercase tracking-wider">Audit Valid</span>
          </button>
        </div>
      </div>

      {/* Operator Session Context & Quick Actions */}
      <div className="flex gap-2 sm:gap-2.5 items-center">
        {/* Gamified Operator Dossier Badge */}
        {profile && onOpenDossier && (
          <button
            id="header-btn-dossier"
            onClick={onOpenDossier}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0A1622]/40 hover:bg-[#0E2030]/60 border border-[#F59E0B]/40 hover:border-[#F59E0B] transition-all cursor-pointer font-mono shadow-xs"
            title="Open Operator Dossier & Governance Achievements"
          >
            <div className="w-5 h-5 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/60 text-[#F59E0B] flex items-center justify-center text-[10px] font-bold">
              {profile.level}
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] text-[#94A3B8] uppercase font-bold tracking-wider">
                {profile.rankTitle}
              </span>
              <span className="text-[11px] font-bold text-[#F59E0B] mt-0.5 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-[#F59E0B]" />
                {profile.xp} XP
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-0.5 text-[#F59E0B] text-[10px] font-bold pl-1 border-l border-[#06B6D4]/20">
              <Flame className="w-3 h-3 fill-[#F59E0B]" />
              <span>{profile.streakDays}d</span>
            </div>
          </button>
        )}

        {/* Leaderboard Quick Button */}
        {onOpenLeaderboard && (
          <button
            id="header-btn-leaderboard"
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#0A1622]/40 hover:bg-[#0E2030]/60 border border-[#06B6D4]/30 hover:border-[#00F0FF] text-[#E2E8F0] text-[11px] font-mono font-bold transition-all shadow-xs cursor-pointer"
            title="Open Sovereign Operator Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="hidden md:inline">Leaderboard</span>
          </button>
        )}

        {/* Virtual Walkthrough Launcher Button */}
        {onStartWalkthrough && (
          <button
            id="header-btn-start-walkthrough"
            onClick={onStartWalkthrough}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#10B981] hover:from-[#0891B2] hover:to-[#059669] text-black text-[11px] font-mono font-black uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer hover:scale-105"
            title="Launch 4D Tron Silicon Virtual Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">4D Tour</span>
          </button>
        )}

        <button
          id="header-refresh-btn"
          onClick={onRefresh}
          className="p-1.5 rounded bg-[#0A1622]/40 hover:bg-[#0E2030]/60 border border-[#06B6D4]/30 text-[#94A3B8] hover:text-[#00F0FF] hover:border-[#00F0FF] transition-all cursor-pointer shadow-xs"
          title="Refresh Governance Overview & Voltage"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
