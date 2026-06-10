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

/** 口。表情ごとに曲げ/開きを変える。smirk=trueで中立時に口角を上げた不敵な口元。 */
function Mouth({
  x,
  y,
  w,
  expr,
  color,
  sw = 2.4,
  op = 1,
  smirk = false,
}: {
  x: number;
  y: number;
  w: number;
  expr: Expression;
  color: string;
  sw?: number;
  op?: number;
  smirk?: boolean;
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
      // 不敵な微笑＝右口角だけわずかに上げる（イケメンの余裕）
      d = smirk
        ? `M${x - w} ${y + 1} Q${x + w * 0.2} ${y + 3.5} ${x + w + 1.5} ${y - 2.5}`
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
      {/* 肌（明るめのライト面→クールな影。顔がはっきり読める“キャラ”の質感） */}
      <linearGradient id={`skin-${uid}`} x1="0.3" y1="0" x2="0.72" y2="1">
        <stop offset="0%" stopColor="#d8b4a6" />
        <stop offset="42%" stopColor="#a9838a" />
        <stop offset="78%" stopColor="#5d4654" />
        <stop offset="100%" stopColor="#2c2030" />
      </linearGradient>
      {/* 肌・相棒用（明るくクリア＝イケメンの透明感。Hero/Mentorは従来のskinを使う） */}
      <linearGradient id={`skin2-${uid}`} x1="0.3" y1="0" x2="0.72" y2="1">
        <stop offset="0%" stopColor="#f0d4c3" />
        <stop offset="45%" stopColor="#d2a49b" />
        <stop offset="80%" stopColor="#946f7c" />
        <stop offset="100%" stopColor="#5a4358" />
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

/** 大きく澄んだアニメ系の目（イケメン用）。中心(cx,cy)に描き、flipで左右反転。
   sharp=true で吊り目（クール系）。虹彩の陰影・大小キャッチライト・まつ毛・二重まで描く。 */
function Eye({
  cx,
  cy,
  accent,
  uid,
  flip = false,
  sharp = false,
  size = 1.28,
}: {
  cx: number;
  cy: number;
  accent: string;
  uid: string;
  flip?: boolean;
  sharp?: boolean;
  size?: number;
}) {
  const cid = `eyeclip-${uid}-${flip ? 'l' : 'r'}-${sharp ? 's' : 'n'}`;
  // 切れ長・目尻上がり（+x=目尻側。右目はそのまま、左目はflipで反転して使う）
  const sclera = sharp
    ? 'M-13 2 L14 -8 L14 -4 L8 3 Q-4 5 -13 2 Z'
    : 'M-13 2 Q-4 -5 13 -7 Q15 -3 9 3 Q-3 5 -13 2 Z';
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -size : size} ${size})`}>
      <clipPath id={cid}>
        <path d={sclera} />
      </clipPath>
      <path d={sclera} fill="#f7f6fb" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <g clipPath={`url(#${cid})`}>
        {/* 虹彩（やや鼻側＝カメラ目線）＋上の光・下の影 */}
        <circle cx="-1.5" cy="-2.4" r="6" fill={accent} />
        <circle cx="-1.5" cy="-4.8" r="5.2" fill="#fff" opacity="0.22" />
        <path d="M-9 2 Q0 6 12 1 L12 8 -9 8 Z" fill="#000" opacity="0.22" />
        <circle cx="-1.5" cy="-2" r="2.6" fill="#0a0a12" />
        <circle cx="-3.2" cy="-3.8" r="1.7" fill="#fff" />
      </g>
      {/* 上まぶた（太く・目尻でしっかり跳ね上げ＝鋭い） */}
      <path
        d={sharp ? 'M-13 2 L14 -8 Q18 -10 21 -13' : 'M-13 2 Q-3 -7 13 -7 Q17 -9 20 -12'}
        fill="none"
        stroke={INK}
        strokeWidth={sharp ? 3.2 : 2.7}
        strokeLinecap="round"
      />
      {/* 涙袋（下まぶたのふくらみ＝目力と甘さ） */}
      <path d="M-9 4.6 Q-1 6.6 7 4.6" fill="none" stroke={INK} strokeOpacity="0.28" strokeWidth="1" strokeLinecap="round" />
    </g>
  );
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
      <circle cx="150" cy="118" r="86" fill="none" stroke={accent} strokeOpacity={0.24} strokeWidth="2" />
      <circle cx="150" cy="118" r="94" fill="none" stroke={accent} strokeOpacity={0.1} strokeWidth="1" strokeDasharray="2 6" />

      {/* 肩・ローブ */}
      <path d="M44 420 Q66 300 150 290 Q234 300 256 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろの大きな塊（やや尖った美しいシルエット） */}
      <path
        d="M92 150 Q78 52 150 42 Q222 52 208 150 Q214 110 196 84 Q176 60 150 58 Q124 60 104 84 Q86 110 92 150 Z"
        fill={`url(#hair-${uid})`}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 首（顎から自然につながる台形） */}
      <path d="M136 196 L134 244 Q150 256 166 244 L164 196 Z" fill={`url(#skin2-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M136 200 Q150 218 164 200 L164 196 L136 196 Z" fill="#000" opacity="0.26" />

      {/* 顔（ほどよく短い逆三角・顎先をシャープに＝端正な輪郭） */}
      <path
        d="M106 122 Q104 78 150 72 Q196 78 194 122 Q194 151 181 175 Q168 197 150 203 Q132 197 119 175 Q106 151 106 122 Z"
        fill={`url(#skin2-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 右輪郭に沿う三日月影（中央で割らない＝立体感だけ残す） */}
      <CastShadow d="M170 76 Q194 82 194 124 Q193 152 181 175 Q168 197 150 203 Q170 184 176 152 Q182 108 170 76 Z" opacity={0.16} />
      {/* 頬の赤み */}
      <ellipse cx="128" cy="170" rx="9" ry="4.5" fill={accent} opacity="0.14" />
      <ellipse cx="172" cy="170" rx="9" ry="4.5" fill={accent} opacity="0.1" />

      {/* 顔を縁取る長いサイドの毛束 */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M108 116 Q96 158 110 192 Q116 160 118 130 Z" />
        <path d="M192 116 Q204 158 190 192 Q184 160 182 130 Z" />
      </g>

      {/* 流れる前髪（右分け・軽く間引いて額を見せる。毛先は眉の上で止める） */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        {/* 分け目から左へ流れる大きな束 */}
        <path d="M162 52 Q116 56 100 112 Q110 86 126 76 Q114 98 110 120 Q126 86 142 76 Q134 94 132 110 Q144 84 158 72 Q154 60 162 52 Z" />
        {/* 右サイドへ落ちる束 */}
        <path d="M162 54 Q196 60 203 114 Q198 90 184 78 Q193 100 188 118 Q180 92 165 74 Q167 62 162 54 Z" />
        {/* 分け目の遊び毛（無造作な色気） */}
        <path d="M159 52 Q163 38 176 32 Q168 44 167 54 Z" />
      </g>
      {/* 髪のツヤ＋光の筋（ハイライトstreak） */}
      <path d="M122 68 Q140 58 156 58 L150 92 Q132 84 122 68 Z" fill={`url(#sheen-${uid})`} opacity="0.45" />
      <g fill="none" strokeLinecap="round">
        <path d="M148 64 Q128 72 116 96" stroke="#fff" strokeOpacity="0.34" strokeWidth="1.5" />
        <path d="M166 66 Q180 76 188 96" stroke="#fff" strokeOpacity="0.26" strokeWidth="1.3" />
        <path d="M138 70 Q126 80 120 98" stroke={accent} strokeOpacity="0.3" strokeWidth="1.1" />
      </g>

      {/* 大きく澄んだ切れ長の目（目尻上がり・気持ち大きめ） */}
      <Eye cx={132} cy={148} accent={accent} uid={uid} flip size={1.34} />
      <Eye cx={168} cy={148} accent={accent} uid={uid} size={1.34} />

      {/* 眉（目尻側をわずかに上げた凛とした角度・表情連動） */}
      <Brows L={{ ox: 119, oy: 130, ix: 144, iy: 134 }} R={{ ox: 181, oy: 130, ix: 156, iy: 134 }} sw={2.4} expr={expr} />
      {/* 鼻（細いブリッジ＋ハイライト） */}
      <path d="M150 156 L153 168 L147 169" fill="none" stroke="#000" strokeOpacity={0.34} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 150 L150 164" stroke="#fff" strokeOpacity={0.18} strokeWidth="1.6" strokeLinecap="round" />
      {/* 口（表情・小さめ上品。中立時は口角を上げた余裕の微笑） */}
      <Mouth x={150} y={186} w={9} expr={expr} color="#8c4752" sw={2.4} smirk />

      {/* ローブの襟（V字） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 300 L116 322 L130 398 L150 360 Z" fill="#1a1a24" />
        <path d="M150 300 L184 322 L170 398 L150 360 Z" fill="#101019" />
      </g>
      <path d="M150 300 L116 322" stroke={accent} strokeWidth="2.4" opacity="0.85" strokeLinecap="round" />
      <path d="M150 300 L184 322" stroke={accent} strokeWidth="2.4" opacity="0.85" strokeLinecap="round" />
      <circle cx="150" cy="330" r="3.6" fill={accent} stroke={INK} strokeWidth="1.2" />
      {/* リムライト（髪の左上） */}
      <path d="M92 150 Q78 54 150 42" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4.5" opacity="0.85" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- CURSOR --------------------------------------------------------- */
/* 鋭く速いパンク。アクセントはシアン。逆立つスパイク髪。 */
function CursorSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 肩・ジャケット */}
      <path d="M46 420 Q64 300 150 290 Q236 300 254 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろの塊（シャープでやや逆立つ） */}
      <path
        d="M94 152 Q80 56 150 46 Q220 56 206 152 Q214 104 192 80 Q176 58 150 56 Q122 58 106 82 Q86 106 94 152 Z"
        fill={`url(#hair-${uid})`}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 首（顎から自然につながる台形） */}
      <path d="M136 196 L134 244 Q150 256 166 244 L164 196 Z" fill={`url(#skin2-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M136 200 Q150 218 164 200 L164 196 L136 196 Z" fill="#000" opacity="0.26" />

      {/* 顔（ほどよく短い逆三角・顎先をシャープに） */}
      <path
        d="M106 122 Q104 78 150 72 Q196 78 194 122 Q194 151 181 175 Q168 197 150 203 Q132 197 119 175 Q106 151 106 122 Z"
        fill={`url(#skin2-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 右輪郭に沿う三日月影（中央で割らない） */}
      <CastShadow d="M170 76 Q194 82 194 124 Q193 152 181 175 Q168 197 150 203 Q170 184 176 152 Q182 108 170 76 Z" opacity={0.18} />
      <ellipse cx="128" cy="170" rx="9" ry="4.5" fill={accent} opacity="0.12" />
      <ellipse cx="172" cy="170" rx="9" ry="4.5" fill={accent} opacity="0.08" />

      {/* 顔を縁取る鋭いサイド毛束 */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M108 116 Q98 156 106 190 L118 150 L118 130 Z" />
        <path d="M192 116 Q202 156 194 190 L182 150 L182 130 Z" />
      </g>

      {/* アシンメトリーの尖った前髪（間引いて軽く・毛先は眉の上で止める） */}
      <g fill={`url(#hair-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M150 48 Q102 54 96 122 L116 82 L110 116 L132 76 L128 108 L150 62 Z" />
        <path d="M150 52 Q198 58 205 120 L184 80 L190 114 L166 72 Z" />
        <path d="M152 56 L142 110 L158 78 Z" />
      </g>
      {/* 前髪のシアン差し色＋白の光の筋（streak） */}
      <g fill="none" strokeLinecap="round">
        <path d="M122 80 L113 112" stroke={accent} strokeWidth="2" opacity="0.85" />
        <path d="M150 62 L148 94" stroke={accent} strokeWidth="2" opacity="0.85" />
        <path d="M184 82 L189 112" stroke={accent} strokeWidth="2" opacity="0.85" />
        <path d="M136 70 L128 100" stroke="#fff" strokeWidth="1.3" opacity="0.3" />
        <path d="M168 68 L176 96" stroke="#fff" strokeWidth="1.3" opacity="0.26" />
      </g>

      {/* 鋭く澄んだ吊り目（目尻上がり） */}
      <Eye cx={132} cy={150} accent={accent} uid={uid} flip sharp />
      <Eye cx={168} cy={150} accent={accent} uid={uid} sharp />

      {/* 鋭い眉（目尻側が上がった凛々しい角度・表情連動） */}
      <Brows L={{ ox: 118, oy: 130, ix: 146, iy: 137 }} R={{ ox: 182, oy: 130, ix: 154, iy: 137 }} sw={2.8} expr={expr} />
      {/* 鼻 */}
      <path d="M150 158 L154 170 L147 171" fill="none" stroke="#000" strokeOpacity={0.34} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 152 L150 166" stroke="#fff" strokeOpacity={0.16} strokeWidth="1.6" strokeLinecap="round" />
      {/* 口（表情・クールな差し色。中立時は不敵に口角を上げる） */}
      <Mouth x={150} y={187} w={11} expr={expr} color="#7fb8c4" sw={2.4} smirk />

      {/* ジャケット襟（鋭角ラペル） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 300 L110 320 L130 398 L150 356 Z" fill="#15151e" />
        <path d="M150 300 L190 320 L170 398 L150 356 Z" fill="#0e0e16" />
      </g>
      <path d="M150 302 L150 356" stroke={accent} strokeWidth="2.4" strokeDasharray="3 4" opacity="0.9" />
      <path d="M150 300 L110 320" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      <path d="M150 300 L190 320" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      {/* 胸元のカーソル型マーク */}
      <path d="M150 270 L162 300 L151 293 L140 301 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* リムライト */}
      <path d="M94 152 Q80 58 150 46" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.85" strokeLinecap="round" />
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
