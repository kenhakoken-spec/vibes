import { create } from 'zustand';

interface GlossaryUI {
  /** 表示中: 用語id / 'index'(一覧) / null(閉) */
  active: string | 'index' | null;
  openTerm: (id: string) => void;
  openIndex: () => void;
  close: () => void;
}

export const useGlossary = create<GlossaryUI>((set) => ({
  active: null,
  openTerm: (id) => set({ active: id }),
  openIndex: () => set({ active: 'index' }),
  close: () => set({ active: null }),
}));
