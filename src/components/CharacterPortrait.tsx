import { useId } from 'react';
import type { Expression, PortraitVariant } from '../types';

/* =========================================================================
   スタイライズド・キャラ肖像（SVG）— マンガ風の硬い陰影・インク輪郭・網点・
   リムライト。後でAI生成イラストに差し替えるなら imageSrc。
   ※ defのidはインスタンス毎にユニーク化（複数表示時のID衝突＝色化けを防ぐ）。

   顔の文法（全キャラ共通・最近の二宮和也を基準にしたナチュラル路線）:
   - 髪は作り込まないセンターパート/流しの短髪。額の見える三角形・分け目の
     根本の立ち上がり・左右非対称の毛流れで「自然な毛」を出す（マッシュ禁止）。
   - 目はタレ目気味の優しいアーモンド形（つり目NG）。眉は自然なアーチ。
   - 口は薄めの唇の穏やかな口元。気取らない愛嬌＋知的な余裕。
   ========================================================================= */

interface Props {
  variant: PortraitVariant;
  accent?: string;
  imageSrc?: string;
  className?: string;
  expr?: Expression;
}

export function CharacterPortrait({ variant, accent = '#ff2d4a', imageSrc, className, expr = 'neutral' }: Props) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  if (imageSrc) {
    return <img className={className} src={imageSrc} alt="" draggable={false} />;
  }
  const Svg = PORTRAITS[variant];
  return (
    <div className={className}>
      <Svg accent={accent} uid={uid} expr={expr} />
    </div>
  );
}

interface SvgProps {
  accent: string;
  uid: string;
  expr: Expression;
}

/* ---- 表情パーツ：眉と口で感情を出し分ける（はっきり大きめに） -------- */
type Brow = { ox: number; oy: number; ix: number; iy: number };

/** 眉。outer(耳側)→inner(鼻側)を表情ごとに上下させる。arch=trueで自然なアーチ眉（柔らかい印象）。 */
function Brows({ L, R, sw, expr, color = INK, arch = false }: { L: Brow; R: Brow; sw: number; expr: Expression; color?: string; arch?: boolean }) {
  // [outerΔy, innerΔy] 正=下げる
  const delta: Record<Expression, [number, number]> = {
    neutral: [0, 0],
    smile: [-2, -3],
    serious: [-2, 7],
    surprised: [-8, -8],
    worried: [4, -6],
  };
  const [od, idd] = delta[expr];
  const path = (b: Brow) => {
    const oy = b.oy + od;
    const iy = b.iy + idd;
    if (expr === 'surprised' || arch) {
      const mx = (b.ox + b.ix) / 2;
      const my = Math.min(oy, iy) - (expr === 'surprised' ? 7 : 2.6);
      return `M${b.ox} ${oy} Q${mx} ${my} ${b.ix} ${iy}`;
    }
    return `M${b.ox} ${oy} L${b.ix} ${iy}`;
  };
  return (
    <g fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round">
      <path d={path(L)} />
      <path d={path(R)} />
    </g>
  );
}

/** 口。表情ごとに曲げ/開きを変える。warm=trueで中立時も穏やかで親しみのある微笑。 */
function Mouth({
  x,
  y,
  w,
  expr,
  color,
  sw = 2.4,
  op = 1,
  warm = false,
}: {
  x: number;
  y: number;
  w: number;
  expr: Expression;
  color: string;
  sw?: number;
  op?: number;
  warm?: boolean;
}) {
  if (expr === 'surprised') {
    return <ellipse cx={x} cy={y + 2} rx={w * 0.5} ry={w * 0.52} fill="#180c10" stroke={color} strokeOpacity={op} strokeWidth={1.5} />;
  }
  let d: string;
  switch (expr) {
    case 'smile':
      d = `M${x - w - 1} ${y - 1} Q${x} ${y + 10} ${x + w + 1} ${y - 1}`;
      break;
    case 'serious':
      d = `M${x - w} ${y + 1} L${x + w} ${y + 1}`;
      break;
    case 'worried':
      d = `M${x - w} ${y + 2} Q${x} ${y - 6} ${x + w} ${y + 2}`;
      break;
    default:
      // 穏やかな微笑＝両口角を少しだけ上げる（隣にいてくれる優しさ）
      d = warm
        ? `M${x - w} ${y - 0.5} Q${x} ${y + 4} ${x + w} ${y - 0.5}`
        : `M${x - w} ${y} Q${x} ${y + 3} ${x + w} ${y}`;
  }
  return <path d={d} fill="none" stroke={color} strokeOpacity={op} strokeWidth={sw} strokeLinecap="round" />;
}

function Defs({ accent, uid }: { accent: string; uid: string }) {
  return (
    <defs>
      {/* 背景グロー */}
      <radialGradient id={`glow-${uid}`} cx="50%" cy="32%" r="64%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
        <stop offset="55%" stopColor={accent} stopOpacity="0.1" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </radialGradient>
      {/* 肌・大人用（メンター。落ち着いたトーンで年齢感） */}
      <linearGradient id={`skin2-${uid}`} x1="0.3" y1="0" x2="0.72" y2="1">
        <stop offset="0%" stopColor="#ecd0b8" />
        <stop offset="45%" stopColor="#cda08c" />
        <stop offset="80%" stopColor="#8f6a70" />
        <stop offset="100%" stopColor="#564050" />
      </linearGradient>
      {/* 肌・ソフト（卵形の柔らかい顔用。影もウォームに寄せて穏やかに） */}
      <linearGradient id={`skinSoft-${uid}`} x1="0.3" y1="0" x2="0.72" y2="1">
        <stop offset="0%" stopColor="#f6e0cd" />
        <stop offset="48%" stopColor="#e6b8a6" />
        <stop offset="82%" stopColor="#b8847f" />
        <stop offset="100%" stopColor="#7e5c64" />
      </linearGradient>
      {/* 髪・クロード用（グレーアッシュ＝ブラックペアン2期のニノの髪色） */}
      <linearGradient id={`hairC-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#b4b8c4" />
        <stop offset="52%" stopColor="#83889a" />
        <stop offset="100%" stopColor="#4a4e5e" />
      </linearGradient>
      {/* 髪・カーサ用（自然な黒。青みは抑えてソフトに） */}
      <linearGradient id={`hairK-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#34343e" />
        <stop offset="55%" stopColor="#1c1c24" />
        <stop offset="100%" stopColor="#0c0c12" />
      </linearGradient>
      {/* 髪・主人公用（ダークブラウンの爽やかな短髪） */}
      <linearGradient id={`hairH-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#604834" />
        <stop offset="55%" stopColor="#3d2c1e" />
        <stop offset="100%" stopColor="#22150b" />
      </linearGradient>
      {/* 髪・メンター用（白髪混じりのアイアングレー＝貫禄） */}
      <linearGradient id={`hairM-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#9aa0ad" />
        <stop offset="55%" stopColor="#646a78" />
        <stop offset="100%" stopColor="#343844" />
      </linearGradient>
      {/* 衣服（やや青みの暗色） */}
      <linearGradient id={`cloth-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#1a1a24" />
        <stop offset="100%" stopColor="#08080f" />
      </linearGradient>
      {/* 網点（マンガ風スクリーントーン） */}
      <pattern id={`halftone-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
        <circle cx="1.5" cy="1.5" r="1.2" fill={accent} opacity="0.65" />
      </pattern>
      {/* リムライト（輪郭の差し色） */}
      <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="0.45">
        <stop offset="0%" stopColor={accent} />
        <stop offset="55%" stopColor={accent} stopOpacity="0.55" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </linearGradient>
      {/* 白ハイライト用の柔らかなグラデ（髪のツヤ） */}
      <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.0" />
        <stop offset="45%" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0.0" />
      </linearGradient>
    </defs>
  );
}

function Frame({ children, accent, uid }: { children: React.ReactNode; accent: string; uid: string }) {
  return (
    <svg viewBox="0 0 300 420" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
      <Defs accent={accent} uid={uid} />
      <ellipse cx="150" cy="150" rx="152" ry="184" fill={`url(#glow-${uid})`} />
      {children}
    </svg>
  );
}

const INK = '#000';

/* 共通：左頬〜首にかかる硬いキャストシャドウ（マンガ風の落ち影） */
function CastShadow({ d, opacity = 0.32 }: { d: string; opacity?: number }) {
  return <path d={d} fill="#000" opacity={opacity} />;
}

/** 目。中心(cx,cy)に描き、flipで左右反転。
   デフォルトはタレ目気味の優しいアーモンド形（目尻がわずかに下がる＝つり目NG）。
   sharp=trueで切れ長の大人の目（メンター用）。irisで虹彩色を上書き（既定はaccent）。 */
function Eye({
  cx,
  cy,
  accent,
  uid,
  flip = false,
  size = 1.28,
  sharp = false,
  iris,
}: {
  cx: number;
  cy: number;
  accent: string;
  uid: string;
  flip?: boolean;
  size?: number;
  sharp?: boolean;
  iris?: string;
}) {
  const cid = `eyeclip-${uid}-${flip ? 'l' : 'r'}${sharp ? 's' : ''}`;
  const irisColor = iris ?? accent;
  // 横長のアーモンド形（+x=目尻側）。soft=目尻が目頭よりわずかに低い「タレ目気味」
  const sclera = sharp
    ? 'M-12 1 Q-5.5 -4.2 1.5 -4.6 Q9 -4.6 13 -1.4 Q10.2 2.8 2.5 3.8 Q-6 4 -12 1 Z'
    : 'M-12 0.2 Q-6 -4.8 0.5 -5.2 Q8.5 -5.2 12.5 1.4 Q9.5 4.6 2 5 Q-6 4.8 -12 0.2 Z';
  const upperLid = sharp
    ? 'M-12.5 1 Q-5 -5.2 2 -5.4 Q10 -5.2 14 -1.8'
    : 'M-12.5 0.2 Q-6.5 -6 0.5 -6 Q8.5 -5.6 13.2 1.8';
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -size : size} ${size})`}>
      <clipPath id={cid}>
        <path d={sclera} />
      </clipPath>
      {/* 白目は縁取らない（下まぶたの強い線＝アイライン感を避ける） */}
      <path d={sclera} fill="#eeedf4" />
      <g clipPath={`url(#${cid})`}>
        {/* 虹彩（大きめ＝まぶたに上下を切られて自然なアニメの目になる。やや鼻側＝カメラ目線） */}
        <circle cx="-0.5" cy="-0.3" r="6.6" fill={irisColor} />
        <circle cx="-0.5" cy="-0.3" r="6.2" fill="none" stroke="#14101a" strokeOpacity="0.5" strokeWidth="1.2" />
        <circle cx="-0.5" cy="-2.2" r="5.4" fill="#fff" opacity="0.12" />
        <path d="M-9 2.6 Q0 5.2 11 1.6 L11 7 -9 7 Z" fill="#000" opacity="0.16" />
        <circle cx="-0.5" cy="-0.2" r="3.4" fill="#14101a" />
        {/* 穏やかなキャッチライト（大小2つ・ギラつかせない） */}
        <circle cx="-2.2" cy="-2.2" r="1.3" fill="#fff" />
        <circle cx="2.4" cy="1.4" r="0.7" fill="#fff" opacity="0.7" />
        {/* 上まぶたの落ち影（目に奥行き） */}
        <path d="M-12 -2 Q0 -6.4 12.5 -2.4 L12.5 -7 -12 -7 Z" fill="#000" opacity="0.14" />
      </g>
      {/* 上まぶた（なだらかなアーチ・目尻側でゆるく下がる＝優しい目） */}
      <path d={upperLid} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      {/* 二重まぶたのライン */}
      <path d="M-9.5 -4.4 Q-0.5 -8 8.5 -5" fill="none" stroke={INK} strokeOpacity="0.28" strokeWidth="0.9" strokeLinecap="round" />
      {/* 下まぶた（淡く＝縁取らない） */}
      <path d="M-9 3.6 Q0 5.6 9.5 3" fill="none" stroke={INK} strokeOpacity="0.38" strokeWidth="1.1" strokeLinecap="round" />
      {/* 涙袋（控えめな甘さ） */}
      <path d="M-7.5 5.6 Q0 7.2 7.5 5.2" fill="none" stroke={INK} strokeOpacity="0.15" strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
}

/* ---- HERO ----------------------------------------------------------- */
/* プレイヤーの分身＝爽やかなナチュラル短髪の新人。フードは肩に下ろして素顔を見せる。
   癖は控えめに、でも確実にかっこよく。アクセントは白（中立）。 */
function HeroSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 肩・マント */}
      <path d="M30 420 Q44 308 92 278 Q150 288 208 278 Q256 308 270 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* 下ろしたフード（肩の後ろにたたまれた布） */}
      <path d="M92 282 Q150 246 208 282 Q204 302 150 296 Q96 302 92 282 Z" fill="#11111a" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M104 284 Q150 258 196 284" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1.6" />

      {/* 髪：後ろの自然な短髪シルエット（クラウンに量感） */}
      <path
        d="M97 128 Q90 42 150 33 Q210 42 203 128 Q203 148 197 160 Q192 168 189 154 Q187 140 187 124 L113 124 Q113 140 111 154 Q108 168 103 160 Q97 148 97 128 Z"
        fill={`url(#hairH-${uid})`}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* 首 */}
      <path d="M134 192 L133 226 Q150 238 167 226 L166 192 Z" fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M134 196 Q150 214 166 196 L166 192 L134 192 Z" fill="#000" opacity="0.22" />

      {/* 耳 */}
      <g fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M110 140 Q97 134 97 150 Q98 165 111 166 Z" />
        <path d="M190 140 Q203 134 203 150 Q202 165 189 166 Z" />
      </g>
      <g fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round">
        <path d="M103 147 Q106 152 104 158" />
        <path d="M197 147 Q194 152 196 158" />
      </g>

      {/* 顔（柔らかい卵形） */}
      <path
        d="M108 120 Q106 72 150 66 Q194 72 192 120 Q192 152 183 172 Q173 192 159 199 Q150 203 141 199 Q127 192 117 172 Q108 152 108 120 Z"
        fill={`url(#skinSoft-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <CastShadow d="M168 70 Q192 76 192 122 Q192 152 183 172 Q173 192 159 199 Q172 180 176 152 Q180 106 168 70 Z" opacity={0.12} />

      {/* もみあげ（こめかみ〜耳の上に自然にかぶせる） */}
      <g fill={`url(#hairH-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M105 106 Q99 134 102 158 Q108 167 113 155 Q109 132 113 114 Z" />
        <path d="M195 106 Q201 134 198 158 Q192 167 187 155 Q191 132 187 114 Z" />
      </g>

      {/* 前髪：ゆるいセンターパート（左右非対称の毛流れ・額の三角形を見せる） */}
      {/* 左バンク（小さい側） */}
      <path
        d="M147 64 Q139 45 125 46 Q100 53 98 96 Q97 117 102 130 Q107 136 111 128 Q115 120 114 110 Q120 123 128 113 Q133 105 131 95 Q138 102 142 92 Q145 84 143 76 Q144 69 147 64 Z"
        fill={`url(#hairH-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 右バンク（大きい側） */}
      <path
        d="M147 64 Q156 43 170 45 Q202 53 203 96 Q204 117 199 130 Q194 136 190 128 Q186 120 187 110 Q181 123 173 113 Q169 105 171 95 Q164 103 159 94 Q156 86 158 77 Q153 69 149 66 Q147 65 147 64 Z"
        fill={`url(#hairH-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 毛流れ（分け目から左右へ掃く） */}
      <g fill="none" stroke="#1c120a" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round">
        <path d="M140 68 Q124 78 114 98" />
        <path d="M132 57 Q113 66 104 90" />
        <path d="M154 66 Q172 76 183 98" />
        <path d="M162 56 Q184 64 193 90" />
      </g>
      {/* ツヤ */}
      <path d="M116 60 Q148 42 184 60 L178 76 Q150 60 122 76 Z" fill={`url(#sheen-${uid})`} opacity="0.2" />

      {/* タレ目気味の優しい目（プレイヤーの分身＝癖は控えめ） */}
      <Eye cx={130} cy={148} accent={accent} uid={uid} flip size={1.36} iris="#8e93a6" />
      <Eye cx={170} cy={148} accent={accent} uid={uid} size={1.36} iris="#8e93a6" />

      {/* 自然な眉（少し直線的＝新人の素直さと決意） */}
      <Brows L={{ ox: 115, oy: 129, ix: 144, iy: 128 }} R={{ ox: 185, oy: 129, ix: 156, iy: 128 }} sw={3} expr={expr} arch color="#241710" />
      {/* 鼻 */}
      <path d="M150 154 L153 168 L147 169" fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 148 L150 164" stroke="#fff" strokeOpacity={0.14} strokeWidth="1.5" strokeLinecap="round" />
      {/* 口（薄めの唇・穏やか） */}
      <Mouth x={150} y={184} w={10.5} expr={expr} color="#9c625c" sw={2} warm />

      {/* 襟元の留め具（白アクセント） */}
      <g fill={accent} stroke={INK} strokeWidth="1.5">
        <path d="M150 288 L138 308 L150 318 L162 308 Z" />
      </g>
      <path d="M118 284 Q150 296 182 284" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
      {/* リムライト（髪の左上から） */}
      <path d="M97 128 Q90 36 150 33" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.75" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- CLAUDE --------------------------------------------------------- */
/* ニノ直球：グレーアッシュのセンターパート（額の見える三角形・根本の立ち上がり・
   左右非対称の毛流れ）×タレ目気味の優しい目×薄い唇の穏やかな口元。
   「気取らない愛嬌＋知的な余裕」— 編の緋は襟と虹彩のアクセントで。 */
function ClaudeSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 後光リング */}
      <circle cx="150" cy="118" r="86" fill="none" stroke={accent} strokeOpacity={0.24} strokeWidth="2" />
      <circle cx="150" cy="118" r="94" fill="none" stroke={accent} strokeOpacity={0.1} strokeWidth="1" strokeDasharray="2 6" />

      {/* 肩・ローブ */}
      <path d="M40 420 Q58 272 150 260 Q242 272 260 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろの自然な短髪シルエット（クラウンに量感・耳に少しかかる程度） */}
      <path
        d="M97 128 Q90 42 150 33 Q210 42 203 128 Q203 148 197 160 Q192 168 189 154 Q187 140 187 124 L113 124 Q113 140 111 154 Q108 168 103 160 Q97 148 97 128 Z"
        fill={`url(#hairC-${uid})`}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* 首 */}
      <path d="M134 192 L133 228 Q150 240 167 228 L166 192 Z" fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M134 196 Q150 214 166 196 L166 192 L134 192 Z" fill="#000" opacity="0.22" />

      {/* 耳 */}
      <g fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M110 140 Q97 134 97 150 Q98 165 111 166 Z" />
        <path d="M190 140 Q203 134 203 150 Q202 165 189 166 Z" />
      </g>
      <g fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round">
        <path d="M103 147 Q106 152 104 158" />
        <path d="M197 147 Q194 152 196 158" />
      </g>

      {/* 顔（丸みのある柔らかい卵形＝細すぎない） */}
      <path
        d="M108 120 Q106 72 150 66 Q194 72 192 120 Q192 152 183 172 Q173 192 159 199 Q150 203 141 199 Q127 192 117 172 Q108 152 108 120 Z"
        fill={`url(#skinSoft-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 右輪郭に沿う淡い三日月影（柔らかい立体感だけ） */}
      <CastShadow d="M168 70 Q192 76 192 122 Q192 152 183 172 Q173 192 159 199 Q172 180 176 152 Q180 106 168 70 Z" opacity={0.12} />
      {/* 頬の血色（ごく控えめ） */}
      <ellipse cx="127" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.07" />
      <ellipse cx="173" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.05" />

      {/* もみあげ（こめかみ〜耳の上に自然にかぶせる＝前髪と隙間を作らない） */}
      <g fill={`url(#hairC-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M105 106 Q99 134 102 158 Q108 167 113 155 Q109 132 113 114 Z" />
        <path d="M195 106 Q201 134 198 158 Q192 167 187 155 Q191 132 187 114 Z" />
      </g>

      {/* 前髪：センターパート（分け目はやや左＝左右非対称。カーテンはこめかみまで覆い、毛先は丸く段差） */}
      {/* 左バンク（小さい側・分け目から左へ流す） */}
      <path
        d="M144 64 Q136 45 122 46 Q99 53 97 96 Q96 116 101 129 Q106 135 110 127 Q114 119 113 109 Q119 122 127 113 Q132 105 130 95 Q136 101 140 91 Q143 83 141 75 Q141 68 144 64 Z"
        fill={`url(#hairC-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 右バンク（大きい側・分け目から右へふんわり流す） */}
      <path
        d="M144 64 Q154 43 168 45 Q201 53 203 96 Q204 118 198 130 Q193 136 189 128 Q185 120 186 110 Q180 123 172 113 Q168 105 170 95 Q163 103 158 94 Q155 86 157 77 Q152 69 147 66 Q145 65 144 64 Z"
        fill={`url(#hairC-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 分け目の影（根本の立ち上がりを見せる短い線） */}
      <path d="M144 64 Q145 55 148 48" fill="none" stroke="#383c48" strokeWidth="1.4" strokeLinecap="round" />
      {/* 毛流れ（分け目から左右へ掃く・非対称） */}
      <g fill="none" stroke="#4a4e5c" strokeOpacity="0.65" strokeWidth="1.3" strokeLinecap="round">
        <path d="M137 68 Q122 78 112 98" />
        <path d="M129 58 Q111 66 103 90" />
        <path d="M152 66 Q170 76 181 98" />
        <path d="M160 56 Q182 64 192 90" />
        <path d="M148 76 Q159 90 165 104" />
      </g>
      {/* アッシュのハイライト（明るい筋＝柔らかい立ち上がり） */}
      <g fill="none" stroke="#dde0e8" strokeLinecap="round">
        <path d="M133 53 Q117 62 108 82" strokeOpacity="0.4" strokeWidth="1.3" />
        <path d="M160 50 Q180 60 189 82" strokeOpacity="0.34" strokeWidth="1.2" />
      </g>
      {/* ツヤ（柔らかい帯） */}
      <path d="M116 60 Q148 42 184 60 L178 76 Q150 60 122 76 Z" fill={`url(#sheen-${uid})`} opacity="0.22" />

      {/* タレ目気味の優しいアーモンド形の目 */}
      <Eye cx={130} cy={148} accent={accent} uid={uid} flip size={1.42} />
      <Eye cx={170} cy={148} accent={accent} uid={uid} size={1.42} />

      {/* 自然なアーチ眉（立てない・優しい） */}
      <Brows L={{ ox: 114, oy: 129, ix: 144, iy: 130 }} R={{ ox: 186, oy: 129, ix: 156, iy: 130 }} sw={3} expr={expr} arch color="#33343e" />
      {/* 鼻（すっと通す程度） */}
      <path d="M150 154 L153 168 L147 169" fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 148 L150 164" stroke="#fff" strokeOpacity={0.16} strokeWidth="1.5" strokeLinecap="round" />
      {/* 口（薄めの唇の穏やかな微笑） */}
      <Mouth x={150} y={184} w={11} expr={expr} color="#9c5a5e" sw={2} warm />

      {/* ローブの襟（V字・緋のアクセント） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 270 L116 292 L130 376 L150 332 Z" fill="#1a1a24" />
        <path d="M150 270 L184 292 L170 376 L150 332 Z" fill="#101019" />
      </g>
      <path d="M150 270 L116 292" stroke={accent} strokeWidth="2.4" opacity="0.85" strokeLinecap="round" />
      <path d="M150 270 L184 292" stroke={accent} strokeWidth="2.4" opacity="0.85" strokeLinecap="round" />
      <circle cx="150" cy="300" r="3.6" fill={accent} stroke={INK} strokeWidth="1.2" />
      {/* リムライト（髪の左上・控えめに調和） */}
      <path d="M97 128 Q90 36 150 33" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.6" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- CURSOR --------------------------------------------------------- */
/* クロードと同じ「ナチュラル短髪×柔らかい目元」の文法で、分け目を逆（やや右）に流し、
   シアンのメッシュ少量＋ピアスで個性（パンク感は小物で）。 */
function CursorSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 肩・ジャケット */}
      <path d="M42 420 Q58 272 150 260 Q242 272 258 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろの自然な黒髪短髪シルエット（クラウンに量感・右サイドだけ少し長く） */}
      <path
        d="M97 128 Q90 42 150 33 Q210 42 203 128 Q203 150 197 164 Q192 174 189 158 Q187 142 187 124 L113 124 Q113 140 111 154 Q108 168 103 160 Q97 148 97 128 Z"
        fill={`url(#hairK-${uid})`}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* 首 */}
      <path d="M134 192 L133 228 Q150 240 167 228 L166 192 Z" fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M134 196 Q150 214 166 196 L166 192 L134 192 Z" fill="#000" opacity="0.22" />

      {/* 耳＋シアンのピアス（パンクの名残り） */}
      <g fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M110 140 Q97 134 97 150 Q98 165 111 166 Z" />
        <path d="M190 140 Q203 134 203 150 Q202 165 189 166 Z" />
      </g>
      <g fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round">
        <path d="M103 147 Q106 152 104 158" />
        <path d="M197 147 Q194 152 196 158" />
      </g>
      <circle cx="101" cy="161" r="2" fill={accent} stroke={INK} strokeWidth="0.8" />
      <circle cx="199" cy="161" r="2" fill={accent} stroke={INK} strokeWidth="0.8" />

      {/* 顔（丸みのある柔らかい卵形） */}
      <path
        d="M108 120 Q106 72 150 66 Q194 72 192 120 Q192 152 183 172 Q173 192 159 199 Q150 203 141 199 Q127 192 117 172 Q108 152 108 120 Z"
        fill={`url(#skinSoft-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <CastShadow d="M168 70 Q192 76 192 122 Q192 152 183 172 Q173 192 159 199 Q172 180 176 152 Q180 106 168 70 Z" opacity={0.13} />
      <ellipse cx="127" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.06" />
      <ellipse cx="173" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.04" />

      {/* もみあげ（こめかみ〜耳の上に自然にかぶせる） */}
      <g fill={`url(#hairK-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M105 106 Q99 134 102 158 Q108 167 113 155 Q109 132 113 114 Z" />
        <path d="M195 108 Q201 138 198 162 Q192 171 187 158 Q191 134 187 116 Z" />
      </g>

      {/* 前髪：センターパート（分け目はやや右＝クロードと逆の非対称。カーテンはこめかみまで） */}
      {/* 左バンク（大きい側・分け目から左へ流す） */}
      <path
        d="M156 64 Q146 43 132 45 Q99 53 97 96 Q96 118 102 130 Q107 136 111 128 Q115 120 114 110 Q120 123 128 113 Q132 105 130 95 Q137 103 142 94 Q145 86 143 77 Q148 69 153 66 Q155 65 156 64 Z"
        fill={`url(#hairK-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 右バンク（小さい側） */}
      <path
        d="M156 64 Q164 45 178 46 Q201 53 203 96 Q204 116 199 129 Q194 135 190 127 Q186 119 187 109 Q181 122 173 113 Q168 105 170 95 Q164 101 160 91 Q157 83 159 75 Q159 68 156 64 Z"
        fill={`url(#hairK-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 分け目の影（根本の立ち上がり） */}
      <path d="M156 64 Q155 55 152 48" fill="none" stroke="#22222c" strokeWidth="1.4" strokeLinecap="round" />
      {/* シアンのメッシュ（毛流れに沿う控えめな筋＝差し色） */}
      <g fill="none" strokeLinecap="round">
        <path d="M138 54 Q118 64 107 88" stroke={accent} strokeWidth="2" opacity="0.55" />
        <path d="M147 72 Q135 86 129 102" stroke={accent} strokeWidth="1.8" opacity="0.5" />
        <path d="M172 54 Q186 64 192 86" stroke={accent} strokeWidth="1.8" opacity="0.45" />
      </g>
      {/* 毛流れ（分け目から左右へ掃く） */}
      <g fill="none" stroke="#05050a" strokeOpacity="0.55" strokeWidth="1.3" strokeLinecap="round">
        <path d="M148 66 Q128 76 117 98" />
        <path d="M143 76 Q134 90 129 104" />
        <path d="M165 62 Q180 72 188 94" />
      </g>
      {/* ツヤ */}
      <path d="M116 60 Q148 42 184 60 L178 76 Q150 60 122 76 Z" fill={`url(#sheen-${uid})`} opacity="0.2" />

      {/* タレ目気味の優しいアーモンド形の目 */}
      <Eye cx={130} cy={148} accent={accent} uid={uid} flip size={1.4} />
      <Eye cx={170} cy={148} accent={accent} uid={uid} size={1.4} />

      {/* 自然なアーチ眉 */}
      <Brows L={{ ox: 114, oy: 129, ix: 144, iy: 130 }} R={{ ox: 186, oy: 129, ix: 156, iy: 130 }} sw={3} expr={expr} arch color="#15151c" />
      {/* 鼻 */}
      <path d="M150 154 L153 168 L147 169" fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 148 L150 164" stroke="#fff" strokeOpacity={0.14} strokeWidth="1.5" strokeLinecap="round" />
      {/* 口（薄めの唇の穏やかな微笑・クールな差し色） */}
      <Mouth x={150} y={184} w={11} expr={expr} color="#7fb8c4" sw={2} warm />

      {/* ジャケット襟（鋭角ラペル） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 270 L110 290 L130 372 L150 326 Z" fill="#15151e" />
        <path d="M150 270 L190 290 L170 372 L150 326 Z" fill="#0e0e16" />
      </g>
      <path d="M150 272 L150 326" stroke={accent} strokeWidth="2.4" strokeDasharray="3 4" opacity="0.9" />
      <path d="M150 270 L110 290" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      <path d="M150 270 L190 290" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      {/* 胸元のカーソル型マーク */}
      <path d="M150 240 L162 270 L151 263 L140 271 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* リムライト */}
      <path d="M97 128 Q90 36 150 33" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.7" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- MENTOR --------------------------------------------------------- */
/* 大人の渋いイケメン。白髪混じりのオールバック×整えた短い顎髭で貫禄。
   切れ長の金の目・通った鼻筋。年齢感は髪色とほうれい線で残す。 */
function MentorSvg({ uid, expr }: SvgProps) {
  const gold = '#ffce3a';
  return (
    <Frame accent={gold} uid={uid}>
      {/* 肩・重厚なローブ */}
      <path d="M24 420 Q50 276 150 266 Q250 276 276 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろのシルエット（オールバックの量感・広めの頭） */}
      <path
        d="M99 120 Q93 38 150 30 Q207 38 201 120 Q201 142 196 154 Q191 162 188 150 Q186 136 186 118 L114 118 Q114 136 112 150 Q109 162 104 154 Q99 142 99 120 Z"
        fill={`url(#hairM-${uid})`}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* 首（大人の太さ） */}
      <path d="M132 196 L131 230 Q150 242 169 230 L168 196 Z" fill={`url(#skin2-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M132 200 Q150 218 168 200 L168 196 L132 196 Z" fill="#000" opacity="0.24" />

      {/* 耳 */}
      <g fill={`url(#skin2-${uid})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M109 138 Q96 132 96 148 Q97 163 110 164 Z" />
        <path d="M191 138 Q204 132 204 148 Q203 163 190 164 Z" />
      </g>

      {/* 顔（やや長め・顎のしっかりした骨格） */}
      <path
        d="M106 118 Q104 68 150 60 Q196 68 194 118 Q194 152 186 174 Q177 196 162 204 Q150 209 138 204 Q123 196 114 174 Q106 152 106 118 Z"
        fill={`url(#skin2-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 右輪郭の影（彫りの深さ） */}
      <CastShadow d="M166 64 Q194 72 194 120 Q194 152 186 174 Q177 196 162 204 Q174 184 178 154 Q182 104 166 64 Z" opacity={0.18} />

      {/* もみあげ（顎髭へつながる） */}
      <g fill={`url(#hairM-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M106 108 Q102 136 107 162 Q112 170 116 158 Q112 132 115 112 Z" />
        <path d="M194 108 Q198 136 193 162 Q188 170 184 158 Q188 132 185 112 Z" />
      </g>

      {/* 前髪：オールバック（生え際を見せて後ろへ流す。中央にゆるいウィドウズピーク） */}
      <path
        d="M104 116 Q98 46 150 38 Q202 46 196 116 Q193 104 190 100 Q180 80 166 76 Q156 72 150 84 Q144 72 134 76 Q120 80 110 100 Q107 104 104 116 Z"
        fill={`url(#hairM-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 後ろへ流れる毛流れ */}
      <g fill="none" stroke="#2c303a" strokeOpacity="0.6" strokeWidth="1.4" strokeLinecap="round">
        <path d="M128 78 Q123 60 130 46" />
        <path d="M150 82 Q150 60 150 44" />
        <path d="M172 78 Q177 60 170 46" />
      </g>
      {/* 白髪の筋（貫禄） */}
      <g fill="none" stroke="#e9ebf2" strokeLinecap="round">
        <path d="M139 79 Q136 60 141 45" strokeOpacity="0.55" strokeWidth="1.5" />
        <path d="M162 78 Q166 60 161 45" strokeOpacity="0.5" strokeWidth="1.4" />
        <path d="M118 88 Q112 72 118 56" strokeOpacity="0.4" strokeWidth="1.3" />
      </g>
      {/* ツヤ */}
      <path d="M120 58 Q150 42 180 58 L174 72 Q150 58 126 72 Z" fill={`url(#sheen-${uid})`} opacity="0.18" />

      {/* 切れ長の目（金の虹彩＝厳しさの中の知性） */}
      <Eye cx={129} cy={144} accent={gold} uid={uid} flip size={1.32} sharp />
      <Eye cx={171} cy={144} accent={gold} uid={uid} size={1.32} sharp />

      {/* 太く厳格な眉（表情連動） */}
      <Brows L={{ ox: 112, oy: 125, ix: 144, iy: 121 }} R={{ ox: 188, oy: 125, ix: 156, iy: 121 }} sw={3.4} expr={expr} color="#2e313c" />
      {/* 鼻（高く通った鼻筋） */}
      <path d="M150 150 L155 169 L147 170.5" fill="none" stroke="#000" strokeOpacity={0.42} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 142 L151 164" stroke="#fff" strokeOpacity={0.14} strokeWidth="1.5" strokeLinecap="round" />
      {/* ほうれい線（年齢の彫り・うっすら） */}
      <g fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" strokeLinecap="round">
        <path d="M137 174 Q133 182 135 189" />
        <path d="M163 174 Q167 182 165 189" />
      </g>
      {/* 口（薄め・厳しめでも穏やかさを残す） */}
      <Mouth x={150} y={181} w={11.5} expr={expr} color="#5e4248" sw={2.2} op={0.9} />

      {/* 顎髭：輪郭に沿う整えた短い髭（白髪混じり） */}
      <path
        d="M111 152 Q113 180 124 193 Q136 204 150 206 Q164 204 176 193 Q187 180 189 152 Q192 164 190 176 Q185 196 169 207 Q159 213 150 213 Q141 213 131 207 Q115 196 110 176 Q108 164 111 152 Z"
        fill={`url(#hairM-${uid})`}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* 顎先の髭（少しだけ厚みを出す） */}
      <path d="M136 196 Q150 203 164 196 Q161 208 150 210 Q139 208 136 196 Z" fill={`url(#hairM-${uid})`} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
      {/* 髭の白の筋 */}
      <g fill="none" stroke="#e9ebf2" strokeLinecap="round">
        <path d="M124 188 Q131 197 140 202" strokeOpacity="0.35" strokeWidth="1.2" />
        <path d="M176 188 Q169 197 160 202" strokeOpacity="0.3" strokeWidth="1.2" />
        <path d="M150 200 L150 210" strokeOpacity="0.35" strokeWidth="1.2" />
      </g>

      {/* 額の細い金環（棟梁の証＝控えめに残す） */}
      <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
        <rect x="120" y="42" width="60" height="7" rx="2" fill={gold} />
        <path d="M150 32 L155 44 L145 44 Z" fill={gold} />
      </g>
      <circle cx="150" cy="45.5" r="2" fill="#fff" opacity="0.85" />
      {/* リムライト */}
      <path d="M102 118 Q97 42 150 36" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.7" strokeLinecap="round" />
    </Frame>
  );
}

const PORTRAITS: Record<PortraitVariant, (p: SvgProps) => React.ReactElement> = {
  hero: HeroSvg,
  claude: ClaudeSvg,
  cursor: CursorSvg,
  mentor: MentorSvg,
};
