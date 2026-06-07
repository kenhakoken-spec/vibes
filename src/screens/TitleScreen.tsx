import { motion } from 'framer-motion';
import { useGame, hasSave } from '../store/gameStore';
import { useSettings } from '../store/settingsStore';
import { AngledButton } from '../components/AngledButton';

export function TitleScreen() {
  const pressStart = useGame((s) => s.pressStart);
  const continueGame = useGame((s) => s.continueGame);
  const openPanel = useSettings((s) => s.openPanel);
  const saved = hasSave();

  return (
    <motion.div
      className="screen title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="title__mark">
        <motion.span
          className="kicker"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          A VIBE CODING ADVENTURE
        </motion.span>

        <motion.h1
          className="display title__big glitch"
          data-text="VIBE"
          initial={{ x: -120, opacity: 0, skewX: 12 }}
          animate={{ x: 0, opacity: 1, skewX: -8 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.15 }}
        >
          VIBE
        </motion.h1>
        <motion.h1
          className="display title__big title__big--red glitch"
          data-text="GUILD"
          initial={{ x: 120, opacity: 0, skewX: 12 }}
          animate={{ x: 0, opacity: 1, skewX: -8 }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.28 }}
        >
          GUILD
        </motion.h1>

        <motion.p
          className="title__jp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.4 }}
        >
          バイブコーディング・ギルド
        </motion.p>
      </div>

      <motion.div
        className="title__menu"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      >
        {saved && (
          <AngledButton full sound="confirm" onClick={continueGame}>
            ▶ つづきから
          </AngledButton>
        )}
        <AngledButton full variant={saved ? 'ghost' : 'solid'} sound="confirm" onClick={pressStart}>
          ＋ はじめから
        </AngledButton>
        <AngledButton full variant="ghost" sound="click" onClick={openPanel}>
          ⚙ 設定
        </AngledButton>
      </motion.div>

      <motion.p
        className="title__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        コード未経験から、言葉でものを作れる自分へ。<br />
        Claude / Cursor と学ぶ、スタイリッシュな学習アドベンチャー。
      </motion.p>
    </motion.div>
  );
}
