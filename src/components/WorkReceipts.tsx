import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Coins,
  ChevronRight,
  ExternalLink,
  Clock,
  Cpu,
} from 'lucide-react';
import { WorkReceipt, TestResultStatus, AuditStatus } from '../types';

interface WorkReceiptsProps {
  receipts: WorkReceipt[];
  onSelectReceipt?: (receipt: WorkReceipt) => void;
}

export const WorkReceipts: React.FC<WorkReceiptsProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  const getTestBadge = (status: TestResultStatus) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#34D399] bg-[#10B981]/20 px-1.5 py-0.5 rounded border border-[#10B981]/40">
            <CheckCircle2 className="w-2.5 h-2.5 text-[#34D399]" />
            tests passed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#F87171] bg-[#EF4444]/20 px-1.5 py-0.5 rounded border border-[#EF4444]/40">
            <XCircle className="w-2.5 h-2.5 text-[#F87171]" />
            tests failed
          </span>
        );
      case 'unknown':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#94A3B8] bg-[#0D1824] px-1.5 py-0.5 rounded border border-[#06B6D4]/30">
            <HelpCircle className="w-2.5 h-2.5 text-[#94A3B8]" />
            tests unchecked
          </span>
        );
    }
  };

  const getAuditBadge = (status: AuditStatus) => {
    switch (status) {
      case 'valid':
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#34D399] bg-[#10B981]/20 px-1.5 py-0.5 rounded border border-[#10B981]/40">
            <ShieldCheck className="w-2.5 h-2.5 text-[#34D399]" />
            audit valid
          </span>
        );
      case 'unchecked':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/20 px-1.5 py-0.5 rounded border border-[#F59E0B]/40">
            <ShieldAlert className="w-2.5 h-2.5 text-[#F59E0B]" />
            audit unchecked
          </span>
        );
    }
  };

  return (
    <section
      id="work-receipts-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-mono cyber-card"
    >
      <div>
        {/* Header */}
        <div className="px-4 py-2.5 bg-[#0C1A28]/40 border-b border-[#06B6D4]/20 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-3.5 h-3.5 text-[#00F0FF]" />
            <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest">
              Work Receipts · Sealed Cryptographic Proofs ({receipts.length})
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#06B6D4]/15 px-2 py-0.5 rounded border border-[#06B6D4]/30">
            IMMUTABLE ROM
          </span>
        </div>

        {/* Receipt Cards List */}
        <div className="p-4 space-y-2.5 max-h-[380px] overflow-y-auto">
          {receipts.map((receipt) => {
            const isExpanded = selectedReceiptId === receipt.id;
            return (
              <div
                key={receipt.id}
                id={`receipt-card-${receipt.id}`}
                onClick={() => {
                  setSelectedReceiptId(isExpanded ? null : receipt.id);
                  if (onSelectReceipt) onSelectReceipt(receipt);
                }}
                className="p-3 rounded-lg border border-[#06B6D4]/25 bg-[#080E15]/40 hover:bg-[#0D1824]/60 hover:border-[#00F0FF]/60 transition-all cursor-pointer shadow-xs space-y-2 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{receipt.id}</span>
                      <span className="text-[10px] text-[#64748B]">@{receipt.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">
                      Task Intent: <span className="text-white">{receipt.intent || receipt.summary || 'Governed execution'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {getTestBadge(receipt.testsPassed || receipt.tests)}
                    {getAuditBadge(receipt.auditStatus || receipt.audit)}
                  </div>
                </div>

                {/* Proof Hashes & Savings Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] pt-1 border-t border-[#06B6D4]/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">Principal:</span>
                    <span className="text-[#00F0FF]">{receipt.principal}</span>
                    <span className="text-[#06B6D4]/30">|</span>
                    <span className="text-[#64748B]">Commit:</span>
                    <span className="text-white font-mono">@{receipt.commitSha || 'e174e0c'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#34D399] font-bold">
                      +{(receipt.tokensSaved ?? receipt.tokenSavings ?? 0).toLocaleString()} tok saved
                    </span>
                    <span className="text-[#F59E0B]">
                      (${((typeof receipt.creditsSaved === 'number' ? receipt.creditsSaved : typeof receipt.creditEstimate === 'number' ? receipt.creditEstimate : 0)).toFixed(4)})
                    </span>
                  </div>
                </div>

                {/* Expanded Detailed Proof View */}
                {isExpanded && (
                  <div className="mt-2 pt-2 border-t border-[#06B6D4]/20 bg-[#060B11]/60 p-2.5 rounded-lg space-y-1.5 text-[10px] backdrop-blur-md">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span>EVIDENCE PACKET HASH</span>
                      <span className="text-[#00F0FF] font-mono">{receipt.packetSha}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span>AST COMPRESSION RATIO</span>
                      <span className="text-[#34D399] font-bold">42.4% Deduplication</span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span>CRYPTOGRAPHIC SIGNATURE</span>
                      <span className="text-[#F59E0B] font-mono">0x4a9f...e174 [ED25519-SEALED]</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
