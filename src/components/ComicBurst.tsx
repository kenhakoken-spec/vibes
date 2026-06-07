import { motion } from 'framer-motion';

/**
 * 達成スティンガー。ギザギザ星はやめ、斜めバナー＋極太タイポで
 * スタイリッシュに決める（P5のオールアウトアタック的なキメ）。自動で消える。
 */
export function ComicBurst({ label, sub = 'CLEAR' }: { label?: string; sub?: string }) {
  return (
    <motion.div
      className="stinger"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 1.5, times: [0, 0.62, 1] }}
    >
      {/* 一瞬の白フラッシュ */}
      <motion.div
        className="stinger__flash"
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
      />

      {/* 斜めの赤バナーが左から走る */}
      <div className="stinger__band">
        <motion.div
          className="stinger__bandfill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.42, ease: [0.7, 0, 0.2, 1] }}
        />
      </div>

      {/* 細いスピードライン */}
      <div className="stinger__lines">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="stinger__line"
            style={{ top: `${36 + i * 9}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
          />
        ))}
      </div>

      {label && (
        <div className="stinger__center">
          <motion.span
            className="stinger__sub head"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            {sub}
          </motion.span>
          <motion.span
            className="stinger__text display"
            initial={{ scale: 1.3, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: -5, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.16 }}
          >
            {label}
          </motion.span>
        </div>
      )}
    </motion.div>
  );
}
