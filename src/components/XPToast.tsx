import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Zap, CheckCircle2 } from 'lucide-react';
import { gamificationEngine, XPToastEvent } from '../lib/gamification';

export const XPToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<(XPToastEvent & { id: number })[]>([]);

  useEffect(() => {
    const unsub = gamificationEngine.subscribeToast((event) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev.slice(-3), { ...event, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3800);
    });

    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-6 z-50 flex flex-col gap-2 pointer-events-none font-mono">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto cyber-card ${
            toast.newLevel
              ? 'bg-[#0A1118]/95 border-[#F59E0B] text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'bg-[#0A1118]/95 border-[#06B6D4]/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              toast.newLevel
                ? 'bg-[#F59E0B] text-black shadow-[0_0_10px_#F59E0B]'
                : 'bg-[#06B6D4]/20 text-[#00F0FF] border border-[#06B6D4]/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
            }`}
          >
            {toast.newLevel ? (
              <Trophy className="w-4 h-4 text-black" />
            ) : (
              <Zap className="w-4 h-4 text-[#00F0FF]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black font-mono ${toast.newLevel ? 'text-[#F59E0B]' : 'text-[#00F0FF]'}`}>
                +{toast.amount} XP
              </span>
              {toast.newLevel && (
                <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.2 rounded font-bold uppercase border border-[#F59E0B]/40">
                  RANK PROMOTED
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#CBD5E1] font-medium leading-tight mt-0.5">
              {toast.reason}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
