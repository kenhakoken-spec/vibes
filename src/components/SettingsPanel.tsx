import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from '../store/settingsStore';
import { clearSave, useGame } from '../store/gameStore';
import { sfx } from '../engine/sfx';

const SPEEDS: { id: 'slow' | 'normal' | 'fast' | 'instant'; label: string }[] = [
  { id: 'slow', label: 'ゆっくり' },
  { id: 'normal', label: 'ふつう' },
  { id: 'fast', label: 'はやい' },
  { id: 'instant', label: '瞬間' },
];

export function SettingsPanel() {
  const { open, closePanel, sound, motion: motionOn, textSpeed, toggleSound, toggleMotion, setTextSpeed } =
    useSettings();
  const backToTitle = useGame((s) => s.backToTitle);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePanel}
        >
          <motion.div
            className="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet__grip" />
            <span className="kicker">SETTINGS ／ 設定</span>
            <h3 className="display sheet__word">設定</h3>

            <button
              className="setrow"
              onClick={() => {
                toggleSound();
                sfx.click();
              }}
            >
              <span>🔊 サウンド</span>
              <span className={`toggle ${sound ? 'is-on' : ''}`}>{sound ? 'ON' : 'OFF'}</span>
            </button>

            <button
              className="setrow"
              onClick={() => {
                toggleMotion();
                sfx.click();
              }}
            >
              <span>✨ 演出・アニメ</span>
              <span className={`toggle ${motionOn ? 'is-on' : ''}`}>{motionOn ? 'ON' : 'OFF'}</span>
            </button>

            <div className="setrow setrow--col">
              <span>💬 会話の速さ</span>
              <div className="seg">
                {SPEEDS.map((s) => (
                  <button
                    key={s.id}
                    className={`seg__btn ${textSpeed === s.id ? 'is-on' : ''}`}
                    onClick={() => {
                      setTextSpeed(s.id);
                      sfx.click();
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="setrow setrow--danger"
              onClick={() => {
                if (confirm('セーブデータを消して最初からにします。よろしいですか？')) {
                  clearSave();
                  closePanel();
                  backToTitle();
                }
              }}
            >
              <span>🗑 セーブを消す</span>
              <span className="setrow__hint">最初から</span>
            </button>

            <button className="sheet__close" onClick={closePanel}>
              閉じる ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
