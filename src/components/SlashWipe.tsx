import { motion } from 'framer-motion';

/**
 * 画面切り替えごとに走る、赤い対角スラッシュのワイプ。
 * App側で screen をkeyにして再マウントさせ、毎回再生する。
 * 重要: 走り終わったら必ず消える（残って右端を覆わないように opacity→0）。
 */
export function SlashWipe() {
  return (
    <motion.div
      className="wipe"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 0.7, times: [0, 0.8, 1] }}
    >
      <motion.div
        className="wipe__bar wipe__bar--1"
        initial={{ x: '-170%' }}
        animate={{ x: '170%' }}
        transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
      />
      <motion.div
        className="wipe__bar wipe__bar--2"
        initial={{ x: '-170%' }}
        animate={{ x: '170%' }}
        transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1], delay: 0.06 }}
      />
      <motion.div
        className="wipe__flash"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
