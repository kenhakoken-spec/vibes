import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../store/gameStore';

/**
 * 学びの記録（コーデックス）。この作品で学べることの一覧＋習得チェック。
 * 学習素材としての「何が身につくか」を可視化する。
 */
export function CodexSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { chapters, results } = useGame();

  const total = chapters.reduce((n, c) => n + c.stages.length, 0);
  const done = chapters.reduce((n, c) => n + c.stages.filter((s) => results[s.id]?.cleared).length, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__grip" />
            <span className="kicker">CODEX ／ 学びの記録</span>
            <h3 className="display sheet__word">学びの記録</h3>
            <p className="sheet__hint">
              この物語で身につくこと（{done}/{total} 習得）。クリアした依頼に ✓ がつく。
            </p>

            <div className="sheet__list scroll">
              {chapters.map((ch) => (
                <div key={ch.id} className="codex__chapter">
                  <div className="codex__chtitle">
                    {ch.title} <span>{ch.subtitle}</span>
                  </div>
                  {ch.stages.map((s) => {
                    const got = !!results[s.id]?.cleared;
                    return (
                      <div key={s.id} className={`codex__row ${got ? 'is-got' : ''}`}>
                        <span className="codex__check">{got ? '✓' : '○'}</span>
                        <span className="codex__learn">{s.challenge.learn}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <button className="sheet__close" onClick={onClose}>
              閉じる ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
