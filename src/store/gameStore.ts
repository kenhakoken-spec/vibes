import { create } from 'zustand';
import type { Chapter, Edition, EditionId, Screen, Stage, StageResult } from '../types';
import { EDITIONS } from '../data/editions';
import { buildChapters } from '../data/chapters';

/* ---- save / load (localStorage) ------------------------------------ */
const SAVE_KEY = 'vibe-guild:save';

interface SaveData {
  editionId: EditionId;
  results: Record<string, StageResult>;
  learned: string[];
}

function readSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as SaveData) : null;
  } catch {
    return null;
  }
}

function writeSave(d: SaveData) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(d));
  } catch {
    /* noop */
  }
}

export function hasSave(): boolean {
  const s = readSave();
  return !!s && (s.editionId === 'claude' || s.editionId === 'cursor');
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* noop */
  }
}

/* ---- ムービー風オープニングの初回再生フラグ（編ごと） ----------------- */
const OPENING_SEEN_PREFIX = 'vg-opening-seen-';

function hasSeenOpening(id: EditionId): boolean {
  try {
    return localStorage.getItem(OPENING_SEEN_PREFIX + id) === '1';
  } catch {
    return true; // localStorage不可ならOPに固執しない
  }
}

function markOpeningSeen(id: EditionId) {
  try {
    localStorage.setItem(OPENING_SEEN_PREFIX + id, '1');
  } catch {
    /* noop */
  }
}

interface GameState {
  screen: Screen;
  edition: Edition | null;
  chapters: Chapter[];
  chapterIndex: number;
  chapter: Chapter | null; // = chapters[chapterIndex]
  stageIndex: number;
  results: Record<string, StageResult>;
  learned: string[];

  pressStart: () => void;
  continueGame: () => void;
  selectEdition: (id: EditionId) => void;
  /** オープニング終了（SKIP含む）。見たことを記録し、序章へ直行する */
  finishOpening: () => void;
  /** world map -> open a chapter's stage map（ロックされていても入れる。注意はUI側） */
  enterChapter: (index: number) => void;
  /** チャプタークリア後、次の章へ直接進む */
  nextChapter: () => void;
  /** back to the world map */
  toWorld: () => void;
  enterStage: (index: number) => void;
  beginChallenge: () => void;
  completeChallenge: (attempts: number) => void;
  finishOutro: () => void;
  closeResult: () => void;
  backToTitle: () => void;

  currentStage: () => Stage | null;
  isUnlocked: (index: number) => boolean;
  isChapterUnlocked: (index: number) => boolean;
  isChapterCleared: (index: number) => boolean;
  clearedCount: () => number;
}

/** ?ed=claude&s=challenge で任意画面に飛んで確認できる（デバッグ） */
function bootstrap(): {
  screen: Screen;
  edition: Edition | null;
  chapters: Chapter[];
  chapter: Chapter | null;
  chapterIndex: number;
  stageIndex: number;
} {
  try {
    const p = new URLSearchParams(window.location.search);
    const ed = p.get('ed');
    const s = p.get('s') as Screen | null;
    const ci = Number(p.get('ch') ?? '0') || 0;
    const st = Number(p.get('st') ?? '0') || 0;
    if ((ed === 'claude' || ed === 'cursor') && s) {
      const edition = EDITIONS[ed];
      const chapters = buildChapters(edition);
      const idx = Math.min(ci, chapters.length - 1);
      const sidx = Math.min(st, (chapters[idx]?.stages.length ?? 1) - 1);
      return { screen: s, edition, chapters, chapter: chapters[idx], chapterIndex: idx, stageIndex: sidx };
    }
  } catch {
    /* noop */
  }
  return { screen: 'title', edition: null, chapters: [], chapter: null, chapterIndex: 0, stageIndex: 0 };
}

const boot = bootstrap();

export const useGame = create<GameState>((set, get) => ({
  screen: boot.screen,
  edition: boot.edition,
  chapters: boot.chapters,
  chapterIndex: boot.chapterIndex,
  chapter: boot.chapter,
  stageIndex: boot.stageIndex,
  results: {},
  learned: [],

  pressStart: () => set({ screen: 'edition' }),

  continueGame: () => {
    const s = readSave();
    if (!s) {
      set({ screen: 'edition' });
      return;
    }
    const edition = EDITIONS[s.editionId];
    const chapters = buildChapters(edition);
    set({
      edition,
      chapters,
      chapterIndex: 0,
      chapter: chapters[0],
      screen: 'world',
      stageIndex: 0,
      results: s.results ?? {},
      learned: s.learned ?? [],
    });
  },

  selectEdition: (id) => {
    const edition = EDITIONS[id];
    const chapters = buildChapters(edition);
    set({
      edition,
      chapters,
      chapterIndex: 0,
      chapter: chapters[0],
      // 初めての編ならムービー風オープニングから（編切替で未見の編も流れる＝仕様）
      screen: hasSeenOpening(id) ? 'world' : 'opening',
      stageIndex: 0,
      results: {},
      learned: [],
    });
    writeSave({ editionId: id, results: {}, learned: [] });
  },

  finishOpening: () => {
    const { edition, chapters } = get();
    if (edition) markOpeningSeen(edition.id);
    // 世界地図は序章クリア後に初めて見せる。OP直後は序章へ直行
    set({ chapterIndex: 0, chapter: chapters[0] ?? null, stageIndex: 0, screen: 'map' });
  },

  enterChapter: (index) => {
    const { chapters } = get();
    if (!chapters[index]) return;
    set({ chapterIndex: index, chapter: chapters[index], stageIndex: 0, screen: 'map' });
  },

  nextChapter: () => {
    const { chapters, chapterIndex } = get();
    const ni = chapterIndex + 1;
    if (chapters[ni]) {
      // 序章クリア直後だけは世界地図を経由する。
      // 師の語る「地図」＝旅の全体像（現在地▶と OVERSEER までの道）を最初の10分で見せるため。
      // 2章目以降のクリアは従来どおり次章マップへ直行。
      const viaWorld = chapters[chapterIndex]?.id === 'ch0';
      set({
        chapterIndex: ni,
        chapter: chapters[ni],
        stageIndex: 0,
        screen: viaWorld ? 'world' : 'map',
      });
    } else {
      set({ screen: 'world' });
    }
  },

  toWorld: () => set({ screen: 'world' }),

  enterStage: (index) => {
    if (!get().isUnlocked(index)) return;
    set({ stageIndex: index, screen: 'story-intro' });
  },

  beginChallenge: () => set({ screen: 'challenge' }),

  completeChallenge: (attempts) => {
    const { chapter, stageIndex, results, learned, edition } = get();
    const stage = chapter?.stages[stageIndex];
    if (!stage) return;
    const nextResults = { ...results, [stage.id]: { cleared: true, attempts } };
    const nextLearned = learned.includes(stage.challenge.learn)
      ? learned
      : [...learned, stage.challenge.learn];
    set({ screen: 'story-outro', results: nextResults, learned: nextLearned });
    if (edition) writeSave({ editionId: edition.id, results: nextResults, learned: nextLearned });
  },

  finishOutro: () => set({ screen: 'result' }),

  closeResult: () => {
    const { chapter, stageIndex } = get();
    const last = (chapter?.stages.length ?? 0) - 1;
    if (stageIndex >= last) {
      set({ screen: 'chapter-clear' });
    } else {
      // テンポ重視：章マップに戻らず、そのまま次のステージへ
      set({ stageIndex: stageIndex + 1, screen: 'story-intro' });
    }
  },

  backToTitle: () =>
    set({
      screen: 'title',
      edition: null,
      chapters: [],
      chapter: null,
      chapterIndex: 0,
      stageIndex: 0,
      results: {},
      learned: [],
    }),

  currentStage: () => {
    const { chapter, stageIndex } = get();
    return chapter?.stages[stageIndex] ?? null;
  },

  isUnlocked: (index) => {
    if (index === 0) return true;
    const { chapter, results } = get();
    const prev = chapter?.stages[index - 1];
    return !!prev && !!results[prev.id]?.cleared;
  },

  isChapterCleared: (index) => {
    const { chapters, results } = get();
    const ch = chapters[index];
    return !!ch && ch.stages.every((s) => results[s.id]?.cleared);
  },

  isChapterUnlocked: (index) => {
    if (index === 0) return true;
    return get().isChapterCleared(index - 1);
  },

  clearedCount: () => Object.values(get().results).filter((r) => r.cleared).length,
}));
