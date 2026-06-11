import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { RichText } from '../components/RichText';
import { ComicBurst } from '../components/ComicBurst';
import { ScrollCue } from '../components/ScrollCue';

export function ResultScreen() {
  const { currentStage, closeResult } = useGame();
  const stage = currentStage();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!stage) return null;

  return (
    <motion.div ref={scrollRef} className="screen result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ComicBurst />
      <ScrollCue targetRef={scrollRef} />
      <div className="result__inner">
        {/* 成績表は出さない（新方針：成長は言葉と成果物で語る）。
            ランクの代わりに“依頼をやり遂げた”ことだけをスタンプで決める */}
        <motion.div
          className="result__stamp"
          initial={{ scale: 2.4, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: -8, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
        >
          <span className="result__stamptag display">完遂</span>
          <span className="result__stamplabel head">REQUEST COMPLETE</span>
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
