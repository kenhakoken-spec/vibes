import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { buildOpening, type OpeningCut } from '../data/opening';
import { ArtifactPreview } from '../components/ArtifactPreview';
import { AngledButton } from '../components/AngledButton';
import { useTypewriter } from '../hooks/useTypewriter';
import { keepKatakana, noWidow } from '../components/keepKatakana';
import { sfx } from '../engine/sfx';
import type { ArtifactState } from '../types';

/* =========================================================================
   ムービー風オープニング。
   世界説明 → フードの実演者の圧倒的デモ3連発（成果物は左奥へ積み上がる）
   → 看板が灯り、ロゴ → 序章へ。タップで早送り、SKIPで丸ごと飛ばせる。
   ========================================================================= */

export function OpeningScene() {
  const edition = useGame((s) => s.edition);
  const finishOpening = useGame((s) => s.finishOpening);
  const cuts = useMemo(() => (edition ? buildOpening(edition) : []), [edition]);
  const [i, setI] = useState(0);

  if (!edition) return null;

  const finale = i >= cuts.length;
  const cut = finale ? null : cuts[i];
  const isCursor = edition.id === 'cursor';

  // デモで生まれた成果物は消さず、左奥に積み上げて見せる
  const demoIdx = cuts.flatMap((c, k) => (c.kind === 'demo' ? [k] : []));
  const firstDemo = demoIdx[0] ?? -1;
  const lastDemo = demoIdx[demoIdx.length - 1] ?? -1;
  const stack: ArtifactState[] = cuts
    .slice(0, i)
    .filter((c) => c.kind === 'demo' && c.artifact)
    .map((c) => c.artifact!);
  // 圧倒の余韻（独白）までは積んだまま。看板のカットで闇に消える
  const stackVisible = firstDemo >= 0 && i >= firstDemo && i <= lastDemo + 1 && stack.length > 0;

  const advance = () => setI((x) => Math.min(x + 1, cuts.length));

  return (
    <motion.div
      className="screen opening"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {/* いつでも飛ばせる（再訪者への礼儀） */}
      {!finale && (
        <button
          className="opening__skip"
          onClick={(e) => {
            e.stopPropagation();
            sfx.back();
            finishOpening();
          }}
        >
          SKIP ▶▶
        </button>
      )}

      {/* 積み上がった成果物（左奥のスタック） */}
      <AnimatePresence>
        {stackVisible && (
          <motion.div
            className="opening__stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
          >
            {stack.map((a, k) => (
              <motion.div
                key={a.title}
                className="opening__stack-item"
                initial={{ scale: 0.9, opacity: 0, x: 40 }}
                animate={{ scale: 1, opacity: 0.6, x: 0 }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                style={{ zIndex: k }}
              >
                <ArtifactPreview artifact={a} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {cut && cut.kind !== 'demo' && (
          <TextCut key={i} cut={cut} onAdvance={advance} />
        )}
        {cut && cut.kind === 'demo' && (
          <DemoCut key={i} cut={cut} isCursor={isCursor} onAdvance={advance} />
        )}
        {finale && <Finale key="finale" onEnter={finishOpening} />}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---- 文字だけのカット（ナレーション/独白/タイトル） ------------------- */
function TextCut({ cut, onAdvance }: { cut: OpeningCut; onAdvance: () => void }) {
  const { shown, done, skip } = useTypewriter(cut.text, { blip: true });

  // typewriter完了 + holdMs で自動送り
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onAdvance, cut.holdMs ?? 2800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const cls =
    cut.kind === 'title'
      ? 'opening__cut opening__cut--title'
      : cut.speaker === 'hero'
        ? 'opening__cut opening__cut--hero'
        : 'opening__cut opening__cut--narration';

  return (
    <motion.div
      className={cls}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      onClick={() => (done ? onAdvance() : skip())}
    >
      <p className="opening__text">{keepKatakana(shown)}</p>
      <span className="opening__advance">{done ? '▶' : ''}</span>
    </motion.div>
  );
}

/* ---- デモカット：打鍵チップ → フラッシュ → 成果物カットイン → 一文 ---- */
type DemoPhase = 'cmd' | 'reveal' | 'text';

function DemoCut({
  cut,
  isCursor,
  onAdvance,
}: {
  cut: OpeningCut;
  isCursor: boolean;
  onAdvance: () => void;
}) {
  const command = cut.command ?? '';
  const [phase, setPhase] = useState<DemoPhase>('cmd');
  const [cmdShown, setCmdShown] = useState('');

  // ① 一言が打ち込まれていく（約1.2秒）
  useEffect(() => {
    if (phase !== 'cmd') return;
    const step = Math.max(26, 1200 / Math.max(1, command.length));
    let n = cmdShown.length;
    const id = setInterval(() => {
      n += 1;
      setCmdShown(command.slice(0, n));
      if (n % 2 === 0) sfx.blip();
      if (n >= command.length) {
        clearInterval(id);
        // ②③ 余韻 → フラッシュと共に成果物が現れる
        setTimeout(() => {
          sfx.confirm();
          setPhase('reveal');
        }, 380);
      }
    }, step);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ④ カットインが収まったら一文を出す
  useEffect(() => {
    if (phase !== 'reveal') return;
    const t = setTimeout(() => setPhase('text'), 850);
    return () => clearTimeout(t);
  }, [phase]);

  // タップで段階を早送り
  const fastForward = () => {
    if (phase === 'cmd') {
      setCmdShown(command);
      sfx.confirm();
      setPhase('reveal');
    } else if (phase === 'reveal') {
      setPhase('text');
    }
  };

  return (
    <motion.div
      className="opening__cut opening__cut--demo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      onClick={phase === 'text' ? undefined : fastForward}
    >
      {/* 打鍵チップ（CLAUDE=ターミナル風 / CURSOR=エディタタブ風） */}
      <div className={`opening__cmd ${isCursor ? 'opening__cmd--editor' : 'opening__cmd--term'}`}>
        {isCursor ? (
          <span className="opening__cmd-tab">CURSOR ─ AGENT</span>
        ) : (
          <span className="opening__cmd-prompt">$</span>
        )}
        <span className="opening__cmd-text">
          {noWidow(cmdShown)}
          <span className="opening__caret" />
        </span>
      </div>

      {/* accent色のフラッシュ */}
      {phase !== 'cmd' && (
        <motion.div
          className="opening__flash"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {/* 成果物のカットイン（画面の主役） */}
      {phase !== 'cmd' && cut.artifact && (
        <motion.div
          className="opening__artifact"
          initial={{ scale: 0.7, opacity: 0, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, rotate: -1.5 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
        >
          <ArtifactPreview artifact={cut.artifact} />
        </motion.div>
      )}

      {/* 一文（タイプライタ）。読み終えたら自動送り */}
      {phase === 'text' && <DemoCaption cut={cut} onAdvance={onAdvance} />}
    </motion.div>
  );
}

function DemoCaption({ cut, onAdvance }: { cut: OpeningCut; onAdvance: () => void }) {
  const { shown, done, skip } = useTypewriter(cut.text, { blip: true });
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onAdvance, cut.holdMs ?? 2800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);
  return (
    <motion.p
      className="opening__caption"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => (done ? onAdvance() : skip())}
    >
      {keepKatakana(shown)}
    </motion.p>
  );
}

/* ---- 最終カット：ロゴ → 扉を開く -------------------------------------- */
function Finale({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="opening__cut opening__finale"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="title__mark">
        <motion.span
          className="kicker"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          A VIBE CODING ADVENTURE
        </motion.span>
        <motion.h1
          className="display title__big glitch"
          data-text="VIBE"
          initial={{ x: -120, opacity: 0, skewX: 12 }}
          animate={{ x: 0, opacity: 1, skewX: -8 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.25 }}
        >
          VIBE
        </motion.h1>
        <motion.h1
          className="display title__big title__big--red glitch"
          data-text="GUILD"
          initial={{ x: 120, opacity: 0, skewX: 12 }}
          animate={{ x: 0, opacity: 1, skewX: -8 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.38 }}
        >
          GUILD
        </motion.h1>
      </div>
      <motion.div
        className="opening__enter"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 160, damping: 22 }}
      >
        <AngledButton full sound="confirm" onClick={onEnter}>
          ▶ 扉を開く
        </AngledButton>
      </motion.div>
    </motion.div>
  );
}
