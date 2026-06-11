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
      {/* 髪・クロード用（柔らかいダークブラウン＝優しい印象のマッシュ） */}
      <linearGradient id={`hairC-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#54402f" />
        <stop offset="55%" stopColor="#37271b" />
        <stop offset="100%" stopColor="#1e130d" />
      </linearGradient>
      {/* 髪・カーサ用（自然な黒。青みは抑えてソフトに） */}
      <linearGradient id={`hairK-${uid}`} x1="0.3" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#2b2b34" />
        <stop offset="55%" stopColor="#17171f" />
        <stop offset="100%" stopColor="#0a0a10" />
      </linearGradient>
      {/* 肌・ソフト（卵形の柔らかい顔用。影もウォームに寄せて穏やかに） */}
      <linearGradient id={`skinSoft-${uid}`} x1="0.3" y1="0" x2="0.72" y2="1">
        <stop offset="0%" stopColor="#f6e0cd" />
        <stop offset="48%" stopColor="#e6b8a6" />
        <stop offset="82%" stopColor="#b8847f" />
        <stop offset="100%" stopColor="#7e5c64" />
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

/** 柔らかいアーモンド形の目（優しい正統派イケメン用）。中心(cx,cy)に描き、flipで左右反転。
   目尻は上げすぎず、二重まぶたのライン・穏やかなキャッチライト・控えめな涙袋で「優しい目」を作る。 */
function Eye({
  cx,
  cy,
  accent,
  uid,
  flip = false,
  size = 1.28,
}: {
  cx: number;
  cy: number;
  accent: string;
  uid: string;
  flip?: boolean;
  size?: number;
}) {
  const cid = `eyeclip-${uid}-${flip ? 'l' : 'r'}`;
  // 横長のアーモンド形（+x=目尻側。縦を抑えて男性的に・目尻はわずかに上がる程度＝穏やか）
  const sclera = 'M-12 1.2 Q-6 -4.8 1 -5.2 Q9 -5.4 12.5 -1.2 Q10 3 2.5 4.2 Q-6 4.8 -12 1.2 Z';
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -size : size} ${size})`}>
      <clipPath id={cid}>
        <path d={sclera} />
      </clipPath>
      {/* 白目は縁取らない（下まぶたの強い線＝アイライン感を避ける） */}
      <path d={sclera} fill="#eeedf4" />
      <g clipPath={`url(#${cid})`}>
        {/* 虹彩（大きめ＝まぶたに上下を切られて自然なアニメの目になる。やや鼻側＝カメラ目線） */}
        <circle cx="-0.5" cy="-0.5" r="6.6" fill={accent} />
        <circle cx="-0.5" cy="-0.5" r="6.2" fill="none" stroke="#14101a" strokeOpacity="0.5" strokeWidth="1.2" />
        <circle cx="-0.5" cy="-2.4" r="5.4" fill="#fff" opacity="0.12" />
        <path d="M-9 2.4 Q0 5 11 1.4 L11 7 -9 7 Z" fill="#000" opacity="0.16" />
        <circle cx="-0.5" cy="-0.4" r="3.4" fill="#14101a" />
        {/* 穏やかなキャッチライト（大小2つ・ギラつかせない） */}
        <circle cx="-2.2" cy="-2.4" r="1.3" fill="#fff" />
        <circle cx="2.4" cy="1.2" r="0.7" fill="#fff" opacity="0.7" />
        {/* 上まぶたの落ち影（目に奥行き） */}
        <path d="M-12 -2 Q0 -6.4 12.5 -2.8 L12.5 -7 -12 -7 Z" fill="#000" opacity="0.14" />
      </g>
      {/* 上まぶた（なだらかなアーチ・目尻で跳ね上げない／ここだけ太く＝男性的） */}
      <path d="M-12.5 1.2 Q-5.5 -5.8 1.5 -6 Q9.5 -6 13.5 -1.6" fill="none" stroke={INK} strokeWidth="2.3" strokeLinecap="round" />
      {/* 二重まぶたのライン */}
      <path d="M-9.5 -4.4 Q-0.5 -8.2 8.5 -5.6" fill="none" stroke={INK} strokeOpacity="0.3" strokeWidth="0.9" strokeLinecap="round" />
      {/* 下まぶた（淡く＝縁取らない） */}
      <path d="M-9 3.4 Q0 5.4 9.5 2.6" fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="1.1" strokeLinecap="round" />
      {/* 涙袋（控えめな甘さ） */}
      <path d="M-7.5 5.4 Q0 7 7.5 4.9" fill="none" stroke={INK} strokeOpacity="0.16" strokeWidth="0.9" strokeLinecap="round" />
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
/* 柔らかい正統派の知性イケメン。卵形の輪郭×ナチュラルマッシュのダークブラウン。
   「隣にいてくれる優しい天才」— 目尻を上げず、穏やかな微笑で。 */
function ClaudeSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 後光リング */}
      <circle cx="150" cy="118" r="86" fill="none" stroke={accent} strokeOpacity={0.24} strokeWidth="2" />
      <circle cx="150" cy="118" r="94" fill="none" stroke={accent} strokeOpacity={0.1} strokeWidth="1" strokeDasharray="2 6" />

      {/* 肩・ローブ（高めの位置＝大人の体格） */}
      <path d="M40 420 Q60 282 150 272 Q240 282 260 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろの短いマッシュシルエット（頭に沿わせて耳の高さで終える＝男性的な短さ。輪郭に微かな起伏） */}
      <path
        d="M99 124 Q93 52 124 43 Q136 39 150 40 Q165 39 177 44 Q207 54 201 124 Q201 144 195 158 Q190 168 187 156 Q184 140 184 122 L116 122 Q116 140 113 156 Q110 168 105 158 Q99 144 99 124 Z"
        fill={`url(#hairC-${uid})`}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      {/* 首（顎から自然につながる・短めでしっかり） */}
      <path d="M134 192 L133 238 Q150 250 167 238 L166 192 Z" fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M134 196 Q150 214 166 196 L166 192 L134 192 Z" fill="#000" opacity="0.22" />

      {/* 耳（マッシュの裾から覗く＝短髪の男性感） */}
      <g fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
        <path d="M110 140 Q97 134 97 150 Q98 165 111 166 Z" />
        <path d="M190 140 Q203 134 203 150 Q202 165 189 166 Z" />
      </g>
      <g fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="1.2" strokeLinecap="round">
        <path d="M103 147 Q106 152 104 158" />
        <path d="M197 147 Q194 152 196 158" />
      </g>

      {/* 顔（柔らかい卵形・顎は丸みを残しつつ少し縦に） */}
      <path
        d="M108 120 Q106 72 150 66 Q194 72 192 120 Q192 152 183 172 Q173 192 159 199 Q150 203 141 199 Q127 192 117 172 Q108 152 108 120 Z"
        fill={`url(#skinSoft-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 右輪郭に沿う淡い三日月影（柔らかい立体感だけ） */}
      <CastShadow d="M168 70 Q192 76 192 122 Q192 152 183 172 Q173 192 159 199 Q172 180 176 152 Q180 106 168 70 Z" opacity={0.12} />
      {/* 頬の血色（ごく控えめ＝男性的に） */}
      <ellipse cx="127" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.07" />
      <ellipse cx="173" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.05" />

      {/* もみあげ（耳の上半分に自然にかぶせる＝大人のマッシュ。右は前髪の掃き上がりに接続） */}
      <g fill={`url(#hairC-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M107 112 Q101 134 105 158 Q110 166 114 156 Q111 134 116 120 Z" />
        <path d="M191 102 Q200 130 196 158 Q191 166 187 156 Q190 130 183 110 Z" />
      </g>

      {/* 耳上のハネ（外向きの小さな遊び毛＝ヘルメット感を断つ） */}
      <g fill={`url(#hairC-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M101 132 Q92 138 90 148 Q99 146 104 139 Z" />
        <path d="M199 132 Q208 138 210 148 Q201 146 196 139 Z" />
      </g>

      {/* 流れのある前髪（左へ掃くマッシュ。毛先は斜めに切って自然な毛流れ＝ボウルカット感を断つ） */}
      <path
        d="M150 46 Q104 52 102 108 Q101 118 108 114 Q111 124 119 126 Q117 118 119 110 Q124 128 134 129 Q131 119 132 110 Q138 130 149 130 Q145 120 146 110 Q153 130 164 128 Q160 119 161 110 Q168 129 177 125 Q174 117 175 109 Q182 122 189 117 Q185 110 186 102 Q193 112 197 107 Q200 104 199 96 Q193 52 150 46 Z"
        fill={`url(#hairC-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* 毛流れの線（掃いた方向に沿わせる） */}
      <g fill="none" stroke="#1a100a" strokeOpacity="0.45" strokeWidth="1.3" strokeLinecap="round">
        <path d="M135 58 Q127 88 124 114" />
        <path d="M158 56 Q150 88 147 116" />
        <path d="M178 60 Q173 86 170 108" />
      </g>
      {/* 髪のツヤ（柔らかい帯＝天使の輪） */}
      <path d="M116 70 Q148 54 184 70 L178 86 Q150 72 124 86 Z" fill={`url(#sheen-${uid})`} opacity="0.26" />
      <g fill="none" strokeLinecap="round">
        <path d="M138 58 Q129 72 124 92" stroke="#e8d4b8" strokeOpacity="0.36" strokeWidth="1.3" />
        <path d="M164 58 Q175 72 180 90" stroke="#e8d4b8" strokeOpacity="0.28" strokeWidth="1.2" />
      </g>

      {/* やや大きめで優しいアーモンド形の目（横長＝穏やかで男性的） */}
      <Eye cx={130} cy={148} accent={accent} uid={uid} flip size={1.45} />
      <Eye cx={170} cy={148} accent={accent} uid={uid} size={1.45} />

      {/* 自然なアーチ眉（太め長め＝男性的・角度は立てない・表情連動） */}
      <Brows L={{ ox: 114, oy: 128, ix: 144, iy: 129 }} R={{ ox: 186, oy: 128, ix: 156, iy: 129 }} sw={3} expr={expr} arch color="#241710" />
      {/* 鼻（少し長め＝大人の骨格＋ハイライト） */}
      <path d="M150 154 L153 168 L147 169" fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 148 L150 164" stroke="#fff" strokeOpacity={0.16} strokeWidth="1.5" strokeLinecap="round" />
      {/* 口（穏やかで親しみのある微笑・やや広め＝男性的） */}
      <Mouth x={150} y={184} w={11} expr={expr} color="#9c5a5e" sw={2.2} warm />

      {/* ローブの襟（V字） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 282 L116 304 L130 384 L150 342 Z" fill="#1a1a24" />
        <path d="M150 282 L184 304 L170 384 L150 342 Z" fill="#101019" />
      </g>
      <path d="M150 282 L116 304" stroke={accent} strokeWidth="2.4" opacity="0.85" strokeLinecap="round" />
      <path d="M150 282 L184 304" stroke={accent} strokeWidth="2.4" opacity="0.85" strokeLinecap="round" />
      <circle cx="150" cy="312" r="3.6" fill={accent} stroke={INK} strokeWidth="1.2" />
      {/* リムライト（髪の左上・控えめに調和） */}
      <path d="M99 124 Q92 44 150 40" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.7" strokeLinecap="round" />
    </Frame>
  );
}

/* ---- CURSOR --------------------------------------------------------- */
/* 柔らかい正統派×パンクの名残り。自然な黒マッシュにシアンのメッシュ（差し色）で個性。
   目も口元も穏やかに——「速いけど、隣にいてくれる」相棒の顔。 */
function CursorSvg({ accent, uid, expr }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      {/* 肩・ジャケット（高めの位置＝大人の体格） */}
      <path d="M42 420 Q58 282 150 272 Q242 282 258 420 Z" fill={`url(#cloth-${uid})`} stroke={INK} strokeWidth="3" strokeLinejoin="round" />

      {/* 髪：後ろの短いマッシュシルエット（自然な黒・右サイドだけ少し長く＝遊び。輪郭に微かな起伏） */}
      <path
        d="M99 124 Q93 52 124 43 Q136 39 150 40 Q165 39 177 44 Q207 54 201 124 Q201 148 195 164 Q190 174 187 162 Q184 144 184 122 L116 122 Q116 140 113 156 Q110 168 105 158 Q99 144 99 124 Z"
        fill={`url(#hairK-${uid})`}
        stroke={INK}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      {/* 首（顎から自然につながる・短めでしっかり） */}
      <path d="M134 192 L133 238 Q150 250 167 238 L166 192 Z" fill={`url(#skinSoft-${uid})`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M134 196 Q150 214 166 196 L166 192 L134 192 Z" fill="#000" opacity="0.22" />

      {/* 耳（短髪の男性感）＋シアンのピアス（パンクの名残り） */}
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

      {/* 顔（柔らかい卵形・顎は丸みを残しつつ少し縦に） */}
      <path
        d="M108 120 Q106 72 150 66 Q194 72 192 120 Q192 152 183 172 Q173 192 159 199 Q150 203 141 199 Q127 192 117 172 Q108 152 108 120 Z"
        fill={`url(#skinSoft-${uid})`}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 右輪郭に沿う淡い三日月影 */}
      <CastShadow d="M168 70 Q192 76 192 122 Q192 152 183 172 Q173 192 159 199 Q172 180 176 152 Q180 106 168 70 Z" opacity={0.13} />
      <ellipse cx="127" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.06" />
      <ellipse cx="173" cy="167" rx="10" ry="4.5" fill={accent} opacity="0.04" />

      {/* もみあげ（耳の上半分にかぶせる・左は前髪の掃き上がりに接続・右だけ少し長く） */}
      <g fill={`url(#hairK-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M109 102 Q100 130 104 158 Q109 166 113 156 Q110 130 117 110 Z" />
        <path d="M193 112 Q200 136 196 162 Q191 170 187 159 Q189 136 184 120 Z" />
      </g>

      {/* 耳上のハネ（外向きの小さな遊び毛＝ヘルメット感を断つ・パンクの名残り） */}
      <g fill={`url(#hairK-${uid})`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
        <path d="M101 132 Q91 137 89 148 Q99 146 104 139 Z" />
        <path d="M199 130 Q210 134 213 146 Q202 145 196 138 Z" />
      </g>

      {/* 流れのある前髪（カーサは右へ掃く＝クロードと逆方向。毛先は斜めに切って自然な毛流れ） */}
      <path
        d="M150 46 Q196 52 198 108 Q199 118 192 114 Q189 124 181 126 Q183 118 181 110 Q176 128 166 129 Q169 119 168 110 Q162 130 151 130 Q155 120 154 110 Q147 130 136 128 Q140 119 139 110 Q132 129 123 125 Q126 117 125 109 Q118 122 111 117 Q115 110 114 102 Q107 112 103 107 Q100 104 101 96 Q107 52 150 46 Z"
        fill={`url(#hairK-${uid})`}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* シアンのメッシュ（差し色＝パンクの名残り。掃いた毛流れに沿う控えめな筋） */}
      <g fill="none" strokeLinecap="round">
        <path d="M165 58 Q172 88 176 114" stroke={accent} strokeWidth="2.2" opacity="0.6" />
        <path d="M128 62 Q124 84 121 104" stroke={accent} strokeWidth="2.2" opacity="0.6" />
        <path d="M194 122 Q198 140 194 158" stroke={accent} strokeWidth="1.8" opacity="0.5" />
      </g>
      {/* 毛流れの線（掃いた方向に沿わせる） */}
      <g fill="none" stroke="#05050a" strokeOpacity="0.5" strokeWidth="1.3" strokeLinecap="round">
        <path d="M142 56 Q150 88 153 116" />
        <path d="M122 60 Q127 86 130 108" />
      </g>
      {/* 髪のツヤ（柔らかい帯） */}
      <path d="M116 70 Q148 54 184 70 L178 86 Q150 72 124 86 Z" fill={`url(#sheen-${uid})`} opacity="0.22" />

      {/* やや大きめで優しいアーモンド形の目（横長＝穏やかで男性的） */}
      <Eye cx={130} cy={148} accent={accent} uid={uid} flip size={1.42} />
      <Eye cx={170} cy={148} accent={accent} uid={uid} size={1.42} />

      {/* 自然なアーチ眉（太め長め＝男性的・表情連動） */}
      <Brows L={{ ox: 114, oy: 128, ix: 144, iy: 129 }} R={{ ox: 186, oy: 128, ix: 156, iy: 129 }} sw={3} expr={expr} arch color="#15151c" />
      {/* 鼻（少し長め＝大人の骨格） */}
      <path d="M150 154 L153 168 L147 169" fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 148 L150 164" stroke="#fff" strokeOpacity={0.14} strokeWidth="1.5" strokeLinecap="round" />
      {/* 口（穏やかで親しみのある微笑・クールな差し色・やや広め） */}
      <Mouth x={150} y={184} w={11} expr={expr} color="#7fb8c4" sw={2.2} warm />

      {/* ジャケット襟（鋭角ラペル） */}
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 282 L110 302 L130 384 L150 338 Z" fill="#15151e" />
        <path d="M150 282 L190 302 L170 384 L150 338 Z" fill="#0e0e16" />
      </g>
      <path d="M150 284 L150 338" stroke={accent} strokeWidth="2.4" strokeDasharray="3 4" opacity="0.9" />
      <path d="M150 282 L110 302" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      <path d="M150 282 L190 302" stroke={accent} strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
      {/* 胸元のカーソル型マーク */}
      <path d="M150 252 L162 282 L151 275 L140 283 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      {/* リムライト（控えめに調和） */}
      <path d="M99 124 Q92 44 150 40" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.7" strokeLinecap="round" />
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
