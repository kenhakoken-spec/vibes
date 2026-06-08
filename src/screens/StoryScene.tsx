import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { rosterFor } from '../data/chapter1';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { RichText } from '../components/RichText';
import { useTypewriter } from '../hooks/useTypewriter';
import { inferExpr } from '../data/expr';
import type { DialogueLine } from '../types';

export function StoryScene({ phase }: { phase: 'intro' | 'outro' }) {
  const { edition, currentStage, beginChallenge, finishOutro } = useGame();
  const stage = currentStage();
  const roster = useMemo(() => (edition ? rosterFor(edition) : {}), [edition]);

  const [i, setI] = useState(0);
  if (!stage || !edition) return null;

  const lines: DialogueLine[] = phase === 'intro' ? stage.intro : stage.outro;
  const line = lines[i];

  const onFinish = phase === 'intro' ? beginChallenge : finishOutro;

  return (
    <motion.div
      className="screen story"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="story__banner">
        <span className="chip">{phase === 'intro' ? stage.title : 'CLEAR'}</span>
        <span className="story__sub">{stage.subtitle}</span>
      </div>

      <DialogueView
        key={i}
        line={line}
        roster={roster}
        editionAccent={edition.accent}
        index={i}
        total={lines.length}
        onNext={() => {
          if (i + 1 >= lines.length) onFinish();
          else setI(i + 1);
        }}
      />
    </motion.div>
  );
}

interface ViewProps {
  line: DialogueLine;
  roster: Record<string, { name: string; color: string; portrait: 'hero' | 'mentor' | 'claude' | 'cursor' }>;
  editionAccent: string;
  index: number;
  total: number;
  onNext: () => void;
}

function DialogueView({ line, roster, editionAccent, index, total, onNext }: ViewProps) {
  const { shown, done, skip } = useTypewriter(line.text, { blip: true });
  const speaker = line.speaker ? roster[line.speaker] : undefined;
  const portrait = line.portrait ?? speaker?.portrait;
  const side = line.side ?? 'left';
  const accent = speaker?.color ?? editionAccent;

  const advance = () => (done ? onNext() : skip());

  return (
    <div className="story__stage" onClick={advance}>
      {/* portrait */}
      <AnimatePresence mode="wait">
        {portrait && !line.narration && (
          <motion.div
            key={portrait + side}
            className={`story__portrait story__portrait--${side}`}
            initial={{ x: side === 'left' ? -80 : 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          >
            <CharacterPortrait variant={portrait} accent={accent} expr={inferExpr(line, portrait)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* dialogue / narration */}
      {line.narration ? (
        <motion.div
          className="story__narration"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p><RichText text={shown} /></p>
        </motion.div>
      ) : (
        <motion.div
          className="story__box slab"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          {speaker && (
            <span className="story__name" style={{ ['--accent' as string]: accent } as React.CSSProperties}>
              {speaker.name}
            </span>
          )}
          <p className="story__text"><RichText text={shown} /></p>
        </motion.div>
      )}

      <div className="story__progress">
        <span className="story__advance">{done ? '▶ クリックで次へ' : '…'}</span>
        <span className="story__count">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}
