import React from 'react';
import {
  X,
  Award,
  Zap,
  Flame,
  ShieldCheck,
  Cpu,
  Lock,
  CheckCircle2,
  Trophy,
  History,
  Coins,
  GitBranch,
} from 'lucide-react';
import { OperatorProfile, gamificationEngine, ALL_ACHIEVEMENTS } from '../lib/gamification';

interface OperatorDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OperatorProfile;
}

export const OperatorDossierModal: React.FC<OperatorDossierModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  const currentRank = gamificationEngine.getRankForLevel(profile.level);
  const nextRank = gamificationEngine.getNextRank(profile.level);

  const currentXpBase = currentRank.minXp;
  const nextXpGoal = nextRank ? nextRank.minXp : profile.xp + 500;
  const xpSpan = Math.max(1, nextXpGoal - currentXpBase);
  const xpOffset = profile.xp - currentXpBase;
  const progressPercent = nextRank ? Math.min(100, Math.max(8, (xpOffset / xpSpan) * 100)) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
      <div className="bg-[#0A1118] border border-[#06B6D4]/40 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col animate-in fade-in zoom-in-95 duration-200 cyber-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0F1B27] border-b border-[#06B6D4]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F1E2E] to-[#08111A] border border-[#F59E0B]/60 text-white flex items-center justify-center text-xl shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              👑
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                Operator Silicon Dossier
                <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded border border-[#F59E0B]/40 font-bold">
                  GOVERNANCE PASS
                </span>
              </h2>
              <p className="text-[10px] text-[#94A3B8]">
                Deterministic cryptographic identity & achievement telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-[#152535] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Body */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          {/* Level & Rank Hero Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#081726] to-[#050D15] border border-[#06B6D4]/40 space-y-3 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">@{profile.name}</span>
                  <span className="text-[10px] bg-[#00F0FF]/20 text-[#00F0FF] px-2 py-0.5 rounded border border-[#00F0FF]/40 font-bold uppercase">
                    Level {profile.level} · {profile.rankTitle}
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                  Principal: {profile.principal}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="p-2 rounded-lg bg-[#0D1824] border border-[#06B6D4]/30 text-center">
                  <div className="text-[9px] text-[#64748B] uppercase font-bold">Total XP</div>
                  <div className="font-bold text-[#F59E0B] flex items-center gap-1 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                    {profile.xp.toLocaleString()}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#0D1824] border border-[#06B6D4]/30 text-center">
                  <div className="text-[9px] text-[#64748B] uppercase font-bold">Streak</div>
                  <div className="font-bold text-[#F59E0B] flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    {profile.streakDays} Days
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#0D1824] border border-[#10B981]/40 text-center">
                  <div className="text-[9px] text-[#64748B] uppercase font-bold">Tokens Saved</div>
                  <div className="font-bold text-[#34D399] mt-0.5">
                    {profile.tokensSavedTotal.toLocaleString()} tok
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Bar to Next Level */}
            <div className="space-y-1 pt-2 border-t border-[#06B6D4]/20">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#64748B]">
                  Current: <strong className="text-white">{profile.xp} XP</strong>
                </span>
                <span className="text-[#00F0FF] font-bold">
                  {nextRank ? `${nextXpGoal - profile.xp} XP to ${nextRank.title}` : 'Max Level'}
                </span>
              </div>
              <div className="w-full bg-[#0D1824] h-2.5 rounded-full overflow-hidden border border-[#06B6D4]/30">
                <div
                  className="bg-gradient-to-r from-[#06B6D4] via-[#10B981] to-[#F59E0B] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#00F0FF]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badges & Medals Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
              Sovereign Achievement Medals ({profile.unlockedBadges.length} / {ALL_ACHIEVEMENTS.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = profile.unlockedBadges.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-lg border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-[#081824] border-[#00F0FF]/50 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                        : 'bg-[#060B11] border-[#06B6D4]/15 opacity-60'
                    }`}
                  >
                    <div className="text-2xl shrink-0 p-1.5 rounded-lg bg-[#0D1824] border border-[#06B6D4]/30">
                      {ach.icon}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{ach.name || ach.title}</span>
                        {isUnlocked && (
                          <span className="text-[8px] bg-[#10B981]/20 text-[#34D399] px-1 py-0.2 rounded border border-[#10B981]/40 font-bold">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#94A3B8] leading-tight mt-1">
                        {ach.description}
                      </div>
                      <div className="text-[9px] text-[#F59E0B] font-bold mt-1.5">
                        +{ach.xpReward} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XP History Telemetry Log */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-[#94A3B8] tracking-wider flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-[#00F0FF]" />
              XP Telemetry Ledger
            </h3>

            <div className="bg-[#060B11] border border-[#06B6D4]/25 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5 text-xs">
              {profile.recentXpHistory && profile.recentXpHistory.length > 0 ? (
                profile.recentXpHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 border-b border-white/5 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#34D399] font-bold">+{item.amount} XP</span>
                      <span className="text-white">{item.reason}</span>
                    </div>
                    <span className="text-[10px] text-[#64748B]">{item.timestamp}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-[#64748B] text-xs">
                  No recent XP activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0F1B27] border-t border-[#06B6D4]/30 flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Cryptographic Operator Badge ID: #OP-88219-ZERO-EGRESS</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0D1824] hover:bg-[#152535] border border-[#06B6D4]/40 hover:border-[#00F0FF] text-[#00F0FF] rounded-lg text-xs font-bold uppercase cursor-pointer"
          >
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
