import { motion } from 'framer-motion';
import type { ArtifactState } from '../types';

/**
 * 章を通して育っていく“成果物”のモックブラウザ表示。
 * ステージをクリアするたびに body / ボタン / 修正状態が増えていく。
 */
export function ArtifactPreview({ artifact }: { artifact: ArtifactState | null }) {
  return (
    <div className="artifact">
      <div className="artifact__bar">
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__url">{artifact?.title ?? 'まだ何もない'}</span>
      </div>
      <div className="artifact__screen">
        {!artifact && <p className="artifact__empty">// ここに成果物が生まれる</p>}
        {artifact && (
          <motion.div
            className="artifact__page"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {artifact.body.map((line, i) => (
              <h2 key={i} className="artifact__hello">
                {line}
              </h2>
            ))}
            {artifact.hasButton && (
              <motion.button
                className={`artifact__btn ${artifact.fixed ? 'is-live' : 'is-dead'}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                disabled
              >
                {artifact.buttonLabel}
              </motion.button>
            )}
            {artifact.fixed && <p className="artifact__toast">入室しました ✓</p>}
          </motion.div>
        )}
      </div>
    </div>
  );
}
