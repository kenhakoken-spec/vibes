import type { Challenge, ChoiceOption } from '../types';

/* =========================================================================
   AI シミュレーションエンジン
   いまはスクリプト化された応答を返すだけ。だが本物の Claude API へ
   差し替えられるよう、Provider インターフェース越しに呼んでいる。

   将来:  class ClaudeProvider implements AIProvider { ... fetch(/v1/messages) }
   ========================================================================= */

export interface AIResult {
  ok: boolean;
  /** AIが画面に話す本文（タイプライタ表示される） */
  response: string;
  /** 不正解/不十分のときの誘導メッセージ */
  nudge?: string;
}

export interface AIProvider {
  /** 選択式の課題を判定 */
  judgeChoice(challenge: Challenge, option: ChoiceOption): Promise<AIResult>;
  /** 自由記述の課題を判定 */
  judgeFreeText(challenge: Challenge, input: string): Promise<AIResult>;
}

/** ほんの少しの“考えている”間。臨場感のためだけの遅延。 */
const think = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class SimulatedProvider implements AIProvider {
  async judgeChoice(challenge: Challenge, option: ChoiceOption): Promise<AIResult> {
    await think(600);
    if (option.correct) {
      return { ok: true, response: challenge.successResponse };
    }
    return {
      ok: false,
      response: option.feedback,
      nudge: 'もう一度、いちばん具体的な頼み方を選んでみよう。',
    };
  }

  async judgeFreeText(challenge: Challenge, input: string): Promise<AIResult> {
    await think(750);
    const text = normalize(input);
    const keywords = challenge.keywords ?? [];
    const need = challenge.minKeywords ?? 2;

    const matched = keywords.filter((k) => text.includes(normalize(k)));
    const distinct = dedupeByMeaning(matched);
    const enoughLength = input.trim().length >= 8;

    if (distinct.length >= need && enoughLength) {
      return { ok: true, response: challenge.successResponse };
    }

    // 不十分なときは、その課題のヒントをそのまま誘導に使う（章ごとに適切）
    // ※両編の相棒が話すため、一人称（ぼく/アタシ）は使わない中立文
    const tooShort = !enoughLength;
    return {
      ok: false,
      response: tooShort
        ? 'うーん、もう少しだけ詳しく教えて。一言だと、何をすればいいか掴みきれない。'
        : 'なるほど、惜しい。あと少しだけ具体的に頼んでもらえれば、すぐ動ける。',
      nudge: challenge.hint,
    };
  }
}

/* ---- helpers -------------------------------------------------------- */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[、。．，！!？?\s]/g, '')
    .normalize('NFKC');
}

/** “押” と “押しても” のような同義の手がかりを、おおまかに1グループへ畳む */
function dedupeByMeaning(words: string[]): string[] {
  const groups: string[][] = [
    ['ボタン'],
    ['押', 'クリック', 'タップ'],
    ['反応', '無反応', '動か'],
    ['エラー', 'バグ', 'おかしい'],
    ['直', '修正', 'なおして'],
    ['入室', '表示', '出る'],
  ];
  const hit = new Set<string>();
  let loose = 0;
  for (const w of words) {
    const idx = groups.findIndex((g) => g.some((x) => w.includes(x) || x.includes(w)));
    hit.add(idx === -1 ? `loose-${loose++}` : `g-${idx}`);
  }
  return [...hit];
}

/* 既定のプロバイダ。差し替えるならここを変えるだけ。 */
export const ai: AIProvider = new SimulatedProvider();
