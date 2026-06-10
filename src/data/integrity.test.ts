import { describe, it, expect } from 'vitest';
import { buildChapters } from './chapters';
import { EDITIONS } from './editions';
import { GLOSSARY } from './glossary';
import { skillChapters } from './journey';
import { JOURNEY_POWER_LABELS } from '../components/Diagram';
import type { BossGlyphKind, Chapter, SceneId } from '../types';

/* 章データの不変条件を機械的に検証する。
   章が増えても「keyTermsが用語集に無い」「正解が0/複数」「sceneやglyphの打ち間違い」を即検知する保険。 */

const VALID_SCENES = new Set<SceneId>(['void', 'city', 'guild', 'cyber', 'archive', 'factory', 'sky', 'lab', 'data']);
const VALID_GLYPHS = new Set<BossGlyphKind>(['mask', 'chains', 'wall', 'silence', 'wave', 'overseer', 'crack', 'fog', 'swarm', 'static']);
const glossIds = new Set(GLOSSARY.map((t) => t.id));

/** 章内の「プレイヤーに表示される文字列」を場所つきで全て集める */
function visibleStrings(chapters: Chapter[]): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  for (const c of chapters) {
    out.push({ where: `${c.id} subtitle`, text: c.subtitle });
    if (c.recap) out.push({ where: `${c.id} recap`, text: c.recap });
    if (c.boss) out.push({ where: `${c.id} boss`, text: `${c.boss.name} ${c.boss.title} ${c.boss.blurb}` });
    for (const s of c.stages) {
      s.intro.forEach((l, i) => out.push({ where: `${s.id} intro[${i}]`, text: l.text }));
      s.outro.forEach((l, i) => out.push({ where: `${s.id} outro[${i}]`, text: l.text }));
      const ch = s.challenge;
      for (const [k, t] of Object.entries({
        brief: ch.brief, goal: ch.goal, hint: ch.hint, learn: ch.learn,
        question: ch.question, placeholder: ch.placeholder, sampleAnswer: ch.sampleAnswer,
        successResponse: ch.successResponse,
      })) {
        if (t) out.push({ where: `${s.id} ${k}`, text: t });
      }
      (ch.options ?? []).forEach((o) => {
        out.push({ where: `${s.id} option[${o.id}]`, text: o.text });
        out.push({ where: `${s.id} feedback[${o.id}]`, text: o.feedback });
      });
      out.push({ where: `${s.id} artifact`, text: [ch.artifact.title, ...ch.artifact.body, ch.artifact.buttonLabel ?? ''].join(' ') });
    }
  }
  return out;
}

/** 相棒の吹き出しとして表示される文字列（相棒の台詞・成功応答・選択肢フィードバック・設問） */
function partnerStrings(chapters: Chapter[], partnerId: string): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  for (const c of chapters) {
    for (const s of c.stages) {
      [...s.intro, ...s.outro].forEach((l, i) => {
        if (l.speaker === partnerId) out.push({ where: `${s.id} line[${i}]`, text: l.text });
      });
      const ch = s.challenge;
      out.push({ where: `${s.id} successResponse`, text: ch.successResponse });
      if (ch.question) out.push({ where: `${s.id} question`, text: ch.question });
      (ch.options ?? []).forEach((o) => out.push({ where: `${s.id} feedback[${o.id}]`, text: o.feedback }));
    }
  }
  return out;
}

describe('ジャーニー図と章データの整合', () => {
  it('journey 図の8つの力ラベルは、各章の power と順序まで一致する', () => {
    for (const ed of [EDITIONS.claude, EDITIONS.cursor]) {
      const powers = skillChapters(buildChapters(ed)).map((x) => x.chapter.power);
      expect(powers).toEqual([...JOURNEY_POWER_LABELS]);
    }
  });

  it('力（バッジ）を持つ章はちょうど8つ（称号閾値 rankTitle と連動）', () => {
    for (const ed of [EDITIONS.claude, EDITIONS.cursor]) {
      expect(skillChapters(buildChapters(ed)).length).toBe(8);
    }
  });

  it('章ボス（歪み）の名前は全章で一意', () => {
    for (const ed of [EDITIONS.claude, EDITIONS.cursor]) {
      const names = buildChapters(ed).flatMap((c) => (c.boss ? [c.boss.name] : []));
      expect(new Set(names).size, `重複: ${names.join(',')}`).toBe(names.length);
    }
  });
});

describe('CURSOR編の世界観・口調（編固有NGワード）', () => {
  const chapters = buildChapters(EDITIONS.cursor);

  it('「棟梁」「ギルド」「ぼく」がCURSOR編の表示文字列に残っていない', () => {
    const hits: string[] = [];
    for (const { where, text } of visibleStrings(chapters)) {
      for (const ng of ['棟梁', 'ギルド', 'ぼく']) {
        if (text.includes(ng)) hits.push(`${where} に「${ng}」: ${text}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('相棒カーサの吹き出しに「きみ」が残っていない（カーサの二人称はアンタ）', () => {
    const hits: string[] = [];
    for (const { where, text } of partnerStrings(chapters, EDITIONS.cursor.partner.id)) {
      if (text.includes('きみ')) hits.push(`${where}: ${text}`);
    }
    expect(hits).toEqual([]);
  });
});

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
