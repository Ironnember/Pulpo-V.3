import { AIModelKey, ModelRateCard } from '../types';

export const RATE_CARDS: Record<AIModelKey, ModelRateCard> = {
  'GPT-5.6 Sol': {
    name: 'GPT-5.6 Sol',
    inputCostPer1M: 125,
    cachedCostPer1M: 12.5,
    outputCostPer1M: 750,
    tier: 'Flagship Frontier',
    contextWindow: '256k',
    description: 'High-reasoning flagship for complex architectural governance & proof synthesis',
    speedRating: 4.8,
  },
  'GPT-5.6 Terra': {
    name: 'GPT-5.6 Terra',
    inputCostPer1M: 50,
    cachedCostPer1M: 5.0,
    outputCostPer1M: 300,
    tier: 'Balanced Workhorse',
    contextWindow: '1M',
    description: 'Balanced throughput for standard policy evaluation, source diffs, and evidence audits',
    speedRating: 4.5,
  },
  'GPT-5.6 Luna': {
    name: 'GPT-5.6 Luna',
    inputCostPer1M: 5,
    cachedCostPer1M: 0.5,
    outputCostPer1M: 30,
    tier: 'Ultra Lightweight',
    contextWindow: '512k',
    description: 'Low-latency classification, packet framing, and receipt metadata indexing',
    speedRating: 5.0,
  },
  'GPT-5.5': {
    name: 'GPT-5.5',
    inputCostPer1M: 125,
    cachedCostPer1M: 12.5,
    outputCostPer1M: 750,
    tier: 'Legacy Reasoning',
    contextWindow: '256k',
    description: 'Previous-generation frontier model baseline for regression parity',
    speedRating: 4.0,
  },
  'GPT-5.3-Codex': {
    name: 'GPT-5.3-Codex',
    inputCostPer1M: 43.75,
    cachedCostPer1M: 4.375,
    outputCostPer1M: 350,
    tier: 'Code Specialization',
    contextWindow: '128k',
    description: 'Optimized compiler agent for test verification, AST linting, and diff extraction',
    speedRating: 4.6,
  },
};

export const MODEL_LIST: AIModelKey[] = [
  'GPT-5.6 Sol',
  'GPT-5.6 Terra',
  'GPT-5.6 Luna',
  'GPT-5.5',
  'GPT-5.3-Codex',
];

export function calculateCreditEstimate(tokensSaved: number, modelKey: AIModelKey): number {
  const card = RATE_CARDS[modelKey] || RATE_CARDS['GPT-5.6 Terra'];
  const avgCostPer1M = (card.inputCostPer1M + card.outputCostPer1M) / 2;
  const credits = (tokensSaved / 1_000_000) * avgCostPer1M;
  return Number(credits.toFixed(4));
}
