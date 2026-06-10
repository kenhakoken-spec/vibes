import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { BossGlyph } from '../components/BossGlyph';
import { BossIntro } from '../components/BossIntro';
import { rankFor, RANK_COLOR } from '../engine/rank';
import { skillChapters } from '../data/journey';

export function StageMap() {
  const { chapter, chapters, chapterIndex, edition, results, enterStage, isUnlocked, toWorld } = useGame();
  const clearedAll = chapter ? chapter.stages.every((s) => results[s.id]?.cleared) : false;
  const [showIntro, setShowIntro] = useState(!!chapter?.boss && !clearedAll);

  // 旅の本道（8つの力）の中での現在位置と、ゴール（最終章）までの残り章数
  const skills = skillChapters(chapters);
  const powerNo = skills.findIndex((x) => x.index === chapterIndex) + 1;
  const remaining = chapters.length - 1 - chapterIndex;
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
        {/* 章頭オリエンテーション：この章で得る力と、ゴールまでの距離（power を持つ章のみ） */}
        {chapter.power && (
          <div className="map__orient">
            <span className="map__orient-power">
              この章で得る力: <b>{chapter.power}</b>（{powerNo}/{skills.length}）
            </span>
            <span className="map__orient-goal">ゴール（OVERSEER）まで あと{remaining}章</span>
          </div>
        )}
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
          const rank = res ? rankFor(res.score, res.attempts) : null;
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
                {cleared && rank && (
                  <b style={{ color: RANK_COLOR[rank] }}>CLEAR ・ {rank}</b>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      <footer className="map__foot">
        {clearedAll ? (
          <span className="map__done">
            {/* 章ごとに動的な制覇メッセージ（得た力 ＞ 最終決戦 ＞ その他） */}
            {chapter.power
              ? `${chapter.title} 制覇 ── きみは「${chapter.power}」を手に入れた。`
              : isFinalChapter
                ? `${chapter.title} 制覇 ── 「人とAIが共に創る自由」を取り戻した。`
                : `${chapter.title} 制覇 ── 物語は次の地へ続く。`}
          </span>
        ) : (
          <span className="map__hint">ノードを選んで依頼に挑め。クリアで次が解放される。</span>
        )}
      </footer>
    </motion.div>
  );
}
