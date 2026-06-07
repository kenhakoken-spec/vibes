import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { ComicBurst } from '../components/ComicBurst';
import { ScrollCue } from '../components/ScrollCue';

export function ChapterClear() {
  const { chapter, chapters, chapterIndex, edition, learned, results, toWorld, nextChapter, selectEdition, backToTitle } =
    useGame();
  if (!chapter || !edition) return null;

  const isFinal = chapterIndex >= chapters.length - 1;

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
