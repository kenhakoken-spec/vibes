import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { UPCOMING } from '../data/chapters';
import { CodexSheet } from '../components/CodexSheet';
import { keepKatakana, noWidow } from '../components/keepKatakana';
import { sfx } from '../engine/sfx';

export function WorldMap() {
  const [codexOpen, setCodexOpen] = useState(false);
  const { chapters, edition, enterChapter, isChapterUnlocked, isChapterCleared, backToTitle } = useGame();
  if (!edition) return null;

  // 「現在地（次に挑む章）」＝解放済みで未クリアの最初の章
  const currentIndex = chapters.findIndex((_, i) => isChapterUnlocked(i) && !isChapterCleared(i));

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
        <span className="kicker">WORLD ／ ゴールまでの地図</span>
        <h2 className="display world__title">創造の地図</h2>
        {/* 進捗の数字は出さない。★が増え、道が伸びる見た目だけで語る */}
        <p className="world__lead">
          道は、<b style={{ color: edition.accent }}>OVERSEER</b> の塔まで続いている。
        </p>
      </header>

      <div className="world__track scroll">
        {chapters.map((ch, i) => {
          const unlocked = isChapterUnlocked(i);
          const cleared = isChapterCleared(i);
          const isCurrent = i === currentIndex;
          const isGoal = i === chapters.length - 1;
          return (
            <motion.button
              key={ch.id}
              className={`worldnode ${cleared ? 'is-clear' : ''} ${unlocked ? '' : 'is-lock'} ${isCurrent ? 'is-current' : ''} ${isGoal ? 'is-goal' : ''}`}
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
                <b className="worldnode__sub">{noWidow(ch.subtitle)}</b>
                {/* 依頼の一行＝章のスケール感。回を追うごとに依頼が大きくなる＝成長の体感 */}
                {ch.quest && <span className="worldnode__quest">依頼 ── {noWidow(ch.quest)}</span>}
                {ch.boss && (
                  <span className="worldnode__boss">
                    {isGoal ? '最終決戦:' : '歪み:'}「{ch.boss.name}」{keepKatakana(ch.boss.title)}
                  </span>
                )}
                {isCurrent && <span className="worldnode__here">▶ 次はここ</span>}
              </span>
              <span className="worldnode__state">
                {!unlocked && '🔒'}
                {unlocked && !cleared && (isGoal ? '⚑' : '▶')}
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
              <b className="worldnode__sub">{noWidow(ch.subtitle)}</b>
              <span className="worldnode__boss">
                {ch.id === 'chF' ? '最終決戦:' : '歪み:'}「{ch.boss.name}」{keepKatakana(ch.boss.title)}
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
