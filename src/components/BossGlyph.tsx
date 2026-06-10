import { useId } from 'react';
import type { BossGlyphKind } from '../types';

/* 章ボス（歪み）を表す不穏なシルエット。ボスごとに固有の意匠を持たせる。
   P5の“シャドウ”的な気配を、各ボスの「概念」で描き分ける。 */
export function BossGlyph({
  accent = '#ff2d4a',
  down = false,
  kind = 'mask',
}: {
  accent?: string;
  down?: boolean;
  kind?: BossGlyphKind;
}) {
  const eye = down ? '#7a7a82' : accent;
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={`bght-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <circle cx="1" cy="1" r="0.9" fill={eye} opacity="0.5" />
        </pattern>
        <radialGradient id={`bgglow-${uid}`} cx="50%" cy="44%" r="58%">
          <stop offset="0%" stopColor={eye} stopOpacity={down ? 0.18 : 0.55} />
          <stop offset="100%" stopColor={eye} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="38" fill={`url(#bgglow-${uid})`} />
      <Body kind={kind} eye={eye} uid={uid} down={down} />
    </svg>
  );
}

function Body({ kind, eye, uid, down }: { kind: BossGlyphKind; eye: string; uid: string; down: boolean }) {
  const ink = '#0a0a0f';
  const ht = `url(#bght-${uid})`;
  switch (kind) {
    /* トイル：反復の鎖 ── 噛み合う鎖の輪が循環する */
    case 'chains':
      return (
        <g fill="none" stroke={eye} strokeWidth="4" strokeLinecap="round">
          <ellipse cx="31" cy="34" rx="13" ry="9" transform="rotate(-28 31 34)" />
          <ellipse cx="49" cy="46" rx="13" ry="9" transform="rotate(-28 49 46)" />
          <ellipse cx="40" cy="40" rx="9" ry="6" transform="rotate(-28 40 40)" stroke={ink} strokeWidth="6" />
          <ellipse cx="40" cy="40" rx="13" ry="9" transform="rotate(-28 40 40)" />
          {/* 循環の矢印 */}
          <path d="M58 24 A22 22 0 0 1 60 50" strokeWidth="2.5" opacity={down ? 0.3 : 0.8} />
          <path d="M60 50 l4 -6 m-4 6 l-6 -3" strokeWidth="2.5" opacity={down ? 0.3 : 0.8} />
        </g>
      );

    /* サイロ：孤立の壁 ── 積まれた煉瓦と中央の断絶 */
    case 'wall':
      return (
        <g>
          <rect x="14" y="16" width="52" height="50" fill={ink} stroke={eye} strokeWidth="2" />
          <g stroke={eye} strokeWidth="1.6" opacity="0.7">
            <line x1="14" y1="29" x2="66" y2="29" />
            <line x1="14" y1="41" x2="66" y2="41" />
            <line x1="14" y1="53" x2="66" y2="53" />
            <line x1="27" y1="16" x2="27" y2="29" />
            <line x1="53" y1="16" x2="53" y2="29" />
            <line x1="40" y1="29" x2="40" y2="41" />
            <line x1="27" y1="41" x2="27" y2="53" />
            <line x1="53" y1="41" x2="53" y2="53" />
            <line x1="40" y1="53" x2="40" y2="66" />
          </g>
          {/* 中央を裂く断絶 */}
          <path d="M40 16 L36 30 L44 42 L37 54 L42 66" fill="none" stroke={eye} strokeWidth="3" strokeLinejoin="round" opacity={down ? 0.4 : 1} />
          <rect x="14" y="16" width="52" height="50" fill={ht} opacity="0.18" />
        </g>
      );

    /* アンハード：届かぬ声 ── 消音されたスピーカー */
    case 'silence':
      return (
        <g>
          <path d="M20 32 L30 32 L42 22 L42 58 L30 48 L20 48 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
          <g fill="none" stroke={eye} strokeWidth="2.5" strokeLinecap="round" opacity={down ? 0.25 : 0.85}>
            <path d="M50 31 A12 12 0 0 1 50 49" />
            <path d="M56 25 A20 20 0 0 1 56 55" opacity="0.6" />
          </g>
          {/* 沈黙の打ち消し線 */}
          <line x1="18" y1="20" x2="62" y2="60" stroke={eye} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );

    /* サージ：無限の負荷 ── 押し寄せる津波の渦 */
    case 'wave':
      return (
        <g>
          <path
            d="M10 56 C18 56 20 40 34 40 C46 40 44 54 54 54 C60 54 60 44 56 40 C66 36 70 50 70 58 L70 70 L10 70 Z"
            fill={ink}
            stroke={eye}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 巻き込む渦 */}
          <path d="M56 40 A9 9 0 1 1 47 49" fill="none" stroke={eye} strokeWidth="3" strokeLinecap="round" />
          <path d="M10 56 C18 56 20 40 34 40 C46 40 44 54 54 54" fill={ht} opacity="0.2" />
          {/* 飛沫 */}
          <g fill={eye} opacity={down ? 0.3 : 0.9}>
            <circle cx="30" cy="30" r="2" />
            <circle cx="40" cy="24" r="1.6" />
            <circle cx="48" cy="30" r="1.4" />
          </g>
        </g>
      );

    /* OVERSEER：管理者 ── すべてを見通す単眼の監視塔 */
    case 'overseer':
      return (
        <g>
          {/* 角張った塔体 */}
          <path d="M40 6 L70 26 L62 70 L18 70 L10 26 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M40 6 L70 26 L62 70 L40 70 Z" fill={ht} opacity="0.2" />
          {/* 監視の単眼 */}
          <path d="M22 40 Q40 26 58 40 Q40 54 22 40 Z" fill={ink} stroke={eye} strokeWidth="2.5" />
          <circle cx="40" cy="40" r="8" fill={eye} />
          <circle cx="40" cy="40" r="3.4" fill={ink} />
          {/* 監視光線 */}
          <g stroke={eye} strokeWidth="1.6" opacity={down ? 0.2 : 0.65} strokeLinecap="round">
            <line x1="40" y1="40" x2="40" y2="14" />
            <line x1="40" y1="40" x2="18" y2="60" />
            <line x1="40" y1="40" x2="62" y2="60" />
          </g>
        </g>
      );

    /* リグレッション：崩落 ── ひび割れて崩れ落ちる構造物 */
    case 'crack':
      return (
        <g>
          {/* 積み上げたブロックが断層でずれ落ちる */}
          <path d="M16 18 L44 18 L40 40 L12 40 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M46 20 L66 22 L64 44 L42 42 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" transform="translate(2 6)" />
          <path d="M14 44 L40 44 L36 66 L10 64 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" transform="translate(3 4)" />
          <path d="M46 48 L68 50 L66 70 L44 68 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" transform="translate(-1 0)" />
          {/* 走る亀裂 */}
          <path d="M40 14 L37 30 L45 40 L36 52 L42 70" fill="none" stroke={eye} strokeWidth="3" strokeLinejoin="round" opacity={down ? 0.4 : 1} />
          {/* 砕けた破片 */}
          <g fill={eye} opacity={down ? 0.3 : 0.9}>
            <path d="M54 14 l4 3 l-3 3 z" />
            <path d="M22 70 l3 -4 l3 4 z" />
          </g>
        </g>
      );

    /* ノイズ：惑わしの霧 ── 信号を覆い隠す渦巻く霧 */
    case 'fog':
      return (
        <g>
          {/* 渦巻く霧の層 */}
          <g fill="none" stroke={eye} strokeWidth="3" strokeLinecap="round" opacity={down ? 0.4 : 0.9}>
            <path d="M14 30 Q26 22 40 30 T66 30" />
            <path d="M12 42 Q26 34 40 42 T68 42" opacity="0.8" />
            <path d="M16 54 Q28 46 40 54 T64 54" opacity="0.6" />
          </g>
          {/* 霧に飲まれかけた“信号”（中心の点） */}
          <circle cx="40" cy="42" r="6" fill={ink} stroke={eye} strokeWidth="2" />
          <circle cx="40" cy="42" r="2" fill={eye} />
          {/* 散乱するノイズ粒 */}
          <g fill={eye} opacity={down ? 0.25 : 0.75}>
            <circle cx="24" cy="24" r="1.4" />
            <circle cx="58" cy="26" r="1.6" />
            <circle cx="60" cy="58" r="1.4" />
            <circle cx="22" cy="60" r="1.5" />
            <circle cx="50" cy="62" r="1.2" />
          </g>
        </g>
      );

    /* スウォーム：群れバグ ── 無数の小さな虫が渦になって群れる */
    case 'swarm':
      return (
        <g>
          {/* 中心の親バグ（角張った甲虫） */}
          <path d="M40 30 L52 40 L40 54 L28 40 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
          <g stroke={eye} strokeWidth="2" strokeLinecap="round" opacity={down ? 0.4 : 1}>
            {/* 触角と脚 */}
            <line x1="36" y1="32" x2="30" y2="24" />
            <line x1="44" y1="32" x2="50" y2="24" />
            <line x1="30" y1="44" x2="22" y2="48" />
            <line x1="50" y1="44" x2="58" y2="48" />
          </g>
          <circle cx="40" cy="40" r="2.4" fill={eye} />
          {/* 群れなす子バグ（小菱形）が渦を巻く */}
          <g fill={ink} stroke={eye} strokeWidth="1.6" strokeLinejoin="round" opacity={down ? 0.3 : 0.9}>
            <path d="M20 22 L26 27 L20 32 L14 27 Z" />
            <path d="M58 18 L63 22 L58 27 L53 22 Z" />
            <path d="M64 42 L69 46 L64 51 L59 46 Z" />
            <path d="M54 60 L59 64 L54 69 L49 64 Z" />
            <path d="M24 58 L29 62 L24 67 L19 62 Z" />
            <path d="M12 42 L16 45 L12 49 L8 45 Z" />
          </g>
          {/* 渦の軌跡 */}
          <path d="M40 40 m-22 0 a22 22 0 1 1 6 14" fill="none" stroke={eye} strokeWidth="1.4" strokeDasharray="3 4" opacity={down ? 0.2 : 0.5} />
        </g>
      );

    /* ステレオ：固定観念の影 ── 檻に囚われた思考の貌 */
    case 'static':
      return (
        <g>
          {/* 思考の貌（灰色がかった角張る頭部） */}
          <path d="M40 12 L62 28 L56 56 L40 66 L24 56 L18 28 Z" fill={ink} stroke={eye} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M40 12 L62 28 L56 56 L40 66 Z" fill={ht} opacity="0.22" />
          {/* 同じ形に固定された両目 */}
          <rect x="28" y="34" width="9" height="4" fill={eye} />
          <rect x="43" y="34" width="9" height="4" fill={eye} />
          {/* 固定観念の檻（縦の格子が貌を縛る） */}
          <g stroke={eye} strokeWidth="2.5" strokeLinecap="round" opacity={down ? 0.3 : 0.95}>
            <line x1="26" y1="10" x2="26" y2="70" />
            <line x1="40" y1="6" x2="40" y2="74" />
            <line x1="54" y1="10" x2="54" y2="70" />
          </g>
        </g>
      );

    /* 汎用：角張った歪みのマスク */
    default:
      return (
        <g>
          <path d="M40 8 L66 26 L58 52 L40 72 L22 52 L14 26 Z" fill={ink} stroke={eye} strokeWidth="2" strokeLinejoin="round" />
          <path d="M40 8 L66 26 L58 52 L40 72 Z" fill={ht} opacity="0.25" />
          <path d="M26 34 L40 30 L38 42 L27 42 Z" fill={eye} />
          <path d="M54 34 L40 30 L42 42 L53 42 Z" fill={eye} />
          <path d="M30 54 L34 50 L38 54 L42 50 L46 54 L50 50" fill="none" stroke={eye} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
  }
}
