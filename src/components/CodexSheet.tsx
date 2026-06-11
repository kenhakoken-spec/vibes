import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { useGlossary } from '../store/glossaryStore';
import { TERM_BY_ID } from '../data/glossary';
import { keepKatakana } from './keepKatakana';

/**
 * 学びの記録（コーデックス）。この作品で学べることの一覧＋習得チェック＋重要用語。
 * 学習素材としての「何が身につくか」を可視化し、用語はタップで解説できる。
 */
export function CodexSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { chapters, results } = useGame();
  const openTerm = useGlossary((s) => s.openTerm);

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
                    {ch.title} <span>{keepKatakana(ch.subtitle)}</span>
                  </div>
                  {ch.stages.map((s) => {
                    const got = !!results[s.id]?.cleared;
                    return (
                      <div key={s.id} className={`codex__row ${got ? 'is-got' : ''}`}>
                        <span className="codex__check">{got ? '✓' : '○'}</span>
                        <span className="codex__learn">{keepKatakana(s.challenge.learn)}</span>
                      </div>
                    );
                  })}
                  {ch.keyTerms && ch.keyTerms.length > 0 && (
                    <div className="codex__terms">
                      {ch.keyTerms.map((id) =>
                        TERM_BY_ID[id] ? (
                          <button key={id} className="codex__termchip" onClick={() => openTerm(id)}>
                            {TERM_BY_ID[id].term}
                          </button>
                        ) : null,
                      )}
                    </div>
                  )}
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
