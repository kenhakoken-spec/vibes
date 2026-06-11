import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { BossGlyph } from '../components/BossGlyph';
import { BossIntro } from '../components/BossIntro';

export function StageMap() {
  const { chapter, chapters, chapterIndex, edition, results, enterStage, isUnlocked, toWorld } = useGame();
  const clearedAll = chapter ? chapter.stages.every((s) => results[s.id]?.cleared) : false;
  const [showIntro, setShowIntro] = useState(!!chapter?.boss && !clearedAll);
  const isFinalChapter = chapterIndex >= chapters.length - 1;

  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => setShowIntro(false), 2300);
    return () => clearTimeout(t);
  }, [showIntro]);

  if (!chapter || !edition) return null;

  return (
    <motion.div
      className="screen map"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {showIntro && chapter.boss && <BossIntro boss={chapter.boss} accent={edition.accent} />}

      <header className="map__head">
        <div className="map__toprow">
          <button className="map__back" onClick={toWorld}>
            ‹ 章選択
          </button>
          <span className="chip">{edition.label}</span>
        </div>
        <span className="kicker">{edition.guildName}</span>
        <h2 className="display map__title">{chapter.title}</h2>
        <p className="map__subtitle">{chapter.subtitle}</p>
        {chapter.recap && <p className="map__recap">前回まで ── {chapter.recap}</p>}
      </header>

      {chapter.boss && (
        <motion.div
          className={`bossbar ${clearedAll ? 'is-down' : ''}`}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bossbar__glyph">
            <BossGlyph accent={edition.accent} down={clearedAll} kind={chapter.boss.glyph} />
          </div>
          <span className="bossbar__tag">{clearedAll ? '撃破' : '歪み'}</span>
          <div className="bossbar__info">
            <b className="bossbar__name">
              「{chapter.boss.name}」<span>{chapter.boss.title}</span>
            </b>
            <span className="bossbar__blurb">{chapter.boss.blurb}</span>
          </div>
        </motion.div>
      )}

      <div className="map__track">
        <div className="map__line" />
        {chapter.stages.map((stage, i) => {
          const res = results[stage.id];
          const unlocked = isUnlocked(i);
          const cleared = !!res?.cleared;
          return (
            <motion.button
              key={stage.id}
              className={`node ${cleared ? 'node--clear' : ''} ${unlocked ? '' : 'node--lock'}`}
              disabled={!unlocked}
              onClick={() => enterStage(i)}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.12, type: 'spring', stiffness: 220, damping: 18 }}
              whileHover={unlocked ? { scale: 1.06, y: -4 } : undefined}
            >
              <span className="node__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="node__title">{stage.title}</span>
              <span className="node__sub">{stage.subtitle}</span>
              <span className="node__state">
                {!unlocked && '🔒 LOCKED'}
                {unlocked && !cleared && '▶ 挑戦する'}
                {/* ランクは出さない（新方針：成績表ではなく“済んだ”事実だけ） */}
                {cleared && <b style={{ color: 'var(--accent)' }}>CLEAR ✓</b>}
              </span>
            </motion.button>
          );
        })}
      </div>

      <footer className="map__foot">
        {clearedAll ? (
          <span className="map__done">
            {/* 制覇の一言＝「世界がどう変わったか」で締める（数値や称号は出さない） */}
            {chapter.title} 制覇 ──{' '}
            {chapter.afterword?.world ??
              (isFinalChapter ? '「人とAIが共に創る自由」を取り戻した。' : '物語は次の地へ続く。')}
          </span>
        ) : (
          <span className="map__hint">ノードを選んで依頼に挑め。クリアで次が解放される。</span>
        )}
      </footer>
    </motion.div>
  );
}
