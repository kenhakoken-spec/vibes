import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * スクロール可能な画面の下部に「▼ もっと見る」を出す。
 * 一番下まで読んだら自動で消える。スクロール余地がない端末では出ない。
 */
export function ScrollCue({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const update = () => {
      const more = el.scrollHeight - el.clientHeight - el.scrollTop > 8;
      setShow(more);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const t1 = setTimeout(update, 400);
    const t2 = setTimeout(update, 1200);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [targetRef]);

  if (!show) return null;
  return (
    <div className="scrollcue" aria-hidden="true">
      <span>▼ もっと見る</span>
    </div>
  );
}
