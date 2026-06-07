import { useMemo } from 'react';

/** ゆっくり上昇する赤い粒子。画面を“止めない”ための常時モーション。 */
export function Particles({ count = 16 }: { count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        dur: 9 + Math.random() * 12,
        delay: -Math.random() * 18,
        drift: (Math.random() - 0.5) * 40,
        op: 0.15 + Math.random() * 0.4,
        key: i,
      })),
    [count],
  );

  return (
    <div className="particles" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.key}
          className="particle"
          style={
            {
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              opacity: b.op,
              ['--dur' as string]: `${b.dur}s`,
              ['--delay' as string]: `${b.delay}s`,
              ['--drift' as string]: `${b.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
