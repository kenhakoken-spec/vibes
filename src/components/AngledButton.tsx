import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { sfx } from '../engine/sfx';
import { keepKatakana } from './keepKatakana';

interface Props {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
  disabled?: boolean;
  full?: boolean;
  /** 左に出す番号/記号バッジ（選択肢の見分け用） */
  badge?: ReactNode;
  /** 再生する効果音 */
  sound?: 'click' | 'confirm' | 'select' | 'back';
}

/** P5メニュー風の斜めカットボタン。ホバーでスライドする赤いフィル。 */
export function AngledButton({ children, onClick, variant = 'solid', disabled, full, badge, sound = 'click' }: Props) {
  return (
    <motion.button
      className={`abtn abtn--${variant} ${full ? 'abtn--full' : ''} ${badge != null ? 'abtn--badged' : ''}`}
      onClick={() => {
        sfx[sound]();
        onClick?.();
      }}
      onHoverStart={disabled ? undefined : () => sfx.hover()}
      disabled={disabled}
      whileHover={disabled ? undefined : { x: 6 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <span className="abtn__fill" />
      {badge != null && <span className="abtn__badge">{badge}</span>}
      <span className="abtn__label">
        {typeof children === 'string' ? keepKatakana(children) : children}
      </span>
    </motion.button>
  );
}
