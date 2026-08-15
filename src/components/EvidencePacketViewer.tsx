import React, { useState } from 'react';
import {
  Braces,
  Copy,
  Check,
  Code2,
  Terminal,
  Clock,
  ArrowRightLeft,
  ChevronDown,
  Layers,
  Cpu,
} from 'lucide-react';
import { RPCLogEntry } from '../types';

interface EvidencePacketViewerProps {
  latestPacket: {
    method: string;
    params: Record<string, any>;
    result: Record<string, any>;
    timestamp: string;
    durationMs: number;
  };
  rpcLogs: RPCLogEntry[];
  onSelectLogEntry?: (entry: RPCLogEntry) => void;
}

export const EvidencePacketViewer: React.FC<EvidencePacketViewerProps> = ({
  latestPacket,
  rpcLogs,
  onSelectLogEntry,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<'result' | 'params' | 'full' | 'history'>('result');

  const jsonString =
    viewTab === 'result'
      ? JSON.stringify(latestPacket.result, null, 2)
      : viewTab === 'params'
      ? JSON.stringify(latestPacket.params, null, 2)
      : JSON.stringify(
          {
            jsonrpc: '2.0',
            method: latestPacket.method,
            params: latestPacket.params,
            result: latestPacket.result,
            timestamp: latestPacket.timestamp,
            durationMs: latestPacket.durationMs,
          },
          null,
          2
        );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="evidence-packet-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-mono cyber-card"
    >
      <div>
        {/* Header */}
        <div className="px-4 py-2.5 bg-[#0C1A28]/40 border-b border-[#06B6D4]/20 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Braces className="w-3.5 h-3.5 text-[#00F0FF]" />
            <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest">
              Evidence Packet · JSON-RPC Quantum Bus
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-[10px] text-[#00F0FF] bg-[#06B6D4]/20 px-2 py-0.5 rounded border border-[#06B6D4]/40 font-bold uppercase">
              {latestPacket.method}
            </span>
            <span className="text-[10px] text-[#34D399] font-bold">
              {latestPacket.durationMs}ms
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* View Tabs & Copy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => setViewTab('result')}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  viewTab === 'result'
                    ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-[#080E15]/50 text-[#94A3B8] hover:text-white border border-[#06B6D4]/20 backdrop-blur-md'
                }`}
              >
                Result
              </button>
              <button
                onClick={() => setViewTab('params')}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  viewTab === 'params'
                    ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-[#080E15]/50 text-[#94A3B8] hover:text-white border border-[#06B6D4]/20 backdrop-blur-md'
                }`}
              >
                Params
              </button>
              <button
                onClick={() => setViewTab('full')}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  viewTab === 'full'
                    ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-[#080E15]/50 text-[#94A3B8] hover:text-white border border-[#06B6D4]/20 backdrop-blur-md'
                }`}
              >
                Full RPC Frame
              </button>
              <button
                onClick={() => setViewTab('history')}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-colors cursor-pointer ${
                  viewTab === 'history'
                    ? 'bg-[#00F0FF] text-black shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'bg-[#080E15]/50 text-[#94A3B8] hover:text-white border border-[#06B6D4]/20 backdrop-blur-md'
                }`}
              >
                Trace Log ({rpcLogs.length})
              </button>
            </div>

            {viewTab !== 'history' && (
              <button
                onClick={handleCopy}
                className="text-[10px] text-[#94A3B8] hover:text-[#00F0FF] flex items-center gap-1 cursor-pointer bg-[#0D1824]/60 px-2 py-1 rounded border border-[#06B6D4]/30 backdrop-blur-md"
              >
                {copied ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* JSON Viewer Body */}
          {viewTab === 'history' ? (
            <div className="bg-[#060B11]/50 border border-[#06B6D4]/30 rounded-lg p-2 max-h-[280px] overflow-y-auto space-y-1 text-xs backdrop-blur-md">
              {rpcLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => onSelectLogEntry && onSelectLogEntry(log)}
                  className="p-2 rounded hover:bg-[#0E1D2B]/70 cursor-pointer flex items-center justify-between text-[10px] transition-colors border-b border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00F0FF]">{log.method}</span>
                    <span className="text-[#64748B]">@{log.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#34D399] font-bold">{log.durationMs}ms</span>
                    <span className="text-[9px] bg-[#10B981]/20 text-[#34D399] px-1 rounded">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative bg-[#060B11]/50 border border-[#06B6D4]/30 rounded-lg p-3 max-h-[280px] overflow-y-auto text-xs shadow-inner backdrop-blur-md">
              <pre className="text-[#00F0FF] leading-relaxed font-mono whitespace-pre-wrap selection:bg-[#06B6D4]/30">
                {jsonString}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
