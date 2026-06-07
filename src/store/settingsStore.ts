import { create } from 'zustand';
import { bgm } from '../engine/bgm';

/* =========================================================================
   設定（サウンド/モーション）— localStorageに保存。
   ========================================================================= */

const KEY = 'vibe-guild:settings';

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';

/** 1文字あたりのms（小さいほど速い）。instantは0=即時。 */
export const TEXT_SPEED_MS: Record<TextSpeed, number> = {
  slow: 30,
  normal: 14, // 既定。以前(26)より速い
  fast: 6,
  instant: 0,
};

interface Persisted {
  sound: boolean;
  motion: boolean;
  textSpeed: TextSpeed;
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { sound: true, motion: true, textSpeed: 'normal', ...JSON.parse(raw) };
  } catch {
    /* noop */
  }
  return { sound: true, motion: true, textSpeed: 'normal' };
}

function save(p: Persisted) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* noop */
  }
}

interface SettingsState extends Persisted {
  open: boolean;
  openPanel: () => void;
  closePanel: () => void;
  toggleSound: () => void;
  toggleMotion: () => void;
  setTextSpeed: (s: TextSpeed) => void;
}

const initial = load();

export const useSettings = create<SettingsState>((set, get) => ({
  sound: initial.sound,
  motion: initial.motion,
  textSpeed: initial.textSpeed,
  open: false,
  openPanel: () => set({ open: true }),
  closePanel: () => set({ open: false }),
  toggleSound: () => {
    const sound = !get().sound;
    set({ sound });
    save({ sound, motion: get().motion, textSpeed: get().textSpeed });
    if (sound) bgm.start();
    else bgm.stop();
  },
  toggleMotion: () => {
    const motion = !get().motion;
    set({ motion });
    save({ sound: get().sound, motion, textSpeed: get().textSpeed });
    document.documentElement.classList.toggle('no-motion', !motion);
  },
  setTextSpeed: (textSpeed) => {
    set({ textSpeed });
    save({ sound: get().sound, motion: get().motion, textSpeed });
  },
}));

// 起動時にモーション設定を反映
if (!initial.motion && typeof document !== 'undefined') {
  document.documentElement.classList.add('no-motion');
}
