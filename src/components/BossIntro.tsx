import { motion } from 'framer-motion';
import type { BossInfo } from '../types';
import { BossGlyph } from './BossGlyph';

/**
 * 章に入った瞬間の、ボス（歪み）登場カットイン。P5的な一瞬のキメ。
 * 自分でフェードアウトして消える（pointer-events:none）。
 */
export function BossIntro({ boss, accent }: { boss: BossInfo; accent: string }) {
  return (
    <motion.div
      className="bossintro"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 2.2, times: [0, 0.78, 1] }}
    >
      <motion.div
        className="bossintro__flash"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      <div className="bossintro__band">
        <motion.div
          className="bossintro__bandfill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
        />
      </div>

      <motion.div
        className="bossintro__glyph"
        initial={{ scale: 0.3, rotate: -25, opacity: 0 }}
        animate={{ scale: 1, rotate: -6, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <BossGlyph accent={accent} />
      </motion.div>

      <motion.div
        className="bossintro__text"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.16 }}
      >
        <span className="bossintro__tag head">歪み 出現</span>
        <span className="bossintro__name display">「{boss.name}」</span>
        <span className="bossintro__title head">{boss.title}</span>
      </motion.div>
    </motion.div>
  );
}
