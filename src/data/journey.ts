import type { Chapter } from '../types';

/* =========================================================================
   旅（ゴールまでの道のり）と成長の称号。
   第1〜第8章＝集めるべき8つの「力（バッジ）」。集め終えて最終章=OVERSEERへ。
   「まったく知らない新人」が力を集めるほど称号が上がり、成長を実感できる。
   ========================================================================= */

/** 獲得した力の数から、いまの称号（成長段階）を返す。 */
export function rankTitle(powers: number): string {
  if (powers >= 8) return '創造の達人';
  if (powers >= 6) return '熟練の創り手';
  if (powers >= 4) return '一人前の創り手';
  if (powers >= 2) return '駆け出しの創り手';
  if (powers >= 1) return '見習いの創り手';
  return '新人';
}

/** chapters のうち「力（バッジ）」を持つ章＝旅の本道（8つ）。元の並び順を保つ。 */
export function skillChapters(chapters: Chapter[]): { chapter: Chapter; index: number }[] {
  return chapters.map((chapter, index) => ({ chapter, index })).filter((x) => !!x.chapter.power);
}
