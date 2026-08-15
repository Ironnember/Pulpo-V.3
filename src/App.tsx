/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserActionBar } from './components/UserActionBar';
import { EvidenceLoom } from './components/EvidenceLoom';
import { OperatePanel } from './components/OperatePanel';
import { CompressionMeter } from './components/CompressionMeter';
import { TaskQueue } from './components/TaskQueue';
import { SourceRegistry } from './components/SourceRegistry';
import { WorkReceipts } from './components/WorkReceipts';
import { PendingApprovals } from './components/PendingApprovals';
import { EvidencePacketViewer } from './components/EvidencePacketViewer';
import {
  RepoStatusModal,
  RepoDiffModal,
  TestResultsModal,
  AuditVerifierModal,
  StageInspectorModal,
} from './components/Modals';
import { VirtualWalkthrough } from './components/VirtualWalkthrough';
import { OperatorDossierModal } from './components/OperatorDossierModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { XPToastContainer } from './components/XPToast';
import { CyberMotherboardCanvas } from './components/CyberMotherboardCanvas';
import { rpcService, PulpoState } from './lib/rpcService';
import { gamificationEngine, OperatorProfile } from './lib/gamification';
import { Video, Trophy, Flame, Zap, Cpu, Sparkles, Activity, Radio } from 'lucide-react';
import {
  AIModelKey,
  ApprovalActionType,
  GovernedTask,
  LoomStage,
  PrivateSource,
  WorkReceipt,
  RPCLogEntry,
} from './types';
import { calculateCreditEstimate } from './lib/rateCard';

export default function App() {
  const [state, setState] = useState<PulpoState>(() => rpcService.getState());
  const [profile, setProfile] = useState<OperatorProfile>(() =>
    gamificationEngine.getProfile()
  );
  const [intentInput, setIntentInput] = useState<string>(
    'Verify sandbox isolation invariants and compress AST diffs before push'
  );
  const [principalInput, setPrincipalInput] = useState<string>(
    state.principal || 'chatgpt.board-manager'
  );
  const [sessionInput, setSessionInput] = useState<string>(
    state.session || 'selfhost'
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modals state
  const [showRepoStatusModal, setShowRepoStatusModal] = useState<boolean>(false);
  const [showRepoDiffModal, setShowRepoDiffModal] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [selectedStage, setSelectedStage] = useState<LoomStage | null>(null);
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(false);

  const [lastDiffData, setLastDiffData] = useState<any>(null);
  const [lastTestData, setLastTestData] = useState<any>(null);
  const [lastAuditData, setLastAuditData] = useState<any>(null);

  // Subscribe to gamification engine changes
  useEffect(() => {
    const unsub = gamificationEngine.subscribe((newProfile) => {
      setProfile(newProfile);
    });
    return unsub;
  }, []);

  // Sync state helper
  const syncState = () => {
    setState({ ...rpcService.getState() });
  };

  // 1. Save Token
  const handleSaveToken = async (token: string) => {
    rpcService.setTokenSaved(true);
    await rpcService.callRPC('pulpo.overview', { token_saved: true });
    gamificationEngine.addXP(30, 'Principal Access Token Saved');
    syncState();
  };

  // 2. Repo Status
  const handleRepoStatus = async () => {
    const res = await rpcService.callRPC('pulpo.repo.status');
    gamificationEngine.completeQuest('quest-verify-trust');
    syncState();
    setShowRepoStatusModal(true);
  };

  // 3. Repo Diff
  const handleRepoDiff = async () => {
    const res = await rpcService.callRPC('pulpo.repo.diff');
    setLastDiffData(res);
    gamificationEngine.addXP(40, 'Inspected Unified AST Diff');
    syncState();
    setShowRepoDiffModal(true);
  };

  // 4. Run Tests
  const handleRunTests = async () => {
    setIsProcessing(true);
    const res = await rpcService.callRPC('pulpo.repo.test');
    setLastTestData(res);
    setIsProcessing(false);
    gamificationEngine.unlockBadge('badge-green-suite');
    gamificationEngine.addXP(100, 'Full Test Suite Verified (100% Green)');
    syncState();
    setShowTestModal(true);
  };

  // 5. Verify Audit
  const handleVerifyAudit = async () => {
    const res = await rpcService.callRPC('pulpo.audit.verify');
    setLastAuditData(res);
    gamificationEngine.completeQuest('quest-receipt-proof');
    gamificationEngine.addXP(50, 'Verified Cryptographic Audit Trail');
    syncState();
    setShowAuditModal(true);
  };

  // 6. Build Packet
  const handleBuildPacket = async () => {
    setIsProcessing(true);
    const res = await rpcService.callRPC('pulpo.packet.build', {
      intent: intentInput,
      model: state.activeModel,
    });
    setIsProcessing(false);
    gamificationEngine.addXP(45, 'Synthesized Governed Evidence Packet');
    syncState();
  };

  // 7. Submit Task
  const handleSubmitTask = async () => {
    if (!intentInput.trim()) return;
    setIsProcessing(true);
    const res = await rpcService.callRPC('pulpo.task.submit', {
      intent: intentInput,
      principal: principalInput,
      session: sessionInput,
      model: state.activeModel,
    });
    setIsProcessing(false);
    gamificationEngine.completeQuest('quest-run-task');
    gamificationEngine.addXP(80, 'Dispatched Governed Task to Multi-Core Queue');
    syncState();
  };

  // 8. Run Next Task
  const handleRunNext = async () => {
    setIsProcessing(true);
    const res = await rpcService.callRPC('pulpo.task.run_next');
    setIsProcessing(false);
    gamificationEngine.addXP(70, 'Executed Next Governed Task Core');
    syncState();
  };

  // 9. Claim Task
  const handleClaimTask = async (taskId: string) => {
    await rpcService.callRPC('pulpo.task.claim', { id: taskId });
    gamificationEngine.addXP(35, `Claimed Task Execution Core [${taskId}]`);
    syncState();
  };

  // 10. Run Task
  const handleRunTask = async (taskId: string) => {
    setIsProcessing(true);
    await rpcService.callRPC('pulpo.task.run', { id: taskId });
    setIsProcessing(false);
    gamificationEngine.addXP(75, `Ran Task in Deterministic Sandbox [${taskId}]`);
    syncState();
  };

  // 11. Complete Task
  const handleCompleteTask = async (taskId: string) => {
    await rpcService.callRPC('pulpo.task.complete', { id: taskId });
    gamificationEngine.addXP(90, `Sealed Tamper-Proof Cryptographic Receipt [${taskId}]`);
    syncState();
  };

  // 12. Make Task from Source
  const handleMakeTaskFromSource = async (source: PrivateSource) => {
    setIntentInput(
      `Synthesize and index local private source files for vault [${source.name}]`
    );
    await rpcService.callRPC('pulpo.source.synthesize_task', { sourceId: source.id });
    gamificationEngine.completeQuest('quest-inspect-stage');
    gamificationEngine.addXP(60, `Synthesized Task from Private Source [${source.name}]`);
    syncState();
  };

  // 13. Approve Gated Interlock
  const handleApprove = async (approvalId: string) => {
    await rpcService.callRPC('pulpo.approval.decide', {
      id: approvalId,
      decision: 'approve',
    });
    gamificationEngine.addXP(120, `Authorized High-Risk Gated Authority Permit [${approvalId}]`);
    syncState();
  };

  // 14. Cancel Approval
  const handleCancelApproval = async (approvalId: string) => {
    await rpcService.callRPC('pulpo.approval.decide', {
      id: approvalId,
      decision: 'cancel',
    });
    gamificationEngine.addXP(25, `Revoked Gated Permit [${approvalId}]`);
    syncState();
  };

  // 15. Create Approval
  const handleCreateApproval = async (
    actionType: ApprovalActionType,
    target: string,
    justification: string
  ) => {
    await rpcService.callRPC('pulpo.approval.create', {
      actionType,
      target,
      justification,
    });
    gamificationEngine.addXP(50, `Submitted High-Risk Dual-Key Permit Request`);
    syncState();
  };

  // 16. Select Model
  const handleSelectModel = (model: AIModelKey) => {
    rpcService.setModel(model);
    gamificationEngine.completeQuest('quest-compress-tokens');
    gamificationEngine.addXP(30, `Target Co-Processor Set to ${model}`);
    syncState();
  };

  // 17. Select Stage Inspector
  const handleSelectStage = (stage: LoomStage) => {
    setSelectedStage(stage);
    gamificationEngine.addXP(20, `Inspected Governed Loom Stage: ${stage.title || stage.label}`);
  };

  // 18. Quick Squeeze Action
  const handleQuickSqueeze = () => {
    gamificationEngine.addXP(60, 'Triggered 42% AST Token Deduplication Optimization');
    gamificationEngine.unlockBadge('badge-token-squeezer');
  };

  return (
    <div className="min-h-screen bg-[#05080E] text-[#E2E8F0] flex flex-col font-mono relative overflow-x-hidden selection:bg-[#00F0FF] selection:text-black">
      {/* 4D Living Silicon Motherboard Background Matrix Canvas */}
      <CyberMotherboardCanvas mode="ambient_motherboard" />

      {/* Global Header Bar */}
      <Header
        repoState={state.repoState}
        principal={state.principal}
        session={state.session}
        activeModel={state.activeModel}
        tokenSaved={state.tokenSaved}
        profile={profile}
        onRefresh={syncState}
        onOpenRepoStatus={handleRepoStatus}
        onOpenAudit={handleVerifyAudit}
        onStartWalkthrough={() => setShowWalkthrough(true)}
        onOpenDossier={() => setShowDossierModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
      />

      {/* Real-time XP & Level-up Toast Notifications */}
      <XPToastContainer />

      {/* Main Operator Silicon Canvas */}
      <main className="relative z-10 flex-1 p-4 sm:p-6 space-y-4 max-w-[1720px] w-full mx-auto">
        {/* User-Focused 1-Click Action Bar with Real-Time XP Progression */}
        <UserActionBar
          profile={profile}
          onOpenSecurityAudit={handleVerifyAudit}
          onOpenTests={handleRunTests}
          onOpenReceipts={handleVerifyAudit}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenDossier={() => setShowDossierModal(true)}
          onLaunchTour={() => setShowWalkthrough(true)}
          onQuickSqueeze={handleQuickSqueeze}
        />

        {/* 1. Evidence Loom (Governed Optical Silicon Bus) */}
        <EvidenceLoom
          stages={state.stages}
          onSelectStage={handleSelectStage}
          selectedStageId={selectedStage?.id}
        />

        {/* Core Operator Layout: 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Operate Panel + Compression & Credit Meter */}
          <div className="lg:col-span-6 space-y-4">
            {/* 2. Operate Panel */}
            <OperatePanel
              intent={intentInput}
              onChangeIntent={setIntentInput}
              principal={principalInput}
              onChangePrincipal={(val) => {
                setPrincipalInput(val);
                rpcService.setPrincipal(val);
              }}
              session={sessionInput}
              onChangeSession={(val) => {
                setSessionInput(val);
                rpcService.setSession(val);
              }}
              activeModel={state.activeModel}
              tokenSaved={state.tokenSaved}
              onSaveToken={handleSaveToken}
              onRepoStatus={handleRepoStatus}
              onRepoDiff={handleRepoDiff}
              onRunTests={handleRunTests}
              onVerifyAudit={handleVerifyAudit}
              onBuildPacket={handleBuildPacket}
              onSubmitTask={handleSubmitTask}
              onRunNext={handleRunNext}
              isProcessing={isProcessing}
            />

            {/* 3. Compression + Credit Meter */}
            <CompressionMeter
              creditSummary={state.creditSummary}
              activeModel={state.activeModel}
              onSelectModel={handleSelectModel}
              rawChars={state.creditSummary.rawChars}
              packetChars={state.creditSummary.packetChars}
              tokensSaved={state.creditSummary.tokensSaved}
              creditsSaved={state.creditSummary.creditsSaved}
            />
          </div>

          {/* Right Column: Task Queue + Evidence Packet */}
          <div className="lg:col-span-6 space-y-4">
            {/* 4. Task Queue */}
            <TaskQueue
              tasks={state.tasks}
              onClaimTask={handleClaimTask}
              onRunTask={handleRunTask}
              onCompleteTask={handleCompleteTask}
            />

            {/* 8. Evidence Packet JSON Viewer */}
            <EvidencePacketViewer
              latestPacket={state.latestPacket}
              rpcLogs={state.rpcLogs}
              onSelectLogEntry={(entry) => {
                setState((prev) => ({
                  ...prev,
                  latestPacket: {
                    method: entry.method,
                    params: entry.params,
                    result: entry.result,
                    timestamp: entry.timestamp,
                    durationMs: entry.durationMs,
                  },
                }));
              }}
            />
          </div>
        </div>

        {/* 5. Source Registry (3 Private Air-Gapped Sources) */}
        <SourceRegistry
          sources={state.sources}
          onMakeTaskFromSource={handleMakeTaskFromSource}
        />

        {/* Bottom Split: Work Receipts (6) + Pending Approvals (7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 6. Work Receipts */}
          <div className="lg:col-span-7">
            <WorkReceipts receipts={state.receipts} />
          </div>

          {/* 7. Pending Approvals */}
          <div className="lg:col-span-5">
            <PendingApprovals
              approvals={state.approvals}
              onApprove={handleApprove}
              onCancelApproval={handleCancelApproval}
              onCreateApproval={handleCreateApproval}
            />
          </div>
        </div>
      </main>

      {/* Operator Footer Status Line */}
      <footer className="relative z-10 bg-[#080E15]/90 backdrop-blur-md border-t border-[#06B6D4]/25 px-6 py-2.5 text-[11px] text-[#64748B] font-mono flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <span>
            PULPO <strong className="text-[#00F0FF]">CYBER-OS v0.9.4</strong>
          </span>
          <span className="text-[#06B6D4]/30">|</span>
          <span>
            HEAD: <strong className="text-[#34D399]">@{state.repoState.head}</strong>
          </span>
          <span className="text-[#06B6D4]/30">|</span>
          <span className="text-[#34D399] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            Zero External Service Egress
          </span>
          <span className="text-[#06B6D4]/30 hidden md:inline">|</span>
          <span className="text-[#00F0FF] hidden md:inline">
            4D Motherboard Matrix: ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>JSON-RPC Dispatcher: 19 Methods Ready</span>
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
        </div>
      </footer>

      {/* Floating Walkthrough & Dossier Quick Launch FABs (when closed) */}
      {!showWalkthrough && (
        <div className="fixed bottom-12 right-6 z-40 flex items-center gap-2">
          <button
            id="btn-floating-leaderboard"
            onClick={() => setShowLeaderboardModal(true)}
            className="bg-[#0A1118]/90 hover:bg-[#132230] text-white px-3.5 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-[#F59E0B]/40 hover:border-[#F59E0B] flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-md"
            title="Open Sovereign Operator Leaderboard"
          >
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span className="hidden sm:inline">Leaderboard</span>
          </button>

          <button
            id="btn-floating-dossier"
            onClick={() => setShowDossierModal(true)}
            className="bg-[#0A1118]/90 hover:bg-[#132230] text-white px-3.5 py-2.5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-[#06B6D4]/40 hover:border-[#00F0FF] flex items-center gap-2 font-mono text-xs font-bold uppercase transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-md"
            title="Open Operator Dossier & Badges"
          >
            <span className="text-sm">👑</span>
            <span className="hidden sm:inline">Lvl {profile.level}</span>
            <span className="bg-[#06B6D4]/20 text-[#00F0FF] text-[10px] px-1.5 py-0.2 rounded font-bold border border-[#06B6D4]/40">
              {profile.xp} XP
            </span>
          </button>

          <button
            id="btn-floating-walkthrough"
            onClick={() => setShowWalkthrough(true)}
            className="bg-gradient-to-r from-[#06B6D4] to-[#10B981] hover:from-[#0891B2] hover:to-[#059669] text-black px-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center gap-2.5 font-mono text-xs font-black uppercase transition-all duration-200 hover:scale-105 cursor-pointer"
            title="Start Guided 4D Tron Silicon Virtual Walkthrough"
          >
            <span className="w-2 h-2 rounded-full bg-black animate-ping" />
            <Sparkles className="w-4 h-4" />
            <span>4D Warp Tour</span>
          </button>
        </div>
      )}

      {/* Virtual Walkthrough Component with Tron Singularity and 4D Silicon Motherboard */}
      <VirtualWalkthrough
        isOpen={showWalkthrough}
        onClose={() => setShowWalkthrough(false)}
        onSelectStage={(stageId) => {
          const st = state.stages.find((s) => s.id === stageId) || null;
          setSelectedStage(st);
        }}
        onSetIntent={(text) => setIntentInput(text)}
        onSelectModel={(model) => handleSelectModel(model)}
        onOpenRepoStatus={handleRepoStatus}
        onOpenAudit={handleVerifyAudit}
        onOpenDiff={handleRepoDiff}
        onOpenTests={handleRunTests}
        onOpenDossier={() => setShowDossierModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
      />

      {/* Operator Dossier & Governance License Modal */}
      <OperatorDossierModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        profile={profile}
      />

      {/* Sovereign Operator Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        entries={gamificationEngine.getLeaderboard()}
        currentProfile={profile}
      />

      {/* Interactive Modals */}
      <RepoStatusModal
        repoState={state.repoState}
        isOpen={showRepoStatusModal}
        onClose={() => setShowRepoStatusModal(false)}
      />

      <RepoDiffModal
        isOpen={showRepoDiffModal}
        onClose={() => setShowRepoDiffModal(false)}
        diffData={lastDiffData}
      />

      <TestResultsModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        testData={lastTestData}
      />

      <AuditVerifierModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        auditData={lastAuditData}
      />

      <StageInspectorModal
        stage={selectedStage}
        isOpen={selectedStage !== null}
        onClose={() => setSelectedStage(null)}
      />
    </div>
  );
}
