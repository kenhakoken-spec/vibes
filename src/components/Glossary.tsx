import { AnimatePresence, motion } from 'framer-motion';
import { useGlossary } from '../store/glossaryStore';
import { GLOSSARY, TERM_BY_ID } from '../data/glossary';

/** 常時の「？用語」フローティングボタン＋ボトムシート。 */
export function Glossary({ showButton = true }: { showButton?: boolean }) {
  const { active, openIndex, openTerm, close } = useGlossary();

  return (
    <>
      {showButton && (
        <motion.button
          className="glossfab"
          onClick={openIndex}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
          aria-label="用語集をひらく"
        >
          <span>？</span>
          用語
        </motion.button>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            className="sheet__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
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
              {active === 'index' ? (
                <div className="sheet__index">
                  <span className="kicker">GLOSSARY ／ 用語集</span>
                  <h3 className="head sheet__title">分からない言葉はここ</h3>
                  <p className="sheet__hint">本文中の<b className="term term--inline">赤い点線の言葉</b>はタップでも開けます。</p>
                  <div className="sheet__list scroll">
                    {GLOSSARY.map((t) => (
                      <button key={t.id} className="sheet__row" onClick={() => openTerm(t.id)}>
                        <b>{t.term}</b>
                        <span>{t.short}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                (() => {
                  const t = TERM_BY_ID[active];
                  if (!t) return null;
                  return (
                    <div className="sheet__term">
                      <span className="kicker">用語</span>
                      <h3 className="display sheet__word">{t.term}</h3>
                      <p className="sheet__short">{t.short}</p>
                      <p className="sheet__body">{t.body}</p>
                      {t.example && <p className="sheet__example">{t.example}</p>}
                      <button className="sheet__more" onClick={openIndex}>
                        ← 用語集の一覧へ
                      </button>
                    </div>
                  );
                })()
              )}
              <button className="sheet__close" onClick={close}>
                閉じる ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
