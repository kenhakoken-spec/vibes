import type { ReactNode } from 'react';

/* =========================================================================
   カタカナ複合語の語中折返し防止。
   「バイブコ／ーディング」「ペー／ジ」のような語中折返しは読みづらく
   安っぽいので、2〜12文字のカタカナ連続（長音符含む）を
   white-space:nowrap の span で包む。
   13文字以上の連続は包まない（360px幅で行幅を超えてはみ出すより折返しを優先）。
   ========================================================================= */

const KATAKANA_RUN = /[ァ-ヶー]+/g;
const MIN_KEEP = 2;
const MAX_KEEP = 12;

/* -------------------------------------------------------------------------
   行末1〜2文字のぶら下がり（「…盤面/を。」「…勝/つ。」）防止。
   text-wrap:pretty が効かない短いフレーズ向けに、文末の自然な切れ目
   （助詞・読点・ひらがな→漢字/カタカナの境界）から後ろを nowrap で固める。
   ------------------------------------------------------------------------- */

const TAIL_BOUND = /[のをにへとがはでやも、。，．・…―─〜「」『』（）() 　]/;
const HIRA = /[ぁ-ん]/;
const KANJI_KAT = /[一-鿿々ァ-ヶ]/;
const ALNUM = /[A-Za-z0-9]/;
const KAT = /[ァ-ヶー]/;

export function noWidow(text: string): ReactNode {
  const t = text.replace(/\s+$/, '');
  if (t.length < 8) return keepKatakana(text);
  let cut = -1;
  // 行末に残すかたまり(3〜8文字)の左端＝自然な切れ目を、右から探す
  for (let c = t.length - 3; c >= t.length - 8 && c > 1; c--) {
    const prev = t[c - 1];
    const at = t[c];
    if (TAIL_BOUND.test(prev) || (HIRA.test(prev) && KANJI_KAT.test(at))) {
      cut = c;
      break;
    }
  }
  if (cut < 0) {
    cut = t.length - 4;
    const prev = t[cut - 1];
    const at = t[cut];
    // カタカナ語/英単語の途中で固めない（語中折れ防止は keepKatakana の役目）
    if ((KAT.test(prev) && KAT.test(at)) || (ALNUM.test(prev) && ALNUM.test(at))) {
      return keepKatakana(text);
    }
  }
  if (t.length - cut > 8 || cut < 2) return keepKatakana(text);
  return (
    <>
      {keepKatakana(t.slice(0, cut))}
      <span className="nobr">{t.slice(cut)}</span>
      {text.slice(t.length)}
    </>
  );
}

export function keepKatakana(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(KATAKANA_RUN)) {
    const run = m[0];
    const at = m.index ?? 0;
    if (run.length < MIN_KEEP || run.length > MAX_KEEP) continue;
    if (at > last) nodes.push(text.slice(last, at));
    nodes.push(
      <span className="nobr" key={at}>
        {run}
      </span>,
    );
    last = at + run.length;
  }
  if (nodes.length === 0) return text;
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
