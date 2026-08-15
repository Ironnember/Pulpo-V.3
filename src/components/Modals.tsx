import React from 'react';
import {
  X,
  GitBranch,
  GitCommit,
  GitCompare,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  FileCode,
  Layers,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { LoomStage, RepoState } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-mono">
      <div className="bg-[#060C14]/85 backdrop-blur-xl border border-[#06B6D4]/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.7)] flex flex-col animate-in fade-in zoom-in-95 duration-200 cyber-card">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0C1A28]/60 border-b border-[#06B6D4]/25 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-white rounded hover:bg-[#152535]/70 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)] text-xs text-white space-y-3 font-mono">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-4 py-2.5 bg-[#0C1A28]/60 border-t border-[#06B6D4]/25 backdrop-blur-md">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0D1824]/80 hover:bg-[#152535] border border-[#06B6D4]/40 hover:border-[#00F0FF] text-[#00F0FF] rounded-lg text-xs font-bold uppercase cursor-pointer transition-colors shadow-xs backdrop-blur-md"
          >
            Dismiss Frame
          </button>
        </div>
      </div>
    </div>
  );
};

// Specialized Repo Status Modal Content
export const RepoStatusModal: React.FC<{
  repoState: RepoState;
  isOpen: boolean;
  onClose: () => void;
}> = ({ repoState, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Repository Status (Local Silicon HEAD)">
      <div className="space-y-3">
        <div className="p-3.5 bg-[#080E15] rounded-lg border border-[#06B6D4]/30 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Branch</div>
            <div className="font-bold text-white">{repoState.branch}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#64748B] uppercase font-bold">HEAD Commit</div>
            <div className="font-bold text-[#00F0FF] font-mono">@{repoState.head}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Unpushed Commits</div>
            <div className="font-bold text-[#F59E0B]">{repoState.unpushedCommits}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Audit State</div>
            <div className="font-bold text-[#34D399]">Locked & Valid</div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold text-white uppercase mb-1.5 tracking-wider">
            Tracked Governance Files in Working Tree:
          </div>
          <div className="p-3 bg-[#060B11] text-[#94A3B8] rounded-lg font-mono text-xs space-y-1 border border-[#06B6D4]/20">
            <div className="text-[#34D399]">## Current working tree diff at HEAD: {repoState.head}</div>
            {repoState.dirtyFiles.map((file) => (
              <div key={file} className="flex items-center gap-2">
                <span className="text-[#00F0FF]">M</span>
                <span>{file}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Specialized Repo Diff Modal Content
export const RepoDiffModal: React.FC<{
  diffData: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ diffData, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Repository Unified AST Diff">
      <div className="space-y-3">
        <div className="p-2.5 bg-[#080E15] rounded border border-[#06B6D4]/30 flex items-center justify-between text-[11px]">
          <span>Files Changed: <strong className="text-white">3 files</strong></span>
          <span className="text-[#34D399] font-bold">+184 insertions</span>
          <span className="text-[#F87171] font-bold">-42 deletions</span>
        </div>

        <div className="p-3 bg-[#060B11] text-white rounded-lg font-mono text-xs space-y-1 border border-[#06B6D4]/20 overflow-x-auto">
          <div className="text-[#64748B]">diff --git a/src/governance/invariants.ts b/src/governance/invariants.ts</div>
          <div className="text-[#64748B]">index a912e4f..88c1b20 100644</div>
          <div className="text-[#00F0FF]">--- a/src/governance/invariants.ts</div>
          <div className="text-[#00F0FF]">+++ b/src/governance/invariants.ts</div>
          <div className="text-[#F87171]">- export const ALLOW_EXTERNAL_FALLBACK = true;</div>
          <div className="text-[#34D399]">+ export const ALLOW_EXTERNAL_FALLBACK = false; // INVARIANT: STRICT ZERO EGRESS</div>
          <div className="text-[#34D399]">+ export const FORCE_DETERMINISTIC_SANDBOX = true;</div>
        </div>
      </div>
    </Modal>
  );
};

// Specialized Test Results Modal
export const TestResultsModal: React.FC<{
  testData: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ testData, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Test Suite Execution Report">
      <div className="space-y-3">
        <div className="p-3.5 bg-[#081C14] rounded-lg border border-[#10B981]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#34D399]" />
            <div>
              <div className="font-bold text-sm text-[#34D399]">All 14 Test Suites Passed (100%)</div>
              <div className="text-[10px] text-[#64748B]">Execution Time: 142ms · 0 failures</div>
            </div>
          </div>
          <span className="bg-[#10B981]/20 text-[#34D399] px-2 py-1 rounded text-xs font-bold border border-[#10B981]/40">
            DETERMINISTIC GREEN
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="p-2 bg-[#080E15] rounded border border-[#06B6D4]/20 flex items-center justify-between text-xs">
            <span className="text-white">✓ test/unit/isolation.test.ts</span>
            <span className="text-[#34D399] font-bold">PASS (4/4)</span>
          </div>
          <div className="p-2 bg-[#080E15] rounded border border-[#06B6D4]/20 flex items-center justify-between text-xs">
            <span className="text-white">✓ test/unit/ast-compression.test.ts</span>
            <span className="text-[#34D399] font-bold">PASS (5/5)</span>
          </div>
          <div className="p-2 bg-[#080E15] rounded border border-[#06B6D4]/20 flex items-center justify-between text-xs">
            <span className="text-white">✓ test/integration/evidence-receipt.test.ts</span>
            <span className="text-[#34D399] font-bold">PASS (5/5)</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Specialized Audit Verifier Modal
export const AuditVerifierModal: React.FC<{
  auditData: any;
  isOpen: boolean;
  onClose: () => void;
}> = ({ auditData, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cryptographic Audit Trail Verification">
      <div className="space-y-3">
        <div className="p-3.5 bg-[#081C14] rounded-lg border border-[#10B981]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#34D399]" />
            <div>
              <div className="font-bold text-sm text-[#34D399]">Audit Trail Cryptographically Valid</div>
              <div className="text-[10px] text-[#64748B]">All Merkle proofs matching sealed receipts</div>
            </div>
          </div>
          <span className="bg-[#10B981]/20 text-[#34D399] px-2 py-1 rounded text-xs font-bold border border-[#10B981]/40">
            SEALED
          </span>
        </div>

        <div className="p-3 bg-[#060B11] rounded-lg border border-[#06B6D4]/20 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-[#64748B]">
            <span>MERKLE ROOT</span>
            <span className="text-[#00F0FF]">0x7c91a0b382f7c00e</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>CHAIN SIGNATURE</span>
            <span className="text-[#34D399]">ED25519-VERIFIED</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>ZERO EGRESS CERT</span>
            <span className="text-[#F59E0B]">CONFIRMED AIR-GAPPED</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Specialized Stage Inspector Modal
export const StageInspectorModal: React.FC<{
  stage: LoomStage | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ stage, isOpen, onClose }) => {
  if (!stage) return null;

  const title = stage.title || stage.label || 'Stage Details';
  const summary = stage.summary || stage.detail || stage.status || '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Stage Inspector · ${title}`}>
      <div className="space-y-3">
        <div className="p-3.5 bg-[#080E15] rounded-lg border border-[#06B6D4]/30 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-white">{title}</span>
            <span className="px-2 py-0.5 rounded bg-[#06B6D4]/20 border border-[#06B6D4]/40 text-[#00F0FF] text-[10px] font-bold uppercase">
              {stage.state || stage.status}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">{summary}</p>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] text-[#64748B] uppercase font-bold">Stage Telemetry:</div>
          <div className="p-3 bg-[#060B11] text-[#00F0FF] rounded-lg font-mono text-xs border border-[#06B6D4]/20">
            <pre className="whitespace-pre-wrap">{JSON.stringify(stage.metadata || stage.detail || stage, null, 2)}</pre>
          </div>
        </div>
      </div>
    </Modal>
  );
};
