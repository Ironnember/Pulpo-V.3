import React, { useState } from 'react';
import {
  X,
  Trophy,
  Medal,
  Flame,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award,
  Crown,
  Search,
  Star,
} from 'lucide-react';
import { LeaderboardEntry, OperatorProfile } from '../lib/gamification';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentProfile: OperatorProfile;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentProfile,
}) => {
  const [filter, setFilter] = useState<'all' | 'weekly' | 'allTime'>('all');
  const [search, setSearch] = useState<string>('');

  if (!isOpen) return null;

  const filteredEntries = entries.filter((e) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return e.name.toLowerCase().includes(q) || e.principal.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md font-mono">
      <div className="bg-[#0A1118] border border-[#06B6D4]/40 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col animate-in fade-in zoom-in-95 duration-200 cyber-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0F1B27] border-b border-[#06B6D4]/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/50 flex items-center justify-center text-[#F59E0B]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                Sovereign Operator Leaderboard
                <span className="text-[10px] bg-[#00F0FF]/20 text-[#00F0FF] px-2 py-0.5 rounded border border-[#00F0FF]/40">
                  Global Matrix
                </span>
              </h2>
              <p className="text-[10px] text-[#94A3B8]">
                Verified by zero-egress cryptographic receipts & AST efficiency
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

        {/* Current Operator Fast Card */}
        <div className="px-5 py-3 bg-[#08121C] border-b border-[#06B6D4]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/60 text-[#00F0FF] flex items-center justify-center font-bold text-xs">
              #{currentProfile.rankNumber || 3}
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Your Standing</span>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>@{currentProfile.name}</span>
                <span className="text-[9px] bg-[#06B6D4]/20 text-[#00F0FF] px-1.5 py-0.2 rounded border border-[#06B6D4]/30">
                  LVL {currentProfile.level} · {currentProfile.rankTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div>
              <span className="text-[9px] text-[#64748B] uppercase block">Total XP</span>
              <span className="text-[#F59E0B] font-bold">{currentProfile.xp.toLocaleString()} XP</span>
            </div>
            <div>
              <span className="text-[9px] text-[#64748B] uppercase block">AST Squeezed</span>
              <span className="text-[#34D399] font-bold">
                {currentProfile.tokensSavedTotal.toLocaleString()} tok
              </span>
            </div>
            <div>
              <span className="text-[9px] text-[#64748B] uppercase block">Streak</span>
              <span className="text-[#F59E0B] font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                {currentProfile.streakDays}d
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-5 py-2.5 bg-[#0A1118] border-b border-[#06B6D4]/20 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3 h-3 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search operators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080E15] border border-[#06B6D4]/30 focus:border-[#00F0FF] pl-7 pr-3 py-1 rounded text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded uppercase font-bold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#00F0FF] text-black'
                  : 'bg-[#080E15] text-[#94A3B8] hover:text-white border border-[#06B6D4]/20'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('weekly')}
              className={`px-2.5 py-1 rounded uppercase font-bold transition-colors cursor-pointer ${
                filter === 'weekly'
                  ? 'bg-[#00F0FF] text-black'
                  : 'bg-[#080E15] text-[#94A3B8] hover:text-white border border-[#06B6D4]/20'
              }`}
            >
              Weekly Sprint
            </button>
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-230px)] space-y-2">
          {filteredEntries.map((entry, idx) => {
            const isCurrentUser = entry.name === currentProfile.name;
            return (
              <div
                key={entry.id}
                className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-all ${
                  isCurrentUser
                    ? 'bg-[#0E2235] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[#080E15] border-[#06B6D4]/20 hover:border-[#06B6D4]/50'
                }`}
              >
                {/* Rank & Identity */}
                <div className="flex items-center gap-3">
                  <div className="w-8 flex justify-center text-sm font-bold">
                    {idx === 0 ? (
                      <span className="text-[#F59E0B] text-lg">🥇</span>
                    ) : idx === 1 ? (
                      <span className="text-[#E2E8F0] text-lg">🥈</span>
                    ) : idx === 2 ? (
                      <span className="text-[#B45309] text-lg">🥉</span>
                    ) : (
                      <span className="text-[#64748B]">#{entry.rank}</span>
                    )}
                  </div>

                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>@{entry.name}</span>
                      {entry.badge && (
                        <span className="text-[9px] bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.2 rounded border border-[#F59E0B]/40 font-bold">
                          {entry.badge}
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="text-[9px] bg-[#00F0FF]/20 text-[#00F0FF] px-1.5 py-0.2 rounded border border-[#00F0FF]/40 font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">
                      {entry.title} · Level {entry.level}
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-xs font-mono text-right">
                  <div>
                    <div className="font-bold text-[#F59E0B] flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3" />
                      {entry.xp.toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-[#34D399]">
                      {entry.tokensSaved.toLocaleString()} tok saved
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[#F59E0B] text-[11px] font-bold bg-[#F59E0B]/10 px-2 py-1 rounded border border-[#F59E0B]/30">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{entry.streakDays}d</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0F1B27] border-t border-[#06B6D4]/30 flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Rankings update synchronously with local cryptographic proofs.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0D1824] hover:bg-[#152535] border border-[#06B6D4]/40 hover:border-[#00F0FF] text-[#00F0FF] rounded-lg text-xs font-bold uppercase cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
