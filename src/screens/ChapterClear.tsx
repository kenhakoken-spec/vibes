import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { ComicBurst } from '../components/ComicBurst';
import { ScrollCue } from '../components/ScrollCue';

export function ChapterClear() {
  const {
    chapter,
    chapters,
    chapterIndex,
    edition,
    toWorld,
    nextChapter,
    selectEdition,
    backToTitle,
  } = useGame();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!chapter || !edition) return null;

  const isFinal = chapterIndex >= chapters.length - 1;

  // この章で“できる”ようになったこと＝現在章のステージから導出（累積の学びはCodexSheet側）
  const chapterLearned = chapter.stages.map((s) => s.challenge.learn);

  // 最終ステージの成果物が「完成形」
  const finalArtifact = chapter.stages[chapter.stages.length - 1]?.challenge.artifact ?? null;

  // 静かな余韻：afterword が無い章（序章・最終章など）は簡素な固定文にフォールバック
  const worldLine =
    chapter.afterword?.world ??
    (isFinal ? '世界に、「人とAIが共に創る自由」が戻った。' : '物語は、次の地へ続いていく。');
  // 相棒の労いの一言は必ず出す（成績の代わりに、言葉で締める）
  const fallbackPartner =
    edition.id === 'claude'
      ? isFinal
        ? 'ここまで、本当によくやったね。きみの言葉はもう、世界を変えられる。'
        : 'おつかれさま。きみの一歩、ぼくはちゃんと見ていたよ。'
      : isFinal
        ? 'ここまでよくやった。アンタの言葉はもう、世界を動かせる。'
        : 'おつかれ。上出来だったよ。アタシはちゃんと見てたからね。';
  const partnerLine = chapter.afterword?.partner ?? fallbackPartner;
  const seedLine = chapter.afterword?.seed ?? null;

  const titleText = isFinal ? '完' : `${chapter.title} 制覇`;

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

      {/* 静かな余韻：完成した成果物 → 世界の変化 → 相棒の一言 → 次章の種。
          数値・称号・バッジは出さない（成長は言葉と成果物だけで語る） */}
      <motion.section
        className="afterword"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div
          className="afterword__artifact"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          <span className="kicker">完成した成果物</span>
          <ArtifactPreview artifact={finalArtifact} />
        </motion.div>

        <motion.p
          className="afterword__world"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {worldLine}
        </motion.p>

        {partnerLine && (
          <motion.div
            className="afterword__partner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.7 }}
          >
            <CharacterPortrait
              variant={edition.partner.portrait}
              accent={edition.partner.color}
              className="afterword__face"
            />
            <div className="afterword__bubble">
              <span className="afterword__name" style={{ background: edition.partner.color }}>
                {edition.partner.name}
              </span>
              <p>{partnerLine}</p>
            </div>
          </motion.div>
        )}

        {seedLine && (
          <motion.p
            className="afterword__seed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 2.2 }}
          >
            {seedLine}
          </motion.p>
        )}
      </motion.section>

      <motion.div
        className="chapclear__learned slab"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="kicker">この章で“できる”ようになったこと</span>
        <ul>
          {chapterLearned.map((l, i) => (
            <motion.li
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 + i * 0.12 }}
            >
              <span className="chapclear__check">✓</span>
              {l}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.p
        className="chapclear__next"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {isFinal
          ? '── 言葉で、ものを作る。その自由はもう、この手の中にある。相棒（Claude / Cursor）を呼んで、現実の「作りたい」を形にしよう。 ──'
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
