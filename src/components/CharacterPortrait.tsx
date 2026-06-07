import { useId } from 'react';
import type { PortraitVariant } from '../types';

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
}

export function CharacterPortrait({ variant, accent = '#ff2d4a', imageSrc, className }: Props) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  if (imageSrc) {
    return <img className={className} src={imageSrc} alt="" draggable={false} />;
  }
  const Svg = PORTRAITS[variant];
  return (
    <div className={className}>
      <Svg accent={accent} uid={uid} />
    </div>
  );
}

interface SvgProps {
  accent: string;
  uid: string;
}

function Defs({ accent, uid }: SvgProps) {
  return (
    <defs>
      <radialGradient id={`glow-${uid}`} cx="50%" cy="34%" r="62%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
        <stop offset="60%" stopColor={accent} stopOpacity="0.08" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`skin-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22222c" />
        <stop offset="55%" stopColor="#15151c" />
        <stop offset="100%" stopColor="#0a0a10" />
      </linearGradient>
      <pattern id={`halftone-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
        <circle cx="1.5" cy="1.5" r="1.2" fill={accent} opacity="0.65" />
      </pattern>
      <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0%" stopColor={accent} />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

function Frame({ children, accent, uid }: SvgProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 300 420" width="100%" height="100%" preserveAspectRatio="xMidYMax meet">
      <Defs accent={accent} uid={uid} />
      <ellipse cx="150" cy="160" rx="150" ry="180" fill={`url(#glow-${uid})`} />
      {children}
    </svg>
  );
}

const INK = '#000';

/* ---- HERO ----------------------------------------------------------- */
function HeroSvg({ accent, uid }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M38 420 Q58 298 150 288 Q242 298 262 420 Z" fill={`url(#skin-${uid})`} />
        <path d="M83 150 Q150 64 217 150 Q233 224 200 256 L100 256 Q67 224 83 150 Z" fill="#101017" />
      </g>
      <path d="M106 158 Q150 126 194 158 Q200 216 150 232 Q100 216 106 158 Z" fill="#06060a" stroke={INK} strokeWidth="2" />
      <path d="M150 132 Q194 150 194 178 Q190 224 150 232 Z" fill={`url(#halftone-${uid})`} opacity="0.25" />
      <g fill={accent}>
        <rect x="119" y="180" width="22" height="7" rx="3" />
        <rect x="159" y="180" width="22" height="7" rx="3" />
      </g>
      <path d="M83 150 Q150 64 217 150" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.7" />
    </Frame>
  );
}

/* ---- CLAUDE --------------------------------------------------------- */
function ClaudeSvg({ accent, uid }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      <circle cx="150" cy="118" r="80" fill="none" stroke={accent} strokeOpacity="0.3" strokeWidth="2" />
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M52 420 Q74 300 150 292 Q226 300 248 420 Z" fill={`url(#skin-${uid})`} />
        <path d="M90 120 Q90 52 150 49 Q210 52 210 120 Q210 196 150 212 Q90 196 90 120 Z" fill="#13131b" />
      </g>
      <path d="M90 118 Q94 56 150 49 Q206 56 210 118 Q176 90 150 94 Q120 90 90 118 Z" fill="#1d1d28" stroke={INK} strokeWidth="2" />
      <path d="M150 60 Q210 70 210 120 Q210 196 150 212 Z" fill="#000" opacity="0.28" />
      <path d="M150 96 Q200 104 200 140 Q196 186 150 200 Z" fill={`url(#halftone-${uid})`} opacity="0.18" />
      <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M114 128 L136 122 L137 130 L116 133 Z" fill="#f4f4f8" />
        <path d="M186 128 L164 122 L163 130 L184 133 Z" fill="#f4f4f8" />
      </g>
      <g fill={accent}>
        <path d="M126 125 L134 123 L134 130 L126 131 Z" />
        <path d="M174 125 L166 123 L166 130 L174 131 Z" />
      </g>
      <g fill="#fff" opacity="0.9">
        <circle cx="130" cy="125.5" r="1.4" />
        <circle cx="170" cy="125.5" r="1.4" />
      </g>
      <path d="M114 127 L136 121" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M186 127 L164 121" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M140 162 Q150 167 160 162" fill="none" stroke="#caa" strokeWidth="2.4" strokeLinecap="round" />
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 296 L112 320 L126 392 L150 356 Z" fill="#1a1a24" />
        <path d="M150 296 L188 320 L174 392 L150 356 Z" fill="#101019" />
        <path d="M150 312 L138 392 L162 392 Z" fill="#0c0c14" />
      </g>
      <path d="M150 298 L112 320" stroke={accent} strokeWidth="2.5" opacity="0.8" />
      <path d="M150 298 L188 320" stroke={accent} strokeWidth="2.5" opacity="0.8" />
      <circle cx="150" cy="332" r="3.5" fill={accent} />
      <path d="M90 120 Q92 60 150 49" fill="none" stroke={`url(#rim-${uid})`} strokeWidth="4" opacity="0.7" />
    </Frame>
  );
}

/* ---- CURSOR --------------------------------------------------------- */
function CursorSvg({ accent, uid }: SvgProps) {
  return (
    <Frame accent={accent} uid={uid}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M52 420 Q70 298 150 290 Q230 298 248 420 Z" fill={`url(#skin-${uid})`} />
        <path d="M98 66 L202 66 L218 134 L170 210 L130 210 L82 134 Z" fill="#101019" />
      </g>
      <g fill={accent} stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M98 68 L116 20 L132 70 Z" opacity="0.9" />
        <path d="M132 70 L150 12 L168 70 Z" />
        <path d="M168 70 L184 24 L202 68 Z" opacity="0.9" />
      </g>
      <path d="M150 70 L218 134 L170 210 L150 210 Z" fill="#000" opacity="0.3" />
      <path d="M150 110 L196 140 L168 196 L150 196 Z" fill={`url(#halftone-${uid})`} opacity="0.2" />
      <g fill={accent} stroke={INK} strokeWidth="1.5">
        <path d="M112 128 L142 118 L140 134 Z" />
        <path d="M188 128 L158 118 L160 134 Z" />
      </g>
      <path d="M132 170 L168 160" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <path d="M150 300 L108 316 L128 390 L150 350 Z" fill="#15151e" />
        <path d="M150 300 L192 316 L172 390 L150 350 Z" fill="#0e0e16" />
      </g>
      <path d="M150 302 L150 350" stroke={accent} strokeWidth="2.5" strokeDasharray="3 4" opacity="0.85" />
      <path d="M150 300 L108 316" stroke={accent} strokeWidth="2" opacity="0.7" />
      <path d="M150 300 L192 316" stroke={accent} strokeWidth="2" opacity="0.7" />
      <path d="M150 246 L162 278 L150 270 L138 278 Z" fill="#fff" stroke={INK} strokeWidth="1.5" />
    </Frame>
  );
}

/* ---- MENTOR --------------------------------------------------------- */
function MentorSvg({ uid }: SvgProps) {
  const gold = '#ffce3a';
  return (
    <Frame accent={gold} uid={uid}>
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M28 420 Q54 284 150 274 Q246 284 272 420 Z" fill={`url(#skin-${uid})`} />
        <path d="M68 300 Q150 246 232 300 L212 342 Q150 310 88 342 Z" fill="#16140d" />
        <path d="M94 108 Q94 50 150 48 Q206 50 206 108 Q206 180 150 196 Q94 180 94 108 Z" fill="#13130f" />
      </g>
      <path d="M94 106 Q98 50 150 48 Q202 50 206 106 Q176 82 150 86 Q124 82 94 106 Z" fill="#1f1c12" stroke={INK} strokeWidth="2" />
      <path d="M150 58 Q206 68 206 108 Q206 180 150 196 Z" fill="#000" opacity="0.3" />
      <g fill={gold} stroke={INK} strokeWidth="1.5">
        <path d="M116 122 L142 120 L140 132 L116 132 Z" />
        <path d="M184 122 L158 120 L160 132 L184 132 Z" />
      </g>
      <path d="M116 166 Q150 222 184 166 Q172 202 150 206 Q128 202 116 166 Z" fill="#0c0c08" stroke={INK} strokeWidth="2" />
      <rect x="118" y="42" width="64" height="7" rx="2" fill={gold} stroke={INK} strokeWidth="1.5" />
    </Frame>
  );
}

const PORTRAITS: Record<PortraitVariant, (p: SvgProps) => React.ReactElement> = {
  hero: HeroSvg,
  claude: ClaudeSvg,
  cursor: CursorSvg,
  mentor: MentorSvg,
};
