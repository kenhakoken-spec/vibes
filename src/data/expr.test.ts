import { describe, it, expect } from 'vitest';
import { inferExpr } from './expr';
import type { DialogueLine } from '../types';

const line = (text: string, expr?: DialogueLine['expr']): DialogueLine => ({ text, ...(expr ? { expr } : {}) });

describe('inferExpr', () => {
  it('明示された line.expr を最優先する（推定を上書き）', () => {
    // 本文は worried 推定だが、明示の serious が勝つ
    expect(inferExpr(line('崩落が始まる', 'serious'))).toBe('serious');
    expect(inferExpr(line('やった！', 'neutral'))).toBe('neutral');
  });

  it('感嘆符＋前向きな語で smile', () => {
    expect(inferExpr(line('やった！できた'))).toBe('smile');
    expect(inferExpr(line('いいね！その調子'))).toBe('smile');
  });

  it('驚きの語で surprised', () => {
    expect(inferExpr(line('まさか、そんな…'))).toBe('surprised');
    expect(inferExpr(line('なに！？'))).toBe('surprised');
  });

  it('脅威・不穏の語で worried', () => {
    expect(inferExpr(line('崩落が始まる'))).toBe('worried');
    expect(inferExpr(line('惑わしの霧に飲み込まれる'))).toBe('worried');
  });

  it('メンターは感情語が無ければ serious', () => {
    expect(inferExpr(line('道を選べ。'), 'mentor')).toBe('serious');
    // メンターでも前向き＋感嘆符なら smile が優先
    expect(inferExpr(line('よくやった！見事だ'), 'mentor')).toBe('smile');
  });

  it('感嘆符のみ（前向き語なし・非メンター）は smile', () => {
    expect(inferExpr(line('行くぞ！'))).toBe('smile');
  });

  it('特徴語が無ければ neutral', () => {
    expect(inferExpr(line('これはテスト用の文です'))).toBe('neutral');
    expect(inferExpr(line('ふむ。'), 'claude')).toBe('neutral');
  });
});
