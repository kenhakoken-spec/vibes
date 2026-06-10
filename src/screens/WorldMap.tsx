import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { UPCOMING } from '../data/chapters';
import { earnedPowers as countEarnedPowers, rankTitle, skillChapters } from '../data/journey';
import { CodexSheet } from '../components/CodexSheet';
import { sfx } from '../engine/sfx';

export function WorldMap() {
  const [codexOpen, setCodexOpen] = useState(false);
  const { chapters, edition, enterChapter, isChapterUnlocked, isChapterCleared, backToTitle } = useGame();
  if (!edition) return null;

  // 8つの力（バッジ）＝旅の本道
  const skills = skillChapters(chapters);
  const totalPowers = skills.length;
  const earnedPowers = countEarnedPowers(chapters, isChapterCleared);
  const title = rankTitle(earnedPowers);
  const pct = Math.round((earnedPowers / Math.max(1, totalPowers)) * 100);
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
        <p className="world__lead">
          <b style={{ color: edition.accent }}>8つの力</b>を集め、最後に <b style={{ color: edition.accent }}>OVERSEER</b> に挑む。
        </p>

        {/* バッジケース：8つの力を集める進捗（ポケモンのジムバッジ的） */}
        <div className="badgecase" aria-label={`獲得した力 ${earnedPowers}/${totalPowers}`}>
          {skills.map((x) => {
            const earned = isChapterCleared(x.index);
            const current = x.index === currentIndex;
            return (
              <div
                key={x.chapter.id}
                className={`badge ${earned ? 'is-earned' : ''} ${current ? 'is-current' : ''}`}
                title={`${x.chapter.title}：${x.chapter.power}`}
              >
                <span className="badge__gem" />
                <span className="badge__name">{x.chapter.power}</span>
              </div>
            );
          })}
        </div>

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
            獲得した力 <b style={{ color: edition.accent }}>{earnedPowers}/{totalPowers}</b> ・ 称号「{title}」
          </span>
        </div>
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
                <b className="worldnode__sub">{ch.subtitle}</b>
                {ch.power && (
                  <span className="worldnode__power">
                    {cleared ? '★ 獲得: ' : '得る力: '}
                    <b>{ch.power}</b>
                  </span>
                )}
                {ch.boss && (
                  <span className="worldnode__boss">
                    {isGoal ? '最終決戦:' : '歪み:'}「{ch.boss.name}」{ch.boss.title}
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
