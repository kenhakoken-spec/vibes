import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { rankFor, RANK_LABEL, RANK_COLOR } from '../engine/rank';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { RichText } from '../components/RichText';
import { ComicBurst } from '../components/ComicBurst';
import { ScrollCue } from '../components/ScrollCue';

export function ResultScreen() {
  const { currentStage, results, closeResult } = useGame();
  const stage = currentStage();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!stage) return null;

  const res = results[stage.id];
  const rank = res ? rankFor(res.score, res.attempts) : 'C';

  return (
    <motion.div ref={scrollRef} className="screen result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ComicBurst />
      <ScrollCue targetRef={scrollRef} />
      <div className="result__inner">
        <motion.div
          className="result__rank"
          initial={{ scale: 2.4, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        >
          <span className="result__ranktag display" style={{ color: RANK_COLOR[rank] }}>
            {rank}
          </span>
          <span className="result__ranklabel head" style={{ color: RANK_COLOR[rank] }}>
            {RANK_LABEL[rank]}
          </span>
        </motion.div>

        <motion.div
          className="result__learn slab"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span className="kicker">習得</span>
          <p className="result__lesson"><RichText text={stage.challenge.learn} /></p>
        </motion.div>

        <motion.div
          className="result__artifact"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="kicker">いまの成果物</span>
          <ArtifactPreview artifact={stage.challenge.artifact} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <AngledButton onClick={closeResult}>次へ ▶</AngledButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
