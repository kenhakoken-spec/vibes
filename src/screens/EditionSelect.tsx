import { motion } from 'framer-motion';
import { useGame } from '../store/gameStore';
import { EDITIONS } from '../data/editions';
import { CharacterPortrait } from '../components/CharacterPortrait';
import { keepKatakana } from '../components/keepKatakana';
import type { EditionId } from '../types';

const ORDER: EditionId[] = ['claude', 'cursor'];

export function EditionSelect() {
  const selectEdition = useGame((s) => s.selectEdition);

  return (
    <motion.div
      className="screen edition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      <div className="edition__head">
        <span className="kicker">CHOOSE YOUR ROUTE</span>
        <h2 className="display edition__title">どちらの相棒と征く？</h2>
        <p className="edition__note">※ 編によって世界観・相棒・トーンが別物。後からタイトルでやり直せる。</p>
      </div>

      <div className="edition__cards">
        {ORDER.map((id, i) => {
          const ed = EDITIONS[id];
          return (
            <motion.button
              key={id}
              className="edition__card"
              style={
                {
                  ['--accent' as string]: ed.accent,
                  ['--accent-2' as string]: ed.accent2,
                } as React.CSSProperties
              }
              initial={{ y: 60, opacity: 0, rotate: i === 0 ? -2 : 2 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.15 + i * 0.12 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => selectEdition(id)}
            >
              <div className="edition__portrait">
                <CharacterPortrait variant={ed.partner.portrait} accent={ed.accent} />
              </div>
              <div className="edition__meta">
                <span className="edition__label display">{ed.label}</span>
                <span className="edition__tag">{keepKatakana(ed.tagline)}</span>
                <span className="edition__tech">{keepKatakana(ed.techNote)}</span>
                <span className="edition__guild chip">{ed.guildName}</span>
                <p className="edition__desc">{keepKatakana(ed.description)}</p>
                <div className="edition__partner">
                  <b style={{ color: ed.accent }}>{ed.partner.name}</b>
                  <span>{ed.partner.role}</span>
                </div>
                <span className="edition__cta">この道で始める ▶</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
