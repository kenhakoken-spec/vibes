import { useEffect, useRef, useState } from 'react';
import { sfx } from '../engine/sfx';
import { useSettings, TEXT_SPEED_MS } from '../store/settingsStore';

/**
 * 文字を一文字ずつ送り出すタイプライタ。速度は設定（textSpeed）に従う。
 * クリック等で skip() すると即座に全文表示（ビジュアルノベルの定番）。
 * blip: 数文字ごとに控えめな打鍵音。
 */
export function useTypewriter(full: string, opts?: { blip?: boolean }) {
  const ms = useSettings((s) => TEXT_SPEED_MS[s.textSpeed]);
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const blip = opts?.blip ?? false;

  useEffect(() => {
    idx.current = 0;
    if (!full) {
      setShown('');
      setDone(true);
      return;
    }
    // instant（ms<=0）は即時全文
    if (ms <= 0) {
      setShown(full);
      setDone(true);
      idx.current = full.length;
      return;
    }
    setShown('');
    setDone(false);
    const id = setInterval(() => {
      idx.current += 1;
      setShown(full.slice(0, idx.current));
      if (blip && idx.current % 3 === 0) sfx.blip();
      if (idx.current >= full.length) {
        clearInterval(id);
        setDone(true);
      }
    }, ms);
    return () => clearInterval(id);
  }, [full, ms, blip]);

  const skip = () => {
    setShown(full);
    setDone(true);
    idx.current = full.length;
  };

  return { shown, done, skip };
}
