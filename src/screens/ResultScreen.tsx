import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { RichText } from '../components/RichText';
import { ComicBurst } from '../components/ComicBurst';
import { ScrollCue } from '../components/ScrollCue';

/* 課題の出来は数値ではなく“相棒の反応の言葉”で伝える（新方針）。
   ステージごとに決まった一言が出るよう、stage.id から決定的に選ぶ。 */
const PRAISE: Record<'claude' | 'cursor', string[]> = {
  claude: [
    'うん、いい頼み方だった。きみの言葉が、そのまま形になったね。',
    'よくやったね。迷いのない、よく伝わる言葉だったよ。',
    '見事だよ。きみの一言で、ぼくは迷わず動けた。',
  ],
  cursor: [
    '上出来。アンタ、なかなかやるじゃん。',
    'いい指示だった。アタシが最速で動ける言葉ってこと。',
    'やるね。その伝え方なら、次はもっと速く飛ばせる。',
  ],
};

function pickPraise(editionId: 'claude' | 'cursor', stageId: string): string {
  const pool = PRAISE[editionId];
  let h = 0;
  for (let i = 0; i < stageId.length; i++) h = (h + stageId.charCodeAt(i)) % 9973;
  return pool[h % pool.length];
}

export function ResultScreen() {
  const { edition, currentStage, closeResult } = useGame();
  const stage = currentStage();
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!stage || !edition) return null;

  const praise = pickPraise(edition.id, stage.id);
  // “どこが良かったか”は正解選択肢の feedback を流用（成功時チャットには successResponse
  // しか出ないため、ここで初めて種明かしになる）。自由記述には feedback が無いので省略。
  const goodPoint =
    stage.challenge.kind === 'choice'
      ? stage.challenge.options?.find((o) => o.correct)?.feedback ?? null
      : null;

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

        {/* 相棒の反応：労いの一言＋どこが良かったか（言葉で出来を伝える） */}
        <motion.div
          className="afterword__partner result__partner"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
            <p>{praise}</p>
            {goodPoint && (
              <p className="result__why">
                <RichText text={goodPoint} />
              </p>
            )}
          </div>
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
