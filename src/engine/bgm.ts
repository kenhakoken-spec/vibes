import { ac } from './audio';
import { useSettings } from '../store/settingsStore';

/* =========================================================================
   雰囲気BGM（手続き的アンビエント・パッド）。メロディは持たず、
   暗く厚いドローンで“常に鳴っている空気”を作る。安っぽくならないよう低音量。
   mood: 'calm'(メニュー/物語) / 'tense'(依頼/ボス)
   ========================================================================= */

type Mood = 'calm' | 'tense';

interface Graph {
  master: GainNode;
  filter: BiquadFilterNode;
  oscs: OscillatorNode[];
  lfo: OscillatorNode;
  lfoGain: GainNode;
}

let graph: Graph | null = null;
let started = false;
let current: Mood = 'calm';

const CHORDS: Record<Mood, number[]> = {
  // Dマイナー系の暗く落ち着いたパッド
  calm: [73.42, 110.0, 146.83, 220.0],
  // 半音をぶつけた緊張感のある和音（低め）
  tense: [69.3, 103.83, 138.59, 207.65],
};

const FILTER_BASE: Record<Mood, number> = { calm: 520, tense: 760 };
const MASTER_VOL = 0.05;

function build(a: AudioContext): Graph {
  const master = a.createGain();
  master.gain.value = 0;
  master.connect(a.destination);

  const filter = a.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = FILTER_BASE[current];
  filter.Q.value = 6;
  filter.connect(master);

  // フィルターを揺らすLFO（ゆっくり）
  const lfo = a.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = a.createGain();
  lfoGain.gain.value = 220;
  lfo.connect(lfoGain).connect(filter.frequency);
  lfo.start();

  const oscs = CHORDS[current].map((f, i) => {
    const osc = a.createOscillator();
    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.value = f;
    osc.detune.value = (i - 1.5) * 6; // わずかなデチューンで厚みを
    const g = a.createGain();
    g.gain.value = i === 0 ? 0.5 : 0.28; // 低音を厚めに
    osc.connect(g).connect(filter);
    osc.start();
    return osc;
  });

  return { master, filter, oscs, lfo, lfoGain };
}

export const bgm = {
  start(mood: Mood = current) {
    if (!useSettings.getState().sound) return;
    const a = ac();
    if (!a) return;
    current = mood;
    if (!graph) graph = build(a);
    started = true;
    bgm.setMood(mood);
    graph.master.gain.cancelScheduledValues(a.currentTime);
    graph.master.gain.setTargetAtTime(MASTER_VOL, a.currentTime, 1.2);
  },

  setMood(mood: Mood) {
    const a = ac();
    if (!a || !graph) return;
    current = mood;
    const t = a.currentTime;
    graph.filter.frequency.setTargetAtTime(FILTER_BASE[mood], t, 1.5);
    graph.lfo.frequency.setTargetAtTime(mood === 'tense' ? 0.13 : 0.07, t, 1);
    CHORDS[mood].forEach((f, i) => {
      graph!.oscs[i]?.frequency.setTargetAtTime(f, t, 1.2);
    });
  },

  stop() {
    const a = ac();
    if (!a || !graph) return;
    graph.master.gain.cancelScheduledValues(a.currentTime);
    graph.master.gain.setTargetAtTime(0, a.currentTime, 0.6);
    started = false;
  },

  isOn() {
    return started;
  },
};
