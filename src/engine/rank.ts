import type { Rank } from '../types';

/** スコアと挑戦回数からランクを決める。一発正解ほど高い。 */
export function rankFor(score: number, attempts: number): Rank {
  const penalty = Math.max(0, attempts - 1) * 0.12;
  const v = score - penalty;
  if (v >= 0.95) return 'S';
  if (v >= 0.75) return 'A';
  if (v >= 0.5) return 'B';
  return 'C';
}

export const RANK_LABEL: Record<Rank, string> = {
  S: 'FLAWLESS',
  A: 'GREAT',
  B: 'GOOD',
  C: 'CLEAR',
};

export const RANK_COLOR: Record<Rank, string> = {
  S: '#ffce3a',
  A: '#ff2d4a',
  B: '#00e5ff',
  C: '#b7b7c2',
};
