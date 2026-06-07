import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { UPCOMING } from '../data/chapters';
import { GLOSSARY } from '../data/glossary';
import { CodexSheet } from '../components/CodexSheet';
import { sfx } from '../engine/sfx';

export function WorldMap() {
  const [codexOpen, setCodexOpen] = useState(false);
  const { chapters, edition, results, learned, enterChapter, isChapterUnlocked, isChapterCleared, backToTitle } =
    useGame();
  if (!edition) return null;

  const totalStages = chapters.reduce((n, c) => n + c.stages.length, 0);
  const clearedStages = chapters.reduce(
    (n, c) => n + c.stages.filter((s) => results[s.id]?.cleared).length,
    0,
  );
  const pct = Math.round((clearedStages / Math.max(1, totalStages)) * 100);

  return (
    <motion.div
      className="screen world"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <header className="world__head">
        <div className="map__toprow">
          <button
            className="map__back"
            onClick={() => {
              sfx.back();
              backToTitle();
            }}
          >
            ‹ TITLE
          </button>
          <div className="world__toprow-right">
            <button
              className="world__codexbtn"
              onClick={() => {
                sfx.click();
                setCodexOpen(true);
              }}
            >
              📖 学びの記録
            </button>
            <span className="chip">{edition.label}</span>
          </div>
        </div>
        <span className="kicker">WORLD ／ 章を選ぶ</span>
        <h2 className="display world__title">創造の地図</h2>
        <p className="world__lead">
          学びを重ね、<b style={{ color: edition.accent }}>OVERSEER</b> へ至る。
        </p>

        <div className="world__stats">
          <div className="world__bar">
            <motion.span
              className="world__bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="world__stat">
            依頼 {clearedStages}/{totalStages}（{pct}%） ・ 学び {learned.length} ・ 用語 {GLOSSARY.length} 収録
          </span>
        </div>
      </header>

      <div className="world__track scroll">
        {chapters.map((ch, i) => {
          const unlocked = isChapterUnlocked(i);
          const cleared = isChapterCleared(i);
          return (
            <motion.button
              key={ch.id}
              className={`worldnode ${cleared ? 'is-clear' : ''} ${unlocked ? '' : 'is-lock'}`}
              onClick={() => {
                if (!unlocked) {
                  const ok = window.confirm(
                    `${ch.title}「${ch.subtitle}」はまだ解放されていません。\n` +
                      '前の章を飛ばすと、物語や用語のつながりが分かりにくいかもしれません。\n' +
                      'それでも挑戦しますか？',
                  );
                  if (!ok) return;
                }
                sfx.confirm();
                enterChapter(i);
              }}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
            >
              <span className="worldnode__no">{ch.title}</span>
              <span className="worldnode__body">
                <b className="worldnode__sub">{ch.subtitle}</b>
                {ch.boss && (
                  <span className="worldnode__boss">
                    歪み:「{ch.boss.name}」{ch.boss.title}
                  </span>
                )}
              </span>
              <span className="worldnode__state">
                {!unlocked && '🔒'}
                {unlocked && !cleared && '▶'}
                {cleared && '★'}
              </span>
            </motion.button>
          );
        })}

        {UPCOMING.map((ch, i) => (
          <motion.div
            key={ch.id}
            className="worldnode is-soon"
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: (chapters.length + i) * 0.06 }}
          >
            <span className="worldnode__no">{ch.title}</span>
            <span className="worldnode__body">
              <b className="worldnode__sub">{ch.subtitle}</b>
              <span className="worldnode__boss">
                {ch.id === 'chF' ? '最終決戦:' : '歪み:'}「{ch.boss.name}」{ch.boss.title}
              </span>
            </span>
            <span className="worldnode__state worldnode__soon">近日</span>
          </motion.div>
        ))}
      </div>

      <CodexSheet open={codexOpen} onClose={() => setCodexOpen(false)} />
    </motion.div>
  );
}
