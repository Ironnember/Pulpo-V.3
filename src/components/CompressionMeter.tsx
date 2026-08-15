import React, { useState } from 'react';
import {
  Coins,
  Cpu,
  Layers,
  ArrowDownRight,
  TrendingDown,
  Info,
  ChevronDown,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  X,
} from 'lucide-react';
import { AIModelKey, CreditSummary } from '../types';
import { MODEL_LIST, RATE_CARDS } from '../lib/rateCard';
import { gamificationEngine } from '../lib/gamification';

interface CompressionMeterProps {
  creditSummary: CreditSummary;
  activeModel: AIModelKey;
  onSelectModel: (model: AIModelKey) => void;
  rawChars?: number;
  packetChars?: number;
  tokensSaved?: number;
  creditsSaved?: number;
}

export const CompressionMeter: React.FC<CompressionMeterProps> = ({
  creditSummary,
  activeModel,
  onSelectModel,
  rawChars,
  packetChars,
  tokensSaved,
  creditsSaved,
}) => {
  const [showRateCardModal, setShowRateCardModal] = useState<boolean>(false);
  const [showSqueezeChallenge, setShowSqueezeChallenge] = useState<boolean>(false);
  const [customSqueezeRatio, setCustomSqueezeRatio] = useState<number>(42); // 42%

  const baseRawChars = rawChars !== undefined ? rawChars : (creditSummary?.rawChars || 14280);
  const calculatedPacketChars = Math.round(baseRawChars * (1 - customSqueezeRatio / 100));
  const calculatedTokensSaved = Math.max(1587, Math.round((baseRawChars - calculatedPacketChars) / 3.85));

  const currentRateCard = RATE_CARDS[activeModel] || RATE_CARDS['GPT-5.6 Terra'];
  const calculatedCreditsSaved =
    (calculatedTokensSaved / 1000000) * (currentRateCard?.inputCostPer1M || 1.5);

  const handleApplySqueeze = () => {
    gamificationEngine.addXP(45, `Applied ${customSqueezeRatio}% AST Compression (+${calculatedTokensSaved} Tokens Saved)`);
    gamificationEngine.unlockBadge('badge-token-squeezer');
  };

  return (
    <section
      id="compression-meter-section"
      className="bg-[#060C14]/45 backdrop-blur-xl border border-[#06B6D4]/25 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-4 font-mono flex flex-col justify-between cyber-card"
    >
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#06B6D4]/20">
          <h2 className="text-[11px] uppercase font-bold text-[#94A3B8] tracking-widest flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
            Silicon ASIC · AST Token Squeezer
          </h2>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowSqueezeChallenge(!showSqueezeChallenge)}
              className="text-[10px] text-[#00F0FF] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-[#06B6D4]/15 px-2 py-0.5 rounded border border-[#06B6D4]/30 backdrop-blur-md"
            >
              <Zap className="w-3 h-3 text-[#F59E0B]" />
              <span>Squeeze Sandbox</span>
            </button>
            <button
              onClick={() => setShowRateCardModal(!showRateCardModal)}
              className="text-[10px] text-[#94A3B8] hover:text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>Rate Card</span>
            </button>
          </div>
        </div>

        {/* Model Select Dropdown & Quick Rates */}
        <div className="space-y-1 mb-3">
          <label className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
            Target Model Co-Processor
          </label>
          <select
            value={activeModel}
            onChange={(e) => onSelectModel(e.target.value as AIModelKey)}
            className="w-full bg-[#080E15]/50 border border-[#06B6D4]/30 p-2 text-xs font-semibold rounded-lg text-[#00F0FF] focus:outline-none focus:border-[#00F0FF] cursor-pointer backdrop-blur-md"
          >
            <option value="GPT-5.6 Terra">GPT-5.6 Terra (Optimal · Default Co-Processor)</option>
            <option value="GPT-5.6 Sol">GPT-5.6 Sol (High Reasoning Substrate)</option>
            <option value="GPT-5.6 Luna">GPT-5.6 Luna (Fast Low-Wattage Econo)</option>
            <option value="GPT-5.5">GPT-5.5 (General Synthesis Substrate)</option>
            <option value="GPT-5.3-Codex">GPT-5.3-Codex (Specialized Micro-Synthesizer)</option>
          </select>
        </div>

        {/* Interactive Squeeze Challenge Drawer */}
        {showSqueezeChallenge && (
          <div className="mb-3 p-3 bg-[#08131E]/60 border border-[#06B6D4]/40 rounded-lg space-y-2 text-xs backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" />
                Interactive AST Squeeze Dial
              </span>
              <span className="text-[#34D399] font-bold bg-[#10B981]/20 px-2 py-0.5 rounded border border-[#10B981]/40">
                {customSqueezeRatio}% Compression
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8]">
              Adjust AST deduplication aggressiveness to reduce packet footprint before LLM transit.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={75}
                value={customSqueezeRatio}
                onChange={(e) => setCustomSqueezeRatio(Number(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer"
              />
              <button
                onClick={handleApplySqueeze}
                className="px-3 py-1 bg-gradient-to-r from-[#06B6D4] to-[#10B981] text-black font-extrabold rounded text-[10px] uppercase cursor-pointer hover:opacity-90 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              >
                Apply (+45 XP)
              </button>
            </div>
          </div>
        )}

        {/* Metrics Visual Dual Column */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          {/* Raw Intent vs Governed Packet */}
          <div className="p-2.5 rounded-lg bg-[#080E15]/40 border border-[#06B6D4]/20 space-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <span>RAW BUFFER</span>
              <span className="text-[#F87171]">{baseRawChars.toLocaleString()} chars</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <span>COMPRESSED</span>
              <span className="text-[#34D399] font-bold">{calculatedPacketChars.toLocaleString()} chars</span>
            </div>
            <div className="w-full bg-[#132230]/40 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-[#00F0FF] h-full rounded-full transition-all duration-300"
                style={{ width: `${100 - customSqueezeRatio}%` }}
              />
            </div>
          </div>

          {/* Tokens & Credits Saved */}
          <div className="p-2.5 rounded-lg bg-[#080E15]/40 border border-[#10B981]/30 space-y-1 backdrop-blur-md">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#64748B]">TOKENS SAVED</span>
              <span className="font-bold text-[#34D399]">
                {calculatedTokensSaved.toLocaleString()} tok
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#64748B]">CREDIT EQUIV</span>
              <span className="font-bold text-[#F59E0B]">
                ${calculatedCreditsSaved.toFixed(4)}
              </span>
            </div>
            <div className="flex items-center justify-end text-[9px] text-[#34D399] font-bold pt-0.5">
              <span>{customSqueezeRatio}% REDUCTION RATIO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Spec Footer Bar */}
      <div className="pt-2 border-t border-[#06B6D4]/20 flex items-center justify-between text-[10px] text-[#64748B]">
        <span>
          Base Cost: <strong className="text-white">${currentRateCard.inputCostPer1M}/1M</strong>
        </span>
        <span className="text-[#00F0FF] font-bold">
          Speed Factor: {currentRateCard.speedRating}x
        </span>
      </div>

      {/* Rate Card Modal */}
      {showRateCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0A1118] border border-[#06B6D4]/40 rounded-xl max-w-lg w-full p-4 space-y-3 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-[#06B6D4]/20">
              <h3 className="text-xs font-bold uppercase text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-[#00F0FF]" />
                Rate Card Matrix & Token Pricing
              </h3>
              <button
                onClick={() => setShowRateCardModal(false)}
                className="text-[#64748B] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {MODEL_LIST.map((model) => {
                const card = RATE_CARDS[model];
                const isCurrent = model === activeModel;
                return (
                  <div
                    key={model}
                    onClick={() => {
                      onSelectModel(model);
                      setShowRateCardModal(false);
                    }}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#0E2235] border-[#00F0FF]'
                        : 'bg-[#080E15] border-[#06B6D4]/20 hover:border-[#06B6D4]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {model}
                        {isCurrent && (
                          <span className="text-[9px] bg-[#00F0FF]/20 text-[#00F0FF] px-1.5 py-0.2 rounded border border-[#00F0FF]/40">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#64748B]">{card.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#34D399] font-bold text-xs">
                        ${card.inputCostPer1M} / 1M
                      </div>
                      <div className="text-[10px] text-[#F59E0B]">
                        {card.speedRating}x Speed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
