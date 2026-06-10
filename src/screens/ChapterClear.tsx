import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { ComicBurst } from '../components/ComicBurst';
import { ScrollCue } from '../components/ScrollCue';
import { rankTitle, skillChapters } from '../data/journey';

export function ChapterClear() {
  const {
    chapter,
    chapters,
    chapterIndex,
    edition,
    learned,
    results,
    toWorld,
    nextChapter,
    selectEdition,
    backToTitle,
    isChapterCleared,
  } = useGame();
  if (!chapter || !edition) return null;

  const isFinal = chapterIndex >= chapters.length - 1;

  // 「8つの力」進捗：この章で得た力・称号の変化・次に得る力
  const skills = skillChapters(chapters);
  const totalPowers = skills.length;
  // クリア前の獲得数（今クリアした章を除いて数える）→ 称号の昇格判定に使う
  const prevEarned = skills.filter((x) => x.index !== chapterIndex && isChapterCleared(x.index)).length;
  const earnedNow = chapter.power ? Math.min(totalPowers, prevEarned + 1) : prevEarned;
  const oldTitle = rankTitle(prevEarned);
  const newTitle = rankTitle(earnedNow);
  const rankedUp = !!chapter.power && oldTitle !== newTitle;
  // 旅の本道で次に得る力（無ければ残るは OVERSEER のみ）
  const nextSkill = skills.find((x) => x.index > chapterIndex);

  // 最終ステージの成果物が「完成形」
  const finalArtifact = chapter.stages[chapter.stages.length - 1]?.challenge.artifact ?? null;
  const ranks = chapter.stages.map((s) => results[s.id]?.score ?? 0);
  const avg = ranks.reduce((a, b) => a + b, 0) / Math.max(1, ranks.length);

  const titleText = isFinal ? '完' : `${chapter.title} 制覇`;
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={scrollRef}
      className="screen chapclear"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ComicBurst label={isFinal ? '完' : '制覇'} sub={isFinal ? 'ALL CLEAR' : 'CHAPTER CLEAR'} />
      <div className="chapclear__burst" />
      <motion.span
        className="kicker"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {isFinal ? 'STORY COMPLETE ／ 創造の物語、完' : `${chapter.title} ・ CLEAR`}
      </motion.span>

      <motion.h1
        className="display chapclear__title glitch"
        data-text={titleText}
        initial={{ scale: 1.6, opacity: 0, skewX: 10 }}
        animate={{ scale: 1, opacity: 1, skewX: -6 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
      >
        {titleText}
      </motion.h1>

      {/* 「力」獲得カットイン（power を持つ章のみ。序章/幕間/最終章は従来表示のまま） */}
      {chapter.power && (
        <motion.div
          className="powerget"
          initial={{ x: -90, opacity: 0, skewX: -14 }}
          animate={{ x: 0, opacity: 1, skewX: -8 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 210, damping: 18 }}
        >
          <div className="powerget__main">
            <motion.span
              className="powerget__gem"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ delay: 0.62, type: 'spring', stiffness: 300, damping: 13 }}
            />
            <span className="powerget__label">
              <span className="powerget__kicker">POWER GET</span>
              <b className="powerget__name">「{chapter.power}」を得た！</b>
            </span>
          </div>

          <motion.div
            className="powerget__meta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
          >
            <span className="powerget__count">
              獲得{' '}
              <b>
                {earnedNow}/{totalPowers}
              </b>
              {nextSkill ? <>・次は「{nextSkill.chapter.power}」</> : <>・残すは OVERSEER のみ</>}
            </span>
            {rankedUp ? (
              <motion.span
                className="powerget__rankup"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.15, type: 'spring', stiffness: 240, damping: 14 }}
              >
                称号 <s>{oldTitle}</s> <b className="powerget__arrow">▶</b>{' '}
                <b className="powerget__newrank">{newTitle}</b>
              </motion.span>
            ) : (
              <span className="powerget__rankup">称号「{newTitle}」</span>
            )}
          </motion.div>
        </motion.div>
      )}

      <p className="chapclear__lead">
        {isFinal ? (
          <>
            きみは {edition.partner.name} と共に OVERSEER を打ち破り、<br />
            「人とAIが共に創る自由」を取り戻した。
          </>
        ) : (
          <>
            きみは {edition.partner.name} と組み、言葉でものを作り上げた。<br />
            小さくても、これは確かに“動く成果物”だ。
          </>
        )}
      </p>

      <div className="chapclear__cols">
        <motion.div
          className="chapclear__learned slab"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="kicker">この章で“できる”ようになったこと</span>
          <ul>
            {learned.map((l, i) => (
              <motion.li
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 + i * 0.12 }}
              >
                <span className="chapclear__check">✓</span>
                {l}
              </motion.li>
            ))}
          </ul>
          <div className="chapclear__avg">
            総合評価 <b style={{ color: edition.accent }}>{Math.round(avg * 100)}％</b>
          </div>
        </motion.div>

        <motion.div
          className="chapclear__artifact"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="kicker">完成した成果物</span>
          <ArtifactPreview artifact={finalArtifact} />
        </motion.div>
      </div>

      <motion.p
        className="chapclear__next"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {isFinal
          ? '── 言葉で、ものを作る力は、もうきみのものだ。次は“現実”で。相棒（Claude / Cursor）を呼んで、きみの「作りたい」を形にしよう。 ──'
          : '── ワールドマップに、次なる地が開かれた。OVERSEER への道は続く。 ──'}
      </motion.p>

      {isFinal ? (
        <div className="chapclear__btns">
          <AngledButton onClick={() => selectEdition(edition.id === 'claude' ? 'cursor' : 'claude')} sound="confirm">
            {edition.id === 'claude' ? 'CURSOR編' : 'CLAUDE編'}で挑む ▶
          </AngledButton>
          <AngledButton variant="ghost" onClick={backToTitle} sound="back">
            タイトルへ
          </AngledButton>
        </div>
      ) : (
        <div className="chapclear__btns">
          <AngledButton onClick={nextChapter} sound="confirm">
            次の章へ ▶
          </AngledButton>
          <AngledButton variant="ghost" onClick={toWorld} sound="back">
            章選択へ
          </AngledButton>
        </div>
      )}

      <ScrollCue targetRef={scrollRef} />
    </motion.div>
  );
}
