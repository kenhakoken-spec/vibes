import type { ReactNode } from 'react';

/* =========================================================================
   カタカナ複合語の語中折返し防止。
   「バイブコ／ーディング」のような語中折返しは読みづらく安っぽいので、
   4〜12文字のカタカナ連続（長音符含む）を white-space:nowrap の span で包む。
   13文字以上の連続は包まない（360px幅で行幅を超えてはみ出すより折返しを優先）。
   ========================================================================= */

const KATAKANA_RUN = /[ァ-ヶー]+/g;
const MIN_KEEP = 4;
const MAX_KEEP = 12;

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
