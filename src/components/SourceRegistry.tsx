import React from 'react';
import {
  FolderLock,
  PlusCircle,
  Files,
  CopyCheck,
  Shield,
  Layers,
  Sparkles,
  Hash,
  Cpu,
} from 'lucide-react';
import { PrivateSource } from '../types';

interface SourceRegistryProps {
  sources: PrivateSource[];
  onMakeTaskFromSource: (source: PrivateSource) => void;
}

export const SourceRegistry: React.FC<SourceRegistryProps> = ({
  sources,
  onMakeTaskFromSource,
}) => {
  return (
    <section
      id="source-registry-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-mono cyber-card"
    >
      {/* Header */}
      <div className="px-4 py-2.5 bg-[#0C1A28]/40 border-b border-[#06B6D4]/20 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2">
          <FolderLock className="w-3.5 h-3.5 text-[#00F0FF]" />
          <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest">
            Source Registry · Air-Gapped Sovereign Data Vaults ({sources.length})
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#34D399] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
          ZERO EXTERNAL EGRESS
        </span>
      </div>

      {/* Grid of 3 Private Sources */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {sources.map((source) => (
          <div
            key={source.id}
            id={`source-card-${source.id}`}
            className="p-3.5 rounded-lg border border-[#06B6D4]/25 bg-[#080E15]/40 hover:bg-[#0D1824]/60 hover:border-[#00F0FF]/60 transition-all flex flex-col justify-between gap-3 shadow-xs backdrop-blur-md"
          >
            <div>
              {/* Source Header */}
              <div className="flex items-start justify-between gap-1.5 mb-1.5">
                <div className="font-bold text-xs text-white truncate" title={source.name}>
                  {source.name}
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#00F0FF] font-bold shrink-0">
                  {source.classification}
                </span>
              </div>

              {/* Source Hash */}
              <div className="flex items-center gap-1 text-[10px] text-[#64748B] mb-2.5">
                <Hash className="w-2.5 h-2.5 text-[#00F0FF]" />
                <span className="bg-[#0D1824]/60 px-1.5 py-0.5 rounded text-[#00F0FF] truncate w-full border border-[#06B6D4]/20 backdrop-blur-md">
                  {source.hash}
                </span>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-1 p-2 rounded-lg bg-[#0D1824]/60 border border-[#06B6D4]/20 text-[10px] text-center mb-2.5 backdrop-blur-md">
                <div>
                  <div className="text-[#64748B] text-[8px] uppercase font-bold">Files</div>
                  <div className="font-bold text-white">{source.matchedFiles}</div>
                </div>
                <div>
                  <div className="text-[#34D399] text-[8px] uppercase font-bold">Unique</div>
                  <div className="font-bold text-[#34D399]">{source.uniqueBodies}</div>
                </div>
                <div>
                  <div className="text-[#F59E0B] text-[8px] uppercase font-bold">Dupes</div>
                  <div className="font-bold text-[#F59E0B]">{source.duplicateBodies}</div>
                </div>
              </div>

              {/* Category Counts Chips */}
              <div className="mb-2.5">
                <div className="text-[9px] uppercase font-bold text-[#64748B] mb-1">
                  Category Offsets:
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(source.categoryCounts).map(([cat, count]) => (
                    <span
                      key={cat}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-[#0D1824]/60 border border-[#06B6D4]/20 text-[#94A3B8] backdrop-blur-md"
                    >
                      {cat}: <strong className="text-white">{count}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Assessment Summary */}
              <div className="text-[10px] text-[#94A3B8] bg-[#0D1824]/60 p-2.5 rounded-lg border border-[#06B6D4]/20 leading-relaxed backdrop-blur-md">
                {source.assessment || source.assessmentSummary}
              </div>
            </div>

            {/* Make Task Button */}
            <button
              onClick={() => onMakeTaskFromSource(source)}
              className="w-full mt-1 py-1.5 px-2.5 bg-[#0F1B27]/60 hover:bg-[#152535]/80 border border-[#06B6D4]/40 hover:border-[#00F0FF] text-[#00F0FF] hover:text-white rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs backdrop-blur-md"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Synthesize Governed Task</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
