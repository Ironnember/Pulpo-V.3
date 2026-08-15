import React, { useState } from 'react';
import {
  Send,
  Play,
  Key,
  Save,
  GitBranch,
  GitCompare,
  CheckCheck,
  ShieldCheck,
  PackageCheck,
  Eye,
  EyeOff,
  Sparkles,
  Terminal,
  Cpu,
  Zap,
} from 'lucide-react';
import { AIModelKey } from '../types';

interface OperatePanelProps {
  intent: string;
  onChangeIntent: (val: string) => void;
  principal: string;
  onChangePrincipal: (val: string) => void;
  session: string;
  onChangeSession: (val: string) => void;
  activeModel: AIModelKey;
  tokenSaved: boolean;
  onSaveToken: (token: string) => void;
  onRepoStatus: () => void;
  onRepoDiff: () => void;
  onRunTests: () => void;
  onVerifyAudit: () => void;
  onBuildPacket: () => void;
  onSubmitTask: () => void;
  onRunNext: () => void;
  isProcessing?: boolean;
}

export const OperatePanel: React.FC<OperatePanelProps> = ({
  intent,
  onChangeIntent,
  principal,
  onChangePrincipal,
  session,
  onChangeSession,
  activeModel,
  tokenSaved,
  onSaveToken,
  onRepoStatus,
  onRepoDiff,
  onRunTests,
  onVerifyAudit,
  onBuildPacket,
  onSubmitTask,
  onRunNext,
  isProcessing = false,
}) => {
  const [tokenInput, setTokenInput] = useState<string>('••••••••••••••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveTokenClick = () => {
    onSaveToken(tokenInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmitTask();
    }
  };

  return (
    <section
      id="operate-panel-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-mono cyber-card"
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#0C1A28]/40 border-b border-[#06B6D4]/20 flex justify-between items-center backdrop-blur-md">
        <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00F0FF]" />
          Operator Microcontroller · Intent Injector
        </h2>
        <span className="text-[10px] font-mono text-[#64748B]">
          Active ASIC: <strong className="text-[#00F0FF]">{activeModel}</strong>
        </span>
      </div>

      {/* Panel Form Body */}
      <div className="p-4 flex-1 space-y-3.5">
        {/* Principal and Session Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="principal-input"
              className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block"
            >
              Operator Principal ID
            </label>
            <input
              id="principal-input"
              type="text"
              value={principal}
              onChange={(e) => onChangePrincipal(e.target.value)}
              className="w-full bg-[#080E15]/50 border border-[#06B6D4]/30 focus:border-[#00F0FF] px-2.5 py-1.5 rounded-lg text-xs font-mono text-white focus:outline-none transition-colors shadow-inner backdrop-blur-md"
              placeholder="e.g. chatgpt.board-manager"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="session-input"
              className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block"
            >
              Active Workspace Session
            </label>
            <input
              id="session-input"
              type="text"
              value={session}
              onChange={(e) => onChangeSession(e.target.value)}
              className="w-full bg-[#080E15]/50 border border-[#06B6D4]/30 focus:border-[#00F0FF] px-2.5 py-1.5 rounded-lg text-xs font-mono text-white focus:outline-none transition-colors shadow-inner backdrop-blur-md"
              placeholder="e.g. selfhost"
            />
          </div>
        </div>

        {/* Token Invariant Locker */}
        <div className="space-y-1 bg-[#080E15]/40 p-3 rounded-lg border border-[#06B6D4]/20 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <label
              htmlFor="token-input"
              className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider flex items-center gap-1.5"
            >
              <Key className="w-3 h-3 text-[#F59E0B]" />
              Sovereign API Access Token (Local Invariant Vault)
            </label>
            {tokenSaved && (
              <span className="text-[9px] text-[#34D399] font-bold uppercase bg-[#10B981]/20 px-1.5 py-0.2 rounded border border-[#10B981]/40">
                LOCKED IN SILICON
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                id="token-input"
                type={showPassword ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-[#0D1824]/50 border border-[#06B6D4]/30 focus:border-[#00F0FF] px-2.5 py-1.5 pr-8 rounded text-xs font-mono text-white focus:outline-none backdrop-blur-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#00F0FF] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              onClick={handleSaveTokenClick}
              className="px-3 py-1.5 bg-[#0D1824]/60 hover:bg-[#152535]/80 border border-[#06B6D4]/40 hover:border-[#00F0FF] text-[#00F0FF] rounded text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs backdrop-blur-md"
            >
              <Save className="w-3 h-3" />
              <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Governed Intent Editor */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="intent-textarea"
              className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block"
            >
              Governed Task Intent Prompt
            </label>
            <span className="text-[9px] text-[#64748B]">Ctrl+Enter to Execute</span>
          </div>
          <textarea
            id="intent-textarea"
            rows={3}
            value={intent}
            onChange={(e) => onChangeIntent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-[#080E15]/50 border border-[#06B6D4]/30 focus:border-[#00F0FF] p-2.5 rounded-lg text-xs font-mono text-white focus:outline-none leading-relaxed transition-colors shadow-inner backdrop-blur-md"
            placeholder="Type task intent description here..."
          />
        </div>

        {/* Primary Action Button Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            id="operate-btn-submit-task"
            onClick={onSubmitTask}
            disabled={isProcessing}
            className="p-2.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#10B981] hover:from-[#0891B2] hover:to-[#059669] text-black font-extrabold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            <span className="text-[10px] uppercase whitespace-nowrap">Submit Task</span>
          </button>

          <button
            id="operate-btn-build-packet"
            onClick={onBuildPacket}
            disabled={isProcessing}
            className="p-2.5 rounded-lg bg-[#0F1B27]/50 hover:bg-[#152535]/80 border border-[#06B6D4]/40 hover:border-[#00F0FF] text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50 backdrop-blur-md hover:scale-[1.02]"
          >
            <PackageCheck className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-[10px] uppercase whitespace-nowrap">Build Packet</span>
          </button>

          <button
            id="operate-btn-run-tests"
            onClick={onRunTests}
            disabled={isProcessing}
            className="p-2.5 rounded-lg bg-[#0F1B27]/50 hover:bg-[#152535]/80 border border-[#10B981]/40 hover:border-[#10B981] text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50 backdrop-blur-md hover:scale-[1.02]"
          >
            <CheckCheck className="w-4 h-4 text-[#34D399]" />
            <span className="text-[10px] uppercase whitespace-nowrap">Run Tests</span>
          </button>

          <button
            id="operate-btn-run-next"
            onClick={onRunNext}
            disabled={isProcessing}
            className="p-2.5 rounded-lg bg-[#0F1B27]/50 hover:bg-[#152535]/80 border border-[#F59E0B]/40 hover:border-[#F59E0B] text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs disabled:opacity-50 backdrop-blur-md hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-[10px] uppercase whitespace-nowrap">Run Next</span>
          </button>
        </div>

        {/* Secondary Invariant Verification Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#06B6D4]/20 text-[10px]">
          <div className="flex items-center gap-2">
            <button
              onClick={onRepoStatus}
              className="text-[#94A3B8] hover:text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <GitBranch className="w-3 h-3 text-[#00F0FF]" />
              <span>Inspect HEAD</span>
            </button>
            <span className="text-[#06B6D4]/30">|</span>
            <button
              onClick={onRepoDiff}
              className="text-[#94A3B8] hover:text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <GitCompare className="w-3 h-3 text-[#00F0FF]" />
              <span>AST Diff</span>
            </button>
          </div>

          <button
            onClick={onVerifyAudit}
            className="text-[#34D399] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Verify Audit Trail</span>
          </button>
        </div>
      </div>
    </section>
  );
};
