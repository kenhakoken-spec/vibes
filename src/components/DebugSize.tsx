import { useEffect, useState } from 'react';

/** ?dbg=1 のとき、ビューポート幅を超えてはみ出している要素を一覧表示する。 */
export function DebugSize() {
  const [info, setInfo] = useState<string[]>([]);

  useEffect(() => {
    const run = () => {
      const iw = window.innerWidth;
      const offenders: { sel: string; right: number; w: number }[] = [];
      document.querySelectorAll<HTMLElement>('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > iw + 0.5 && r.width > 0) {
          const cls = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
          offenders.push({ sel: `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`, right: Math.round(r.right), w: Math.round(r.width) });
        }
      });
      offenders.sort((a, b) => b.right - a.right);
      const lines = [
        `iw=${iw} ow=${window.outerWidth} dpr=${window.devicePixelRatio} scrollW=${document.documentElement.scrollWidth}`,
        ...offenders.slice(0, 8).map((o) => `${o.sel} →${o.right} w${o.w}`),
      ];
      setInfo(lines);
    };
    const t = setTimeout(run, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        color: '#0f0',
        font: '10px monospace',
        padding: '6px 8px',
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
        pointerEvents: 'none',
      }}
    >
      {info.join('\n')}
    </div>
  );
}
