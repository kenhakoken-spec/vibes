import { describe, it, expect } from 'vitest';
import { buildChapters } from './chapters';
import { EDITIONS } from './editions';
import { GLOSSARY } from './glossary';
import type { BossGlyphKind, SceneId } from '../types';

/* 章データの不変条件を機械的に検証する。
   章が増えても「keyTermsが用語集に無い」「正解が0/複数」「sceneやglyphの打ち間違い」を即検知する保険。 */

const VALID_SCENES = new Set<SceneId>(['void', 'city', 'guild', 'cyber', 'archive', 'factory', 'sky', 'lab', 'data']);
const VALID_GLYPHS = new Set<BossGlyphKind>(['mask', 'chains', 'wall', 'silence', 'wave', 'overseer', 'crack', 'fog']);
const glossIds = new Set(GLOSSARY.map((t) => t.id));

for (const ed of [EDITIONS.claude, EDITIONS.cursor]) {
  const chapters = buildChapters(ed);

  describe(`章データ整合性 (${ed.id})`, () => {
    it('ステージidは全章で一意', () => {
      const ids = chapters.flatMap((c) => c.stages.map((s) => s.id));
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('全 keyTerms が用語集(GLOSSARY)に存在する', () => {
      for (const c of chapters) {
        for (const k of c.keyTerms ?? []) {
          expect(glossIds.has(k), `${c.id} の keyTerm "${k}" が用語集に無い`).toBe(true);
        }
      }
    });

    it('boss.glyph は有効な種別', () => {
      for (const c of chapters) {
        if (c.boss?.glyph) expect(VALID_GLYPHS.has(c.boss.glyph), `${c.id}: ${c.boss.glyph}`).toBe(true);
      }
    });

    it('scene 値（章・ステージ）は有効', () => {
      for (const c of chapters) {
        if (c.scene) expect(VALID_SCENES.has(c.scene), `${c.id}: ${c.scene}`).toBe(true);
        for (const s of c.stages) {
          if (s.scene) expect(VALID_SCENES.has(s.scene), `${s.id}: ${s.scene}`).toBe(true);
        }
      }
    });

    it('choice課題は正解(correct:true)がちょうど1つ', () => {
      for (const c of chapters) {
        for (const s of c.stages) {
          if (s.challenge.kind === 'choice') {
            const n = (s.challenge.options ?? []).filter((o) => o.correct).length;
            expect(n, `${s.id} の正解数`).toBe(1);
          }
        }
      }
    });

    it('freeText課題は keywords / minKeywords / sampleAnswer を備える', () => {
      for (const c of chapters) {
        for (const s of c.stages) {
          if (s.challenge.kind === 'freeText') {
            expect((s.challenge.keywords ?? []).length, `${s.id} keywords`).toBeGreaterThan(0);
            expect(s.challenge.minKeywords ?? 0, `${s.id} minKeywords`).toBeGreaterThan(0);
            expect(Boolean(s.challenge.sampleAnswer), `${s.id} sampleAnswer`).toBe(true);
          }
        }
      }
    });

    it('各ステージは intro / outro / challenge を持つ', () => {
      for (const c of chapters) {
        for (const s of c.stages) {
          expect(Array.isArray(s.intro) && s.intro.length > 0, `${s.id} intro`).toBe(true);
          expect(Array.isArray(s.outro), `${s.id} outro`).toBe(true);
          expect(Boolean(s.challenge), `${s.id} challenge`).toBe(true);
        }
      }
    });
  });
}
