import { useId } from 'react';
import type { Expression, PortraitVariant } from '../types';

/* =========================================================================
   スタイライズド・キャラ肖像（SVG）— マンガ風の硬い陰影・インク輪郭・網点・
   リムライト。後でAI生成イラストに差し替えるなら imageSrc。
   ※ defのidはインスタンス毎にユニーク化（複数表示時のID衝突＝色化けを防ぐ）。
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

/** 眉。outer(耳側)→inner(鼻側)を表情ごとに上下させる。 */
function Brows({ L, R, sw, expr, color = INK }: { L: Brow; R: Brow; sw: number; expr: Expression; color?: string }) {
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
    if (expr === 'surprised') {
      const mx = (b.ox + b.ix) / 2;
      const my = Math.min(oy, iy) - 7;
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

/** 口。表情ごとに曲げ/開きを変える。 */
function Mouth({
  x,
  y,
  w,
  expr,
  color,
  sw = 2.4,
  op = 1,
}: {
  x: number;
  y: number;
  w: number;
  expr: Expression;
  color: string;
  sw?: number;
  op?: number;
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
      d = `M${x - w} ${y} Q${x} ${y + 3} ${x + w} ${y}`;
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
      {/* 肌（暗いベース・上から光） */}
      <linearGradient id={`skin-${uid}`} x1="0.35" y1="0" x2="0.65" y2="1">
        <stop offset="0%" stopColor="#2b2b36" />
        <stop offset="45%" stopColor="#191921" />
        <stop offset="100%" stopColor="#0a0a10" />
      </linearGradient>
      {/* 髪（深い・上に少し明るさ） */}
      <linearGradient id={`hair-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#1c1c26" />
        <stop offset="60%" stopColor="#0e0e16" />
        <stop offset="100%" stopColor="#050509" />
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

/* ---- HERO ----------------------------------------------------------- */
/* フード付き・うつむき加減で決意のある新人。アクセントは白（中立）。 */
function HeroSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 肩・フードの外側 */}
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        {/* 上半身マント／フード裾 */}
        <path d="M30 420 Q44 320 92 290 Q150 300 208 290 Q256 320 270 420 Z" fill={`url(#cloth-${uid})`} />
        {/* フード（頭を包む大きなシルエット） */}
        <path d="M70 168 Q60 78 150 56 Q240 78 230 168 Q236 232 196 262 L104 262 Q64 232 70 168 Z" fill={`url(#hair-${uid})`} />
      </g>
      {/* フード内側の影（顔を縁取る） */}
      <path d="M98 170 Q98 92 150 78 Q202 92 202 170 Q204 226 150 246 Q96 226 98 170 Z" fill="#060609" stroke={INK} strokeWidth="2" />
      {/* 顔（フードの奥・暗め） */}
      <path d="M114 168 Q114 116 150 108 Q186 116 186 168 Q186 214 150 230 Q114 214 114 168 Z" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2" />
      {/* 顔の右側キャストシャドウ */}
      <CastShadow d="M150 110 Q186 118 186 168 Q186 214 150 230 Z" opacity={0.34} />
      {/* 網点（影側） */}
      <path d="M150 124 Q182 132 182 168 Q180 206 150 222 Z" fill={`url(#halftone-${uid})`} opacity="0.22" />
      {/* 前髪の毛束（フードの縁から覗く） */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M118 120 Q126 150 110 168 Q108 138 118 120 Z" />
        <path d="M150 112 Q150 146 134 158 Q132 132 150 112 Z" />
        <path d="M182 122 Q176 150 190 168 Q192 140 182 122 Z" />
      </g>
      {/* 鋭い目（決意・伏し目がち） */}
      <g>
        <path d="M122 176 L143 170 L144 178 L123 182 Z" fill="#e9e9ef" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M178 176 L157 170 L156 178 L177 182 Z" fill="#e9e9ef" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="135" cy="176" r="2" fill="#0c0c12" />
        <circle cx="165" cy="176" r="2" fill="#0c0c12" />
        <circle cx="134.2" cy="175.2" r="0.8" fill="#fff" />
        <circle cx="164.2" cy="175.2" r="0.8" fill="#fff" />
      </g>
      {/* 眉（表情） */}
      <Brows L={{ ox: 120, oy: 166, ix: 144, iy: 162 }} R={{ ox: 180, oy: 166, ix: 156, iy: 162 }} sw={3} expr={expr} />
      {/* 鼻 */}
      <path d="M150 184 L153 196 L147 197" fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* 口（表情） */}
      <Mouth x={150} y={210} w={10} expr={expr} color="#000" op={0.55} sw={2.2} />
      {/* 襟元の留め具（白アクセント） */}
      <g fill={accent} stroke={INK} strokeWidth="1.5">
        <path d="M150 300 L138 320 L150 330 L162 320 Z" />
      </g>
      <path d="M118 296 Q150 308 182 296" fill="none" stroke={accent} strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
      {/* リムライト（フード輪郭・左上から） */}
      <path d="M70 168 Q60 78 150 56" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4.5" opacity="0.8" strokeLinecap="round" />
      {/* 白ハイライト（フード頂） */}
      <path d="M104 86 Q150 64 196 86" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.32" />
    </Frame>
  );
}

/* ---- CLAUDE --------------------------------------------------------- */
/* 落ち着いた知性派。アクセント色（赤系）を使う。整った前髪と細い目。 */
function ClaudeSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 後光リング */}
      <circle cx="150" cy="116" r="82" fill="none" stroke={accent} strokeOpacity={0.28} strokeWidth="2" />
      <circle cx="150" cy="116" r="90" fill="none" stroke={accent} strokeOpacity={0.12} strokeWidth="1" strokeDasharray="2 6" />
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        {/* 肩・ローブ */}
        <path d="M48 420 Q70 300 150 292 Q230 300 252 420 Z" fill={`url(#cloth-${uid})`} />
        {/* 髪（整ったミディアム） */}
        <path d="M86 124 Q80 50 150 44 Q220 50 214 124 Q216 200 150 218 Q84 200 86 124 Z" fill={`url(#hair-${uid})`} />
      </g>
      {/* 顔 */}
      <path d="M100 128 Q100 70 150 62 Q200 70 200 128 Q200 196 150 214 Q100 196 100 128 Z" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2" />
      {/* 右半分キャストシャドウ */}
      <CastShadow d="M150 62 Q200 70 200 128 Q200 196 150 214 Z" opacity={0.3} />
      <path d="M150 86 Q196 96 196 130 Q194 190 150 206 Z" fill={`url(#halftone-${uid})`} opacity="0.16" />
      {/* 前髪（中央分け・きれいな毛束） */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M150 54 Q120 60 100 110 Q98 78 116 64 Q132 54 150 54 Z" />
        <path d="M150 54 Q180 60 200 110 Q202 78 184 64 Q168 54 150 54 Z" />
        <path d="M150 58 Q146 92 134 108 Q140 80 150 58 Z" />
        <path d="M150 58 Q154 92 166 108 Q160 80 150 58 Z" />
      </g>
      {/* 髪のツヤ（白ハイライト帯） */}
      <path d="M118 70 Q132 60 146 60 L142 96 Q126 86 118 70 Z" fill={`url(#sheen-${uid})`} opacity="0.5" />
      {/* 細く理知的な目 */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M114 132 L138 126 L139 134 L116 138 Z" fill="#f4f4f8" />
        <path d="M186 132 L162 126 L161 134 L184 138 Z" fill="#f4f4f8" />
      </g>
      <g fill={accent}>
        <path d="M128 129 L136 127 L136 134 L128 135 Z" />
        <path d="M172 129 L164 127 L164 134 L172 135 Z" />
      </g>
      <g fill="#0c0c12">
        <circle cx="131" cy="131" r="1.8" />
        <circle cx="169" cy="131" r="1.8" />
      </g>
      <g fill="#fff" opacity="0.95">
        <circle cx="130.2" cy="130" r="1" />
        <circle cx="168.2" cy="130" r="1" />
      </g>
      {/* 眉（表情） */}
      <Brows L={{ ox: 114, oy: 122, ix: 138, iy: 117 }} R={{ ox: 186, oy: 122, ix: 162, iy: 117 }} sw={2.6} expr={expr} />
      {/* 鼻 */}
      <path d="M150 138 L153 152 L147 153" fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 口（表情） */}
      <Mouth x={150} y={170} w={12} expr={expr} color="#caa" sw={2.4} />
      {/* ローブの襟（V字・幾何的） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 296 L110 322 L126 396 L150 358 Z" fill="#1a1a24" />
        <path d="M150 296 L190 322 L174 396 L150 358 Z" fill="#101019" />
        <path d="M150 314 L138 396 L162 396 Z" fill="#0c0c14" />
      </g>
      <path d="M150 298 L110 322" stroke={accent} strokeWidth="2.5" opacity="0.85" strokeLinecap="round" />
      <path d="M150 298 L190 322" stroke={accent} strokeWidth="2.5" opacity="0.85" strokeLinecap="round" />
      <circle cx="150" cy="332" r="4" fill={accent} stroke={INK} strokeWidth="1.2" />
      <circle cx="150" cy="332" r="1.4" fill="#fff" opacity="0.9" />
      {/* リムライト */}
      <path d="M86 124 Q80 52 150 44" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4.5" opacity="0.8" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- CURSOR --------------------------------------------------------- */
/* 鋭く速いパンク。アクセントはシアン。逆立つスパイク髪。 */
function CursorSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        {/* 肩・ジャケット */}
        <path d="M50 420 Q66 300 150 292 Q234 300 250 420 Z" fill={`url(#cloth-${uid})`} />
        {/* 髪のベース塊 */}
        <path d="M92 78 L208 78 L222 138 L172 214 L128 214 L78 138 Z" fill={`url(#hair-${uid})`} />
      </g>
      {/* スパイク（逆立つ毛先・差し色） */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M92 80 L104 18 L126 78 Z" />
        <path d="M124 78 L150 8 L176 78 Z" />
        <path d="M174 78 L196 22 L208 80 Z" />
        <path d="M78 120 L62 96 L92 110 Z" />
        <path d="M222 120 L238 96 L208 110 Z" />
      </g>
      {/* スパイクのシアン先端ハイライト */}
      <g fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round" opacity="0.9">
        <path d="M104 24 L98 56" />
        <path d="M150 16 L150 54" />
        <path d="M194 28 L200 58" />
      </g>
      {/* 顔 */}
      <path d="M104 130 Q104 84 150 76 Q196 84 196 130 Q196 192 150 210 Q104 192 104 130 Z" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2" />
      {/* キャストシャドウ（攻めた逆三角の影） */}
      <CastShadow d="M150 76 Q196 84 196 130 Q196 192 150 210 Z" opacity={0.34} />
      <path d="M150 100 L192 132 L168 188 L150 196 Z" fill={`url(#halftone-${uid})`} opacity="0.2" />
      {/* 前髪のとがった毛束（顔にかかる） */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M116 84 L108 134 L128 100 Z" />
        <path d="M150 80 L142 124 L162 98 Z" />
        <path d="M184 84 L192 134 L172 100 Z" />
      </g>
      {/* 鋭い吊り目 */}
      <g fill={accent} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M112 138 L142 126 L141 138 L114 144 Z" />
        <path d="M188 138 L158 126 L159 138 L186 144 Z" />
      </g>
      <g fill="#0c0c12">
        <path d="M126 132 L138 129 L138 137 L127 138 Z" />
        <path d="M174 132 L162 129 L162 137 L173 138 Z" />
      </g>
      <g fill="#fff" opacity="0.95">
        <circle cx="129" cy="132.5" r="1" />
        <circle cx="171" cy="132.5" r="1" />
      </g>
      {/* 鋭い眉（表情） */}
      <Brows L={{ ox: 112, oy: 130, ix: 142, iy: 121 }} R={{ ox: 188, oy: 130, ix: 158, iy: 121 }} sw={3} expr={expr} />
      {/* 鼻 */}
      <path d="M150 146 L154 158 L148 159" fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 口（表情・差し色） */}
      <Mouth x={150} y={171} w={16} expr={expr} color={accent} sw={3} />
      {/* ジャケット襟（鋭角ラペル） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 300 L106 318 L128 394 L150 352 Z" fill="#15151e" />
        <path d="M150 300 L194 318 L172 394 L150 352 Z" fill="#0e0e16" />
      </g>
      <path d="M150 302 L150 352" stroke={accent} strokeWidth="2.5" strokeDasharray="3 4" opacity="0.9" />
      <path d="M150 300 L106 318" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      <path d="M150 300 L194 318" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      {/* 胸元のカーソル型マーク */}
      <path d="M150 244 L164 280 L151 272 L138 282 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* リムライト */}
      <path d="M78 138 L92 78 L150 8" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.8" strokeLinejoin="round" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- MENTOR --------------------------------------------------------- */
/* 厳格な老練の指南役。金（ゴールド）を内部で使う。顎髭・冠の帯。 */
function MentorSvg({ uid, expr }: SvgProps) {
  const gold = '#ffce3a';
  return (
    <Frame accent={gold} uid={uid}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        {/* 肩・重厚なローブ */}
        <path d="M24 420 Q50 286 150 276 Q250 286 276 420 Z" fill={`url(#cloth-${uid})`} />
        {/* 顎髭（フルベアード・大きなシルエット） */}
        <path d="M70 296 Q150 240 230 296 Q224 360 150 384 Q76 360 70 296 Z" fill={`url(#hair-${uid})`} />
        {/* 頭髪（後退気味・横に広い） */}
        <path d="M92 110 Q92 48 150 46 Q208 48 208 110 Q210 168 150 184 Q90 168 92 110 Z" fill={`url(#hair-${uid})`} />
      </g>
      {/* 顔 */}
      <path d="M102 116 Q102 64 150 56 Q198 64 198 116 Q198 200 150 240 Q102 200 102 116 Z" fill={`url(#skin-${uid})`} stroke={INK} strokeWidth="2" />
      {/* 右半分キャストシャドウ */}
      <CastShadow d="M150 56 Q198 64 198 116 Q198 200 150 240 Z" opacity={0.32} />
      <path d="M150 80 Q194 90 194 118 Q194 192 150 226 Z" fill={`url(#halftone-${uid})`} opacity="0.16" />
      {/* 後退した生え際＆白髪のツヤ */}
      <path d="M102 112 Q108 56 150 54 Q192 56 198 112 Q172 86 150 90 Q128 86 102 112 Z" fill="#23200f" stroke={INK} strokeWidth="2" />
      <path d="M118 64 Q150 52 182 64" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      {/* 厳しい眉（表情・太く） */}
      <Brows L={{ ox: 112, oy: 118, ix: 142, iy: 114 }} R={{ ox: 188, oy: 118, ix: 158, iy: 114 }} sw={3.4} expr={expr} />
      {/* 鋭い目（金の輝き） */}
      <g fill={gold} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M114 128 L142 122 L141 134 L116 138 Z" />
        <path d="M186 128 L158 122 L159 134 L184 138 Z" />
      </g>
      <g fill="#0c0c08">
        <circle cx="130" cy="129.5" r="1.9" />
        <circle cx="170" cy="129.5" r="1.9" />
      </g>
      <g fill="#fff" opacity="0.9">
        <circle cx="129" cy="128.6" r="0.9" />
        <circle cx="169" cy="128.6" r="0.9" />
      </g>
      {/* 鼻（高く厳格） */}
      <path d="M150 134 L156 156 L148 158" fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* 口元（表情・髭の中） */}
      <Mouth x={150} y={173} w={16} expr={expr} color="#000" op={0.55} sw={2.2} />
      {/* 顎髭の毛束ライン */}
      <g fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth="2" strokeLinecap="round">
        <path d="M118 300 Q126 340 150 360" />
        <path d="M150 300 L150 366" />
        <path d="M182 300 Q174 340 150 360" />
      </g>
      {/* 口髭 */}
      <path d="M118 168 Q150 188 182 168 Q170 200 150 204 Q130 200 118 168 Z" fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" />
      {/* 冠の帯（金・宝石付き） */}
      <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <rect x="112" y="40" width="76" height="9" rx="2" fill={gold} />
        <path d="M150 28 L156 42 L144 42 Z" fill={gold} />
      </g>
      <circle cx="150" cy="44.5" r="2.4" fill="#fff" opacity="0.85" />
      {/* リムライト */}
      <path d="M92 110 Q92 50 150 46" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4.5" opacity="0.8" strokeLinecap="round" />
    </Frame>
  );
}

const PORTRAITS: Record<PortraitVariant, (p: SvgProps) => React.ReactElement> = {
  hero: HeroSvg,
  claude: ClaudeSvg,
  cursor: CursorSvg,
  mentor: MentorSvg,
};
