import { useId } from 'react';

/* 章ボス（歪み）を表す不穏なマスク・シルエット。P5の“シャドウ”的な気配。 */
export function BossGlyph({ accent = '#ff2d4a', down = false }: { accent?: string; down?: boolean }) {
  const eye = down ? '#888' : accent;
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg viewBox="0 0 80 80" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern id={`bght-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <circle cx="1" cy="1" r="0.9" fill={eye} opacity="0.5" />
        </pattern>
        <radialGradient id={`bgglow-${uid}`} cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor={eye} stopOpacity={down ? 0.2 : 0.6} />
          <stop offset="100%" stopColor={eye} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="40" cy="38" r="36" fill={`url(#bgglow-${uid})`} />
      {/* マスク本体（角張った歪み） */}
      <path
        d="M40 8 L66 26 L58 52 L40 72 L22 52 L14 26 Z"
        fill="#0a0a0f"
        stroke={eye}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M40 8 L66 26 L58 52 L40 72 Z" fill={`url(#bght-${uid})`} opacity="0.25" />
      {/* 釣り上がった眼 */}
      <path d="M26 34 L40 30 L38 42 L27 42 Z" fill={eye} />
      <path d="M54 34 L40 30 L42 42 L53 42 Z" fill={eye} />
      {/* ギザの口 */}
      <path d="M30 54 L34 50 L38 54 L42 50 L46 54 L50 50" fill="none" stroke={eye} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
