import React from 'react';
import {
  FileText,
  Shield,
  Coins,
  KeyRound,
  PlayCircle,
  FileCheck2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Sliders,
  Cpu,
  Zap,
} from 'lucide-react';
import { LoomStage, StageVisualState, StageId } from '../types';

interface EvidenceLoomProps {
  stages: LoomStage[];
  onSelectStage?: (stage: LoomStage) => void;
  selectedStageId?: StageId | null;
}

const getStageIcon = (id: StageId) => {
  switch (id) {
    case 'intent':
      return <FileText className="w-3.5 h-3.5" />;
    case 'policy':
      return <Shield className="w-3.5 h-3.5" />;
    case 'budget':
      return <Coins className="w-3.5 h-3.5" />;
    case 'permit':
      return <KeyRound className="w-3.5 h-3.5" />;
    case 'execute':
      return <PlayCircle className="w-3.5 h-3.5" />;
    case 'evidence':
      return <FileCheck2 className="w-3.5 h-3.5" />;
    case 'human_gate':
      return <UserCheck className="w-3.5 h-3.5" />;
    default:
      return <Sliders className="w-3.5 h-3.5" />;
  }
};

const getStateVisuals = (state: StageVisualState) => {
  switch (state) {
    case 'complete':
      return {
        bg: 'bg-[#081C14]/40 backdrop-blur-md',
        border: 'border-[#10B981]/40',
        text: 'text-[#34D399]',
        pillBg: 'bg-[#10B981]/20',
        pillText: 'text-[#34D399]',
        dotColor: 'bg-[#10B981]',
        icon: <CheckCircle2 className="w-3 h-3 text-[#10B981]" />,
        label: 'Complete',
      };
    case 'allowed':
      return {
        bg: 'bg-[#081F1A]/40 backdrop-blur-md',
        border: 'border-[#10B981]/30',
        text: 'text-[#34D399]',
        pillBg: 'bg-[#10B981]/20',
        pillText: 'text-[#34D399]',
        dotColor: 'bg-[#10B981]',
        icon: <CheckCircle2 className="w-3 h-3 text-[#10B981]" />,
        label: 'Allowed',
      };
    case 'ready':
      return {
        bg: 'bg-[#0A1A28]/40 backdrop-blur-md',
        border: 'border-[#06B6D4]/40',
        text: 'text-[#00F0FF]',
        pillBg: 'bg-[#06B6D4]/20',
        pillText: 'text-[#00F0FF]',
        dotColor: 'bg-[#00F0FF]',
        icon: <Clock className="w-3 h-3 text-[#00F0FF]" />,
        label: 'Ready',
      };
    case 'warning':
      return {
        bg: 'bg-[#1F1708]/40 backdrop-blur-md',
        border: 'border-[#F59E0B]/40',
        text: 'text-[#F59E0B]',
        pillBg: 'bg-[#F59E0B]/20',
        pillText: 'text-[#F59E0B]',
        dotColor: 'bg-[#F59E0B]',
        icon: <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />,
        label: 'Warning',
      };
    case 'blocked':
      return {
        bg: 'bg-[#220B0B]/40 backdrop-blur-md',
        border: 'border-[#EF4444]/40',
        text: 'text-[#F87171]',
        pillBg: 'bg-[#EF4444]/20',
        pillText: 'text-[#F87171]',
        dotColor: 'bg-[#EF4444]',
        icon: <XCircle className="w-3 h-3 text-[#EF4444]" />,
        label: 'Blocked',
      };
  }
};

export const EvidenceLoom: React.FC<EvidenceLoomProps> = ({
  stages,
  onSelectStage,
  selectedStageId,
}) => {
  return (
    <section
      id="evidence-loom-section"
      className="relative bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] font-mono cyber-card"
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#06B6D4]/20">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
          <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
            Evidence Loom · 4D Optical Silicon Bus Pipeline
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_4px_#10B981]" />
            7 Governed Stages
          </span>
          <span className="text-[#06B6D4]/30">|</span>
          <span className="text-[#00F0FF]">Optical Latency: 0.12ms</span>
        </div>
      </div>

      {/* 7-Stage Horizontal Pipeline with Optical Interconnects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {stages.map((stage, idx) => {
          const v = getStateVisuals(stage.state);
          const isSelected = selectedStageId === stage.id;

          return (
            <div
              key={stage.id}
              id={`loom-stage-${stage.id}`}
              onClick={() => onSelectStage && onSelectStage(stage)}
              className={`relative p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] shadow-sm group ${
                isSelected
                  ? 'ring-2 ring-[#00F0FF] bg-[#0E1F30] border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : `${v.bg} ${v.border} hover:border-[#00F0FF]/80 hover:bg-[#0E1D2B]`
              }`}
            >
              {/* Chip Corner IC Pins */}
              <span className="absolute -top-1 left-2 w-2 h-0.5 bg-[#F59E0B]" />
              <span className="absolute -top-1 right-2 w-2 h-0.5 bg-[#F59E0B]" />

              {/* Stage Header */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[9px] font-bold text-[#64748B] tracking-wider uppercase">
                    BUS-0{idx + 1}
                  </span>
                  <div className={`p-1 rounded ${v.pillBg} ${v.text} border border-current/30`}>
                    {getStageIcon(stage.id)}
                  </div>
                </div>

                <div className="font-bold text-xs text-white group-hover:text-[#00F0FF] transition-colors leading-tight">
                  {stage.title || stage.label}
                </div>
              </div>

              {/* Stage Status Pill & Detail */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${v.pillBg} ${v.text} border border-current/25`}
                >
                  {v.icon}
                  {v.label}
                </span>

                <span className="text-[9px] text-[#64748B] group-hover:text-[#00F0FF] transition-colors">
                  ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
