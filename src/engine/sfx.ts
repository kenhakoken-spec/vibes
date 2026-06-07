import { useSettings } from '../store/settingsStore';
import { ac } from './audio';

/* =========================================================================
   合成サウンドエフェクト（WebAudio）。音源ファイル不要。
   設定でサウンドOFFなら鳴らさない。最初のユーザー操作でAudioContext起動。
   ========================================================================= */

interface ToneOpts {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  to?: number; // glide target freq
  delay?: number;
}

function tone({ freq, dur, type = 'square', gain = 0.08, to, delay = 0 }: ToneOpts) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function on(): boolean {
  return useSettings.getState().sound;
}

export const sfx = {
  hover() {
    if (!on()) return;
    tone({ freq: 520, dur: 0.04, gain: 0.025, type: 'triangle' });
  },
  click() {
    if (!on()) return;
    tone({ freq: 660, to: 880, dur: 0.06, gain: 0.06, type: 'square' });
  },
  select() {
    if (!on()) return;
    tone({ freq: 740, to: 990, dur: 0.07, gain: 0.06 });
  },
  confirm() {
    if (!on()) return;
    tone({ freq: 600, to: 1200, dur: 0.12, gain: 0.07, type: 'sawtooth' });
    tone({ freq: 900, dur: 0.1, gain: 0.04, type: 'square', delay: 0.05 });
  },
  back() {
    if (!on()) return;
    tone({ freq: 480, to: 300, dur: 0.09, gain: 0.05, type: 'triangle' });
  },
  error() {
    if (!on()) return;
    tone({ freq: 200, to: 130, dur: 0.22, gain: 0.07, type: 'sawtooth' });
  },
  /** クリア時の小さなアルペジオ（P5の勝利感） */
  clear() {
    if (!on()) return;
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => tone({ freq: f, dur: 0.16, gain: 0.07, type: 'square', delay: i * 0.07 }));
    tone({ freq: 1568, dur: 0.3, gain: 0.05, type: 'triangle', delay: 0.3 });
  },
  /** タイプライタの控えめなブリップ */
  blip() {
    if (!on()) return;
    tone({ freq: 1200, dur: 0.015, gain: 0.012, type: 'square' });
  },
};
