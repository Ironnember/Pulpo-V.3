import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  CheckCircle2,
  Video,
  Layers,
  ShieldCheck,
  Cpu,
  Coins,
  ListTodo,
  FolderLock,
  FileCheck2,
  UserCheck,
  Braces,
  Zap,
  HelpCircle,
  Trophy,
  Award,
  Flame,
  ArrowRight,
  Radio,
  Eye,
  Terminal,
} from 'lucide-react';
import { tourAudio } from '../lib/tourAudio';
import { gamificationEngine } from '../lib/gamification';
import { AIModelKey, LoomStage, PrivateSource, WorkReceipt } from '../types';
import { CyberMotherboardCanvas } from './CyberMotherboardCanvas';

export interface TourQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TourStep {
  id: string;
  targetId: string;
  questId: string;
  chipId: string;
  title: string;
  stationBadge: string;
  icon: React.ReactNode;
  subtitle: string;
  userBenefit: string;
  description: string;
  governanceNote: string;
  actionPrompt?: string;
  actionLabel?: string;
  category: 'Trust' | 'Pipeline' | 'Execution' | 'Economy' | 'Audit';
  quiz: TourQuiz;
}

interface VirtualWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage?: (stageId: string) => void;
  onSetIntent?: (text: string) => void;
  onSelectModel?: (model: AIModelKey) => void;
  onOpenRepoStatus?: () => void;
  onOpenAudit?: () => void;
  onOpenDiff?: () => void;
  onOpenTests?: () => void;
  onOpenDossier?: () => void;
  onOpenLeaderboard?: () => void;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'header-trust',
    targetId: 'pulpo-operator-header',
    questId: 'quest-verify-trust',
    chipId: 'CPU-01 TRUST_ROOT',
    title: 'Zero-Egress Trust Anchor & Sovereign Identity',
    stationBadge: 'Station 01 · Trust Anchor',
    icon: <ShieldCheck className="w-4 h-4 text-[#34D399]" />,
    subtitle: 'Local Git HEAD tracking & tamper-proof cryptographic audit state',
    userBenefit:
      '🛡️ User Benefit: Guarantees your code never leaves your local machine. No secret cloud training, no external data leakage.',
    description:
      'Pulpo runs entirely on your local machine with strict zero external service egress. Every state transition is cryptographically pinned to your local Git commit HEAD (@e174e0c) and verified against a root certification authority.',
    governanceNote:
      'Invariant: All LLM reasoning & telemetry remain air-gapped from untrusted third-party loggers.',
    actionLabel: 'Inspect Git Repository State',
    actionPrompt: 'Open live Git branch and dirty working tree status inspector',
    category: 'Trust',
    quiz: {
      question: 'Why does Pulpo pin all governance operations to your local Git commit HEAD?',
      options: [
        'To establish a tamper-proof cryptographic anchor with zero remote cloud egress',
        'To upload source code to public clouds',
        'To run remote third-party ads',
      ],
      correctIndex: 0,
      explanation:
        'Local Git commit anchoring guarantees that no unverified or unauthorized external changes alter your execution context.',
    },
  },
  {
    id: 'evidence-loom',
    targetId: 'evidence-loom-section',
    questId: 'quest-inspect-stage',
    chipId: 'BUS-02 LOOM_PIPELINE',
    title: 'Evidence Loom Pipeline (Governed Work Path)',
    stationBadge: 'Station 02 · Work Pipeline',
    icon: <Layers className="w-4 h-4 text-[#00F0FF]" />,
    subtitle: '7-stage deterministic execution pipeline with hard sandbox fences',
    userBenefit:
      '🧬 User Benefit: AI agents cannot run rogue commands. Every action must cross strict checkpoints before touching files.',
    description:
      'The Evidence Loom visualizes the strict lifecycle of every autonomous task: Intent → Policy Check → Token Budgeting → Gated Permits → Execution Sandbox → Evidence Receipt → Human Gatekeeper.',
    governanceNote:
      'No AI sub-agent can bypass intermediate stages or execute unpermitted system calls.',
    actionLabel: 'Inspect Stage: Corpus Map',
    actionPrompt: 'View execution metadata and governance fences for the Corpus stage',
    category: 'Pipeline',
    quiz: {
      question: 'Can an autonomous AI agent bypass intermediate Loom stages to run code directly?',
      options: [
        'Yes, if the prompt asks nicely',
        'No, the Evidence Loom enforces deterministic stage gates in strict sequence',
        'Only in debug mode',
      ],
      correctIndex: 1,
      explanation:
        'Every task must successfully pass policy checks, budget limits, and sandbox permits before code execution is allowed.',
    },
  },
  {
    id: 'operate-panel',
    targetId: 'operate-panel-section',
    questId: 'quest-verify-trust',
    chipId: 'REG-03 OPERATOR_CTX',
    title: 'Operator Workspace & Sovereign Directives',
    stationBadge: 'Station 03 · Control Surface',
    icon: <Cpu className="w-4 h-4 text-[#00F0FF]" />,
    subtitle: 'Fast-path command terminal with authenticated principal session headers',
    userBenefit:
      '⚡ User Benefit: Type what you need in plain English and execute verified AST checks in 1 click.',
    description:
      'Direct autonomous agents by defining strict mission intents, selecting authority principals (e.g. chatgpt.board-manager), and running local fast-path AST actions like unified diff checking and unit test suites.',
    governanceNote:
      'Directives are parsed through an AST validator before generating task packets.',
    actionLabel: 'Inject Verification Intent',
    actionPrompt: 'Simulate operator typing a security invariant validation directive',
    category: 'Execution',
    quiz: {
      question: 'What is the role of the Operator Principal in the command workspace?',
      options: [
        'It authenticates the authority domain and permission scope for the session',
        'It selects the wallpaper theme',
        'It converts files into image format',
      ],
      correctIndex: 0,
      explanation:
        'The Principal ID ties every emitted intent to a cryptographically authorized human or executive entity.',
    },
  },
  {
    id: 'compression-meter',
    targetId: 'compression-meter-section',
    questId: 'quest-compress-tokens',
    chipId: 'ASIC-04 AST_SQUEEZER',
    title: 'AST Token Squeezer & Model Economizer',
    stationBadge: 'Station 04 · Economizer',
    icon: <Coins className="w-4 h-4 text-[#F59E0B]" />,
    subtitle: 'Live 42% token compression engine and rate card cost calculator',
    userBenefit:
      '💰 User Benefit: Saves over 40% on AI API costs by stripping duplicate syntactic fluff before prompting.',
    description:
      'Pulpo automatically cleans and dedupes structural AST nodes, saving an average of 1,587 tokens per task execution and eliminating redundant round trips.',
    governanceNote:
      'Compresses token payload size by ~42% while preserving 100% semantic AST accuracy.',
    actionLabel: 'Switch to GPT-5.6 Terra Model',
    actionPrompt: 'Change the target AI co-processor to GPT-5.6 Terra and inspect rate card',
    category: 'Economy',
    quiz: {
      question: 'How much token volume does AST deduplication typically save per governed task?',
      options: [
        '0% (No difference)',
        'Approximately 42% token reduction',
        '100% (No prompts sent)',
      ],
      correctIndex: 1,
      explanation:
        'By stripping duplicate AST boilerplate, Pulpo cuts LLM context costs by ~42% deterministically.',
    },
  },
  {
    id: 'task-queue',
    targetId: 'task-queue-section',
    questId: 'quest-run-task',
    chipId: 'SCHED-05 TASK_MATRIX',
    title: 'Multi-Core Task Queue & Scheduler',
    stationBadge: 'Station 05 · Task Scheduler',
    icon: <ListTodo className="w-4 h-4 text-[#00F0FF]" />,
    subtitle: 'State transitions: queued → claimed → running → completed',
    userBenefit:
      '⚙️ User Benefit: Keeps your work organized with step-by-step progress you can pause or resume anytime.',
    description:
      'All AI tasks are managed through a deterministic state machine. Tasks are bound to immutable packet hashes, tracked across workers, and sealed upon completion.',
    governanceNote:
      'State transitions are idempotent and recorded to the local SQLite/JSON audit log.',
    actionLabel: 'Inspect AST Unified Diff',
    actionPrompt: 'Open diff viewer to inspect sandbox changes before scheduling next worker',
    category: 'Execution',
    quiz: {
      question: 'What happens to a task once it reaches the "completed" state?',
      options: [
        'It is deleted without any traces',
        'An immutable cryptographic Work Receipt is sealed with tests & audit proofs',
        'It runs forever in background',
      ],
      correctIndex: 1,
      explanation:
        'Completed tasks generate permanent cryptographic receipts containing hash seals and test verification badges.',
    },
  },
  {
    id: 'source-registry',
    targetId: 'source-registry-section',
    questId: 'quest-inspect-stage',
    chipId: 'VAULT-06 SRC_REGISTRY',
    title: 'Air-Gapped Private Source Registry',
    stationBadge: 'Station 06 · Vault Storage',
    icon: <FolderLock className="w-4 h-4 text-[#34D399]" />,
    subtitle: 'Track private codebase bodies, duplicate hash detection, and category offsets',
    userBenefit:
      '📁 User Benefit: Automatically catalogs your local files without uploading them to cloud indexing servers.',
    description:
      'The Source Registry maps your air-gapped repositories (e.g. selfhost, chatgpt-board, claude-ops), counting unique bodies, deduplicating files, and categorizing modules.',
    governanceNote:
      'All hashes computed using SHA-256 locally with zero network egress.',
    actionLabel: 'Synthesize Governed Task',
    actionPrompt: 'Create a pre-configured task packet from the selected private source',
    category: 'Trust',
    quiz: {
      question: 'Where is the Source Registry indexed?',
      options: [
        'Locally on your machine inside the sovereign vault',
        'On an unencrypted public FTP',
        'On a remote social media server',
      ],
      correctIndex: 0,
      explanation:
        'The registry lives exclusively in your air-gapped local environment.',
    },
  },
  {
    id: 'work-receipts',
    targetId: 'work-receipts-section',
    questId: 'quest-verify-trust',
    chipId: 'ROM-07 EVIDENCE_SEAL',
    title: 'Sealed Cryptographic Work Receipts',
    stationBadge: 'Station 07 · Cryptographic ROM',
    icon: <FileCheck2 className="w-4 h-4 text-[#00F0FF]" />,
    subtitle: 'Immutable proof bundles with test invariants and zero-egress audit seals',
    userBenefit:
      '📜 User Benefit: Provides undeniable proof that tests passed and your security invariants were never broken.',
    description:
      'Work Receipts serve as tamper-evident proof that code was executed in a sandbox, unit tests passed (100% green), and cryptographic audit signatures match.',
    governanceNote:
      'Signed with local Ed25519 keypair and pinned to Git commit hash.',
    actionLabel: 'Verify Cryptographic Audit Trail',
    actionPrompt: 'Run Merkle verification check on the entire work receipt chain',
    category: 'Audit',
    quiz: {
      question: 'What proves that a Work Receipt was not altered after execution?',
      options: [
        'A timestamp from a clock app',
        'A cryptographic SHA-256 hash seal linked to the Git commit and test results',
        'An email attachment',
      ],
      correctIndex: 1,
      explanation:
        'Cryptographic hash seals link the code AST, execution logs, and Git tree into an immutable record.',
    },
  },
  {
    id: 'pending-approvals',
    targetId: 'pending-approvals-section',
    questId: 'quest-verify-trust',
    chipId: 'GATE-08 HUMAN_INTERLOCK',
    title: 'Gated Authority Interlock (Human-in-the-Loop)',
    stationBadge: 'Station 08 · Dual-Key Gate',
    icon: <UserCheck className="w-4 h-4 text-[#F59E0B]" />,
    subtitle: 'Dual-key approval gate for high-risk actions (git push, policy changes)',
    userBenefit:
      '🛑 User Benefit: You retain complete authority. AI cannot commit or push without your explicit key authorization.',
    description:
      'High-impact operations (remote git push, policy updates, budget overrides) are placed in a high-voltage interlock until an authorized human approves them.',
    governanceNote:
      'Human-in-the-loop interlock blocks silent automated side effects.',
    actionLabel: 'Authorize High-Risk Permit',
    actionPrompt: 'Review justification statement and grant temporary execution authorization',
    category: 'Trust',
    quiz: {
      question: 'Can an AI agent push code to remote repositories without human gatekeeper approval?',
      options: [
        'Yes, it can push anytime',
        'No, all remote and high-risk actions require explicit dual-key human authorization',
        'Only on weekends',
      ],
      correctIndex: 1,
      explanation:
        'The Gated Authority Interlock halts high-risk operations until an authorized human provides explicit sign-off.',
    },
  },
  {
    id: 'evidence-packet',
    targetId: 'evidence-packet-section',
    questId: 'quest-inspect-stage',
    chipId: 'CORE-00 CRYPTO_KERNEL',
    title: 'JSON-RPC Quantum Bus & Packet Analyzer',
    stationBadge: 'Station 09 · Quantum Kernel Bus',
    icon: <Braces className="w-4 h-4 text-[#00F0FF]" />,
    subtitle: 'Inspect raw JSON-RPC 2.0 frames, parameter payloads, and trace timings',
    userBenefit:
      '🔬 User Benefit: Complete visibility into every AI message and parameter. Nothing is hidden behind black boxes.',
    description:
      'The packet analyzer displays exact JSON-RPC 2.0 communication frames between the frontend, local runtime engine, and AI co-processors.',
    governanceNote:
      'Conforms to JSON-RPC 2.0 specification with strict schema validation.',
    actionLabel: 'Run Invariant Test Suite',
    actionPrompt: 'Execute all unit and integration test suites against the RPC kernel',
    category: 'Audit',
    quiz: {
      question: 'What protocol powers communication across the Pulpo governance bus?',
      options: [
        'Standard JSON-RPC 2.0 frames with full payload transparency',
        'Proprietary binary black-box code',
        'Plain text SMS',
      ],
      correctIndex: 0,
      explanation:
        'Standard JSON-RPC 2.0 allows complete auditing and reproducible execution across any tooling.',
    },
  },
];

export const VirtualWalkthrough: React.FC<VirtualWalkthroughProps> = ({
  isOpen,
  onClose,
  onSelectStage,
  onSetIntent,
  onSelectModel,
  onOpenRepoStatus,
  onOpenAudit,
  onOpenDiff,
  onOpenTests,
  onOpenDossier,
  onOpenLeaderboard,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);
  const [showGraduation, setShowGraduation] = useState<boolean>(false);

  // 4D Warp Singularity state
  const [isWarping, setIsWarping] = useState<boolean>(true);
  const [warpProgress, setWarpProgress] = useState<number>(0);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Warp Singularity entry sequence
  useEffect(() => {
    if (!isOpen) return;

    setIsWarping(true);
    setWarpProgress(0);
    tourAudio.playWarpEngage();

    const interval = setInterval(() => {
      setWarpProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsWarping(false);
            tourAudio.playCircuitPulse();
          }, 400);
          return 1;
        }
        return prev + 0.05;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Audio tone on step transition
  useEffect(() => {
    if (!isOpen || isWarping) return;
    if (!soundMuted) {
      tourAudio.playStepTone(currentStepIndex);
    }
    setShowQuiz(false);
    setSelectedQuizAnswer(null);
    setQuizAnswered(false);
  }, [currentStepIndex, isOpen, isWarping, soundMuted]);

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleTourGraduation();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleExecuteLiveAction = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps((prev) => [...prev, currentStep.id]);
      gamificationEngine.addXP(50, `Mission Accomplished: ${currentStep.stationBadge}`);
    }

    switch (currentStep.id) {
      case 'header-trust':
        if (onOpenRepoStatus) onOpenRepoStatus();
        break;
      case 'evidence-loom':
        if (onSelectStage) onSelectStage('stage-corpus');
        break;
      case 'operate-panel':
        if (onSetIntent) onSetIntent('Assert zero cloud egress on git commit HEAD');
        break;
      case 'compression-meter':
        if (onSelectModel) onSelectModel('GPT-5.6 Terra');
        break;
      case 'task-queue':
        if (onOpenDiff) onOpenDiff();
        break;
      case 'source-registry':
        if (onSelectStage) onSelectStage('stage-corpus');
        break;
      case 'work-receipts':
        if (onOpenAudit) onOpenAudit();
        break;
      case 'pending-approvals':
        if (onOpenAudit) onOpenAudit();
        break;
      case 'evidence-packet':
        if (onOpenTests) onOpenTests();
        break;
      default:
        break;
    }
  };

  const handleAnswerQuiz = (index: number) => {
    if (quizAnswered) return;
    setSelectedQuizAnswer(index);
    setQuizAnswered(true);

    const isCorrect = index === currentStep.quiz.correctIndex;
    setQuizCorrect(isCorrect);

    if (isCorrect) {
      tourAudio.playQuizSuccess();
      gamificationEngine.addXP(60, `Knowledge Quiz Passed: Station #${currentStepIndex + 1}`);
    }
  };

  const handleTourGraduation = () => {
    setIsPlaying(false);
    setShowGraduation(true);
    tourAudio.playCompleteChime();
    gamificationEngine.completeQuest('quest-complete-tour');
    gamificationEngine.unlockBadge('badge-tour-graduate');
    gamificationEngine.addXP(250, 'Certified Operator Graduation Achieved!');
  };

  if (!isOpen) return null;

  return (
    <div id="virtual-walkthrough-overlay" className="fixed inset-0 z-50 overflow-hidden font-mono select-none">
      {/* 4D Living Silicon Motherboard Canvas / Tron Black Hole Singularity */}
      <CyberMotherboardCanvas
        mode={isWarping ? 'blackhole' : 'silicon_motherboard'}
        currentStepIndex={currentStepIndex}
        completedStepCount={completedSteps.length}
        totalSteps={TOUR_STEPS.length}
        warpProgress={warpProgress}
      />

      {/* Cinematic Warp Intro Overlay */}
      {isWarping && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-6 bg-black/70 backdrop-blur-xs font-mono select-none">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/60 text-[#00F0FF] text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              <span>GRAVITATIONAL SINGULARITY DETECTED</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-widest uppercase drop-shadow-[0_0_20px_rgba(0,240,255,0.8)] font-mono">
              ENTERING 4D SILICON MATRIX
            </h1>

            <p className="text-xs sm:text-sm text-[#00F0FF] tracking-wider">
              Warping into the living microchip architecture of your sovereign developer tools...
            </p>

            <div className="w-full bg-[#080E15] h-2.5 rounded-full overflow-hidden border border-[#06B6D4]/40 shadow-inner">
              <div
                className="bg-gradient-to-r from-[#06B6D4] via-[#10B981] to-[#00F0FF] h-full transition-all duration-75 rounded-full shadow-[0_0_10px_#00F0FF]"
                style={{ width: `${warpProgress * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>WARP FACTOR: {(warpProgress * 9.9).toFixed(1)}c</span>
              <span className="text-[#34D399] font-bold">DOCKING CONDUCTORS: {Math.round(warpProgress * 100)}%</span>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setIsWarping(false);
                  tourAudio.playCircuitPulse();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#0D1824] hover:bg-[#152535] border border-[#06B6D4]/40 text-[#00F0FF] text-xs font-bold uppercase transition-colors cursor-pointer shadow-xs"
              >
                Skip Warp Singularity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tour HUD Controls & Stage Card (when not warping) */}
      {!isWarping && (
        <>
          {/* Top Floating Telemetry & Mode Switcher Bar */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0A1118]/95 text-white backdrop-blur-md px-4 py-2 rounded-xl border border-[#06B6D4]/40 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center gap-3 font-mono text-xs max-w-3xl w-[94%] sm:w-auto justify-between cyber-card">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
              <span className="font-bold text-[#00F0FF]">4D SILICON HUD</span>
              <span className="text-[#64748B]">|</span>
              <span className="text-[#34D399] font-semibold truncate">
                {currentStep.chipId}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundMuted(!soundMuted)}
                className="p-1.5 rounded bg-[#0D1824] hover:bg-[#152535] text-[#94A3B8] hover:text-[#00F0FF] border border-[#06B6D4]/20 transition-colors cursor-pointer"
                title={soundMuted ? 'Unmute Audio Chimes' : 'Mute Audio Chimes'}
              >
                {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00F0FF]" />}
              </button>

              <button
                onClick={onOpenLeaderboard}
                className="hidden sm:flex items-center gap-1 text-[11px] bg-[#0D1824] hover:bg-[#152535] border border-[#F59E0B]/40 text-[#F59E0B] px-2.5 py-1 rounded font-bold cursor-pointer transition-colors"
              >
                <Trophy className="w-3 h-3 text-[#F59E0B]" />
                <span>Leaderboard</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded bg-[#0D1824] hover:bg-[#152535] text-[#94A3B8] hover:text-white border border-[#06B6D4]/20 transition-colors cursor-pointer"
                title="Exit Walkthrough"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating Interactive Station Briefing Card */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-[#0A1118]/95 backdrop-blur-md border border-[#06B6D4]/40 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.85)] overflow-hidden font-mono animate-in slide-in-from-bottom-6 duration-300 cyber-card">
            {/* Step Progress Top Strip */}
            <div className="bg-[#0F1B27] text-white px-4 py-2 flex items-center justify-between text-xs font-mono border-b border-[#06B6D4]/25">
              <div className="flex items-center gap-2">
                <span className="text-sm">⚡</span>
                <span className="font-bold text-[#00F0FF]">{currentStep.stationBadge}</span>
                <span className="text-[#64748B]">({currentStepIndex + 1} of {TOUR_STEPS.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#F59E0B] font-bold">
                  {completedSteps.length}/{TOUR_STEPS.length} Missions Done
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-4 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                    {currentStep.icon}
                    <span>{currentStep.title}</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8] font-mono mt-0.5">{currentStep.subtitle}</p>
                </div>
              </div>

              {/* Simplified User-Focused Value Box */}
              <div className="p-3 rounded-lg bg-[#081824] border border-[#00F0FF]/40 text-xs font-medium text-[#00F0FF] leading-relaxed shadow-inner">
                {currentStep.userBenefit}
              </div>

              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {currentStep.description}
              </p>

              {/* Interactive Live Mission & Knowledge Quiz Panel */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
                {/* Live Action Button */}
                <button
                  onClick={handleExecuteLiveAction}
                  className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                    completedSteps.includes(currentStep.id)
                      ? 'bg-[#081F1A] border-[#10B981] text-[#34D399]'
                      : 'bg-[#080E15] border-[#06B6D4]/30 hover:border-[#00F0FF] text-white'
                  }`}
                >
                  <div>
                    <div className="text-[10px] text-[#64748B] uppercase font-bold">Live Action Challenge</div>
                    <div className="text-xs font-bold mt-0.5">{currentStep.actionLabel}</div>
                  </div>
                  {completedSteps.includes(currentStep.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-[#34D399] shrink-0" />
                  ) : (
                    <span className="text-[10px] bg-[#00F0FF] text-black px-2 py-1 rounded font-bold shrink-0 shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                      +50 XP
                    </span>
                  )}
                </button>

                {/* Toggle Quiz Button */}
                <button
                  onClick={() => setShowQuiz(!showQuiz)}
                  className="p-2.5 rounded-lg bg-[#080E15] border border-[#06B6D4]/30 hover:border-[#F59E0B] text-left flex items-center justify-between transition-all cursor-pointer text-white"
                >
                  <div>
                    <div className="text-[10px] text-[#64748B] uppercase font-bold">Knowledge Check</div>
                    <div className="text-xs font-bold text-white mt-0.5">Answer Station Quiz</div>
                  </div>
                  <span className="text-[10px] bg-[#F59E0B] text-black px-2 py-1 rounded font-extrabold shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    +60 XP
                  </span>
                </button>
              </div>

              {/* Collapsible Quiz Accordion */}
              {showQuiz && (
                <div className="p-3.5 rounded-lg bg-[#081018] border border-[#06B6D4]/30 space-y-2.5 font-mono animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{currentStep.quiz.question}</span>
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {currentStep.quiz.options.map((opt, idx) => {
                      let btnClass = 'bg-[#0D1824] border-[#06B6D4]/20 text-[#94A3B8] hover:text-white hover:border-[#00F0FF]';
                      if (quizAnswered) {
                        if (idx === currentStep.quiz.correctIndex) {
                          btnClass = 'bg-[#081F1A] border-[#10B981] text-[#34D399] font-bold';
                        } else if (idx === selectedQuizAnswer) {
                          btnClass = 'bg-[#240D0D] border-[#EF4444] text-[#F87171]';
                        }
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerQuiz(idx)}
                          disabled={quizAnswered}
                          className={`w-full text-left p-2 rounded text-xs border transition-colors cursor-pointer ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <div
                      className={`text-[11px] p-2 rounded border ${
                        quizCorrect
                          ? 'bg-[#081F1A] border-[#10B981]/40 text-[#34D399]'
                          : 'bg-[#240D0D] border-[#EF4444]/40 text-[#F87171]'
                      }`}
                    >
                      {quizCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                      {currentStep.quiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card Footer Navigation */}
            <div className="bg-[#0F1B27] border-t border-[#06B6D4]/25 p-3 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="px-3 py-1.5 rounded-lg border border-[#06B6D4]/30 bg-[#080E15] text-white text-xs font-mono font-bold flex items-center gap-1 disabled:opacity-30 cursor-pointer hover:border-[#00F0FF]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Station</span>
              </button>

              {/* Station Dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? 'bg-[#00F0FF] scale-125 shadow-[0_0_6px_#00F0FF]'
                        : completedSteps.includes(step.id)
                        ? 'bg-[#10B981]'
                        : 'bg-[#1E293B]'
                    }`}
                    title={step.stationBadge}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#10B981] hover:from-[#0891B2] hover:to-[#059669] text-black text-xs font-mono font-extrabold flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Station'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Operator Graduation Modal Ceremony */}
      {showGraduation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0A1118] border border-[#06B6D4]/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in zoom-in-95 duration-200 cyber-card">
            <div className="w-20 h-20 rounded-full bg-[#00F0FF]/15 border-2 border-[#00F0FF] flex items-center justify-center text-4xl mx-auto shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              🎓
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wider">
                CONGRATULATIONS, OPERATOR!
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] font-mono mt-1">
                You have successfully traversed all 9 stations of the 4D Living Silicon Motherboard.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080E15] border border-[#06B6D4]/30 space-y-2 font-mono text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Total Tour XP Earned:</span>
                <span className="font-bold text-[#00F0FF]">+250 XP</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Medal Awarded:</span>
                <span className="font-bold text-[#F59E0B]">Certified Operator Graduate</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Silicon Matrix Status:</span>
                <span className="font-bold text-[#34D399]">100% ONLINE & ENCRYPTED</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {onOpenLeaderboard && (
                <button
                  onClick={() => {
                    setShowGraduation(false);
                    onClose();
                    onOpenLeaderboard();
                  }}
                  className="flex-1 py-2.5 rounded-lg border border-[#06B6D4]/40 bg-[#0D1824] hover:bg-[#152535] text-[#00F0FF] font-mono text-xs font-bold cursor-pointer"
                >
                  View Leaderboard
                </button>
              )}
              <button
                onClick={() => {
                  setShowGraduation(false);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-black font-mono text-xs font-extrabold cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
