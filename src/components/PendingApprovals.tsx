import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  PlusCircle,
  GitCommit,
  Lock,
  ArrowUpRight,
  AlertTriangle,
  UserCheck,
  Zap,
} from 'lucide-react';
import { PendingApproval, ApprovalActionType } from '../types';

interface PendingApprovalsProps {
  approvals: PendingApproval[];
  onApprove: (approvalId: string) => void;
  onCancelApproval: (approvalId: string) => void;
  onCreateApproval: (actionType: ApprovalActionType, target: string, justification: string) => void;
}

export const PendingApprovals: React.FC<PendingApprovalsProps> = ({
  approvals,
  onApprove,
  onCancelApproval,
  onCreateApproval,
}) => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newActionType, setNewActionType] = useState<ApprovalActionType>('git.push');
  const [newTarget, setNewTarget] = useState<string>('origin/main (commit e174e0c)');
  const [newJustification, setNewJustification] = useState<string>(
    'Push signed evidence bundle and audited policy updates to trunk.'
  );

  const pendingList = approvals.filter((a) => a.status === 'pending');
  const historyList = approvals.filter((a) => a.status !== 'pending');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget.trim() || !newJustification.trim()) return;
    onCreateApproval(newActionType, newTarget, newJustification);
    setShowCreateModal(false);
  };

  return (
    <section
      id="pending-approvals-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-mono cyber-card"
    >
      <div>
        {/* Header */}
        <div className="px-4 py-2.5 bg-[#0C1A28]/40 border-b border-[#06B6D4]/20 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest">
              Gated Authority Interlock ({pendingList.length})
            </h2>
          </div>

          <button
            id="approvals-btn-create-toggle"
            onClick={() => setShowCreateModal(!showCreateModal)}
            className="text-[10px] font-bold uppercase text-[#00F0FF] hover:text-white flex items-center gap-1.5 bg-[#06B6D4]/15 hover:bg-[#06B6D4]/30 px-2.5 py-1 rounded-lg border border-[#06B6D4]/40 transition-colors cursor-pointer backdrop-blur-md"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Create Permit</span>
          </button>
        </div>

        {/* Create Approval Drawer */}
        {showCreateModal && (
          <form
            onSubmit={handleCreateSubmit}
            className="m-4 p-3.5 bg-[#08131E]/60 border border-[#06B6D4]/40 rounded-lg text-xs space-y-3 font-mono backdrop-blur-md"
          >
            <div className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#F59E0B]" />
              Request High-Risk Gated Authority Permit
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] text-[#64748B] uppercase font-bold mb-1">
                  Action Type
                </label>
                <select
                  value={newActionType}
                  onChange={(e) => setNewActionType(e.target.value as ApprovalActionType)}
                  className="w-full bg-[#0D1824]/60 border border-[#06B6D4]/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F0FF] backdrop-blur-md"
                >
                  <option value="git.push">git.push (Remote Push Interlock)</option>
                  <option value="policy.apply">policy.apply (Sandbox Rule Modification)</option>
                  <option value="permit.override">permit.override (Emergency Budget Bypass)</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] text-[#64748B] uppercase font-bold mb-1">Target</label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full bg-[#0D1824]/60 border border-[#06B6D4]/30 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00F0FF] backdrop-blur-md"
                  placeholder="e.g. origin/main"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-[#64748B] uppercase font-bold mb-1">
                Audit Justification Statement
              </label>
              <textarea
                rows={2}
                value={newJustification}
                onChange={(e) => setNewJustification(e.target.value)}
                className="w-full bg-[#0D1824]/60 border border-[#06B6D4]/30 rounded p-2 text-xs text-white focus:outline-none focus:border-[#00F0FF] backdrop-blur-md"
                placeholder="Explain the security rationale for this action..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1 bg-[#0D1824]/60 hover:bg-[#152535]/80 text-[#94A3B8] rounded text-xs backdrop-blur-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-black font-extrabold rounded text-xs shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              >
                Submit Permit
              </button>
            </div>
          </form>
        )}

        {/* Pending Items List */}
        <div className="p-4 space-y-2.5 max-h-[380px] overflow-y-auto">
          {pendingList.length === 0 ? (
            <div className="text-center py-6 text-[#64748B] text-xs">
              No actions currently waiting on human operator key authorization.
            </div>
          ) : (
            pendingList.map((appr) => (
              <div
                key={appr.id}
                id={`approval-item-${appr.id}`}
                className="p-3 rounded-lg border border-[#F59E0B]/40 bg-[#161208]/40 hover:bg-[#201A0B]/60 transition-all space-y-2 shadow-xs backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">
                      <Lock className="w-3 h-3" />
                    </span>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{appr.actionType}</span>
                        <span className="text-[9px] bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.2 rounded border border-[#F59E0B]/40">
                          GATED
                        </span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                        Target: <span className="text-[#00F0FF]">{appr.target}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#64748B] font-mono">
                    ID: {appr.id}
                  </div>
                </div>

                <p className="text-[11px] text-[#94A3B8] leading-snug bg-[#080E15]/50 p-2 rounded border border-[#06B6D4]/15 backdrop-blur-md">
                  {appr.justification}
                </p>

                <div className="pt-2 border-t border-[#F59E0B]/20 flex items-center justify-between gap-2">
                  <span className="text-[9px] text-[#64748B]">
                    Created: {appr.createdAt || appr.requestedAt || 'Active'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCancelApproval(appr.id)}
                      className="px-2.5 py-1 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 text-[#F87171] rounded text-[10px] font-bold uppercase transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onApprove(appr.id)}
                      className="px-3 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded text-[10px] font-extrabold uppercase transition-all shadow-[0_0_8px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                      Authorize Key (+120 XP)
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
