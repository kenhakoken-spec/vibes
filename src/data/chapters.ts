import type { Chapter, Edition } from '../types';
import { buildChapter0 } from './chapter0';
import { buildChapter1 } from './chapter1';
import { buildInterlude } from './interlude';
import { buildChapter2 } from './chapter2';
import { buildChapter3 } from './chapter3';
import { buildChapter4 } from './chapter4';
import { buildChapter5 } from './chapter5';
import { buildChapter6 } from './chapter6';
import { buildChapterF } from './chapterF';

/* =========================================================================
   章レジストリ。全7章を組み立てる。未実装の予告枠は現在なし。
   ========================================================================= */

export interface UpcomingChapter {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  boss: { name: string; title: string };
  upcoming: true;
}

/** 実装済みの章（プレイ可能） */
export function buildChapters(edition: Edition): Chapter[] {
  return [
    buildChapter0(edition),
    buildChapter1(edition),
    buildInterlude(edition),
    buildChapter2(edition),
    buildChapter3(edition),
    buildChapter4(edition),
    buildChapter5(edition),
    buildChapter6(edition),
    buildChapterF(edition),
  ];
}

/** ワールドマップに「予告」として並べる未実装の章（全章実装済みのため空） */
export const UPCOMING: UpcomingChapter[] = [];
