import type { DialogueLine, Expression, PortraitVariant } from '../types';

/* =========================================================================
   立ち絵の表情の自動推定。
   セリフ本文のキーワードから感情を出し分ける（line.expr 指定があれば優先）。
   章作者が増えても触りやすいよう、語彙を名前付き配列に切り出し、ビューから分離。
   ========================================================================= */

/** 感嘆符（喜び/驚きの判定に使う） */
const BANG = /[！!]/;

/** うれしい・前向きな語。BANG と同時成立で smile。 */
export const SMILE_WORDS =
  /(やった|いいね|よし|すごい|完璧|見事|お見事|正解|できた|いける|行ける|嬉し|楽し|ありがと|最高)/;

/** 驚き・動揺の語。 */
export const SURPRISED_WORDS = /(まさか|なんだと|えっ|なに[!？?！]|本当に|信じられ|そんな…|！？)/;

/** 不安・脅威・不穏の語。 */
export const WORRIED_WORDS =
  /(まずい|危ない|やばい|しまった|崩れ|崩落|飲み込|惑わ|濁|奪わ|止まらな|壊れ|怖|恐ろし|不穏|歪|津波|霧)/;

/**
 * セリフ本文から表情を推定する。
 * 優先順位（先勝ち）: line.expr 明示 > 喜び(smile) > 驚き(surprised) > 不安(worried)
 *   > メンターは厳格(serious) > 感嘆符のみ(smile) > 平常(neutral)
 */
export function inferExpr(line: DialogueLine, portrait?: PortraitVariant): Expression {
  if (line.expr) return line.expr;
  const t = line.text;
  if (BANG.test(t) && SMILE_WORDS.test(t)) return 'smile';
  if (SURPRISED_WORDS.test(t)) return 'surprised';
  if (WORRIED_WORDS.test(t)) return 'worried';
  if (portrait === 'mentor') return 'serious';
  if (BANG.test(t)) return 'smile';
  return 'neutral';
}
