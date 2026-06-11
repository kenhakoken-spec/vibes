import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSettings } from '../store/settingsStore';
import { keepKatakana } from './keepKatakana';
import type { ArtifactKind, ArtifactState } from '../types';

/** OS設定(prefers-reduced-motion) とアプリ内モーションOFF の両方に従う */
function useMotionOff() {
  const osReduced = useReducedMotion();
  const motionOn = useSettings((s) => s.motion);
  return !motionOn || !!osReduced;
}

/**
 * 章を通して育つ“成果物”の表示。種類ごとに正しい見た目で描き分ける。
 * web=ブラウザ / file=ファイル(エディタ) / terminal=黒画面 / note=カード
 * game=ネオンSTG / dashboard=監視盤面（OPの圧倒デモや後半章の成果物用）。
 */
export function ArtifactPreview({ artifact }: { artifact: ArtifactState | null }) {
  if (!artifact) {
    return (
      <div className="artifact artifact--empty">
        <p className="artifact__empty">// ここに成果物が生まれる</p>
      </div>
    );
  }
  const kind = artifact.kind ?? inferKind(artifact);
  return (
    <motion.div
      className="artifact"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {kind === 'web' && <WebView a={artifact} />}
      {kind === 'file' && <FileView a={artifact} />}
      {kind === 'terminal' && <TerminalView a={artifact} />}
      {kind === 'note' && <NoteView a={artifact} />}
      {kind === 'game' && <GameView a={artifact} />}
      {kind === 'dashboard' && <DashboardView a={artifact} />}
    </motion.div>
  );
}

function inferKind(a: ArtifactState): ArtifactKind {
  const t = a.title.toLowerCase();
  if (a.hasButton || t.endsWith('.html') || t.includes('github.io') || t.includes('github.com')) return 'web';
  if (t.includes('起動') || a.body.some((l) => l.trim().startsWith('$'))) return 'terminal';
  if (/\.(md|tsx?|jsx?|json|css|py)$/.test(t) || t.endsWith('/') || t.includes('log') || t.includes('gcp') || t.includes('cloud') || t.includes('dist') || t.includes('mcp')) return 'file';
  return 'note';
}

/* ---- web: ブラウザ風 ------------------------------------------------ */
function WebView({ a }: { a: ArtifactState }) {
  return (
    <>
      <div className="artifact__bar">
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__url">{a.title}</span>
      </div>
      <div className="artifact__screen">
        <div className="artifact__page">
          {/* 見出しは時間差で立ち上がり、トーストはポンと出る（“動いているサイト”の生気） */}
          {a.body.map((line, i) => (
            <motion.h2
              key={i}
              className="artifact__hello"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
            >
              {keepKatakana(line)}
            </motion.h2>
          ))}
          {a.hasButton && (
            <motion.button
              className={`artifact__btn ${a.fixed ? 'is-live' : 'is-dead'}`}
              disabled
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 18 }}
            >
              {a.buttonLabel}
            </motion.button>
          )}
          {a.fixed && a.hasButton && (
            <motion.p
              className="artifact__toast"
              initial={{ opacity: 0, y: 8, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 300, damping: 16 }}
            >
              {a.toast ?? '入室しました ✓'}
            </motion.p>
          )}
        </div>
      </div>
    </>
  );
}

/* ---- file: エディタ/ファイル風 ------------------------------------- */
function FileView({ a }: { a: ArtifactState }) {
  return (
    <>
      <div className="artifact__tabbar">
        <span className="artifact__tab">{a.title}</span>
        {a.fixed && <span className="artifact__saved">✓ 保存</span>}
      </div>
      <pre className="artifact__code">
        {a.body.map((line, i) => (
          <div key={i} className="artifact__codeline">
            <span className="artifact__ln">{i + 1}</span>
            <span>{line}</span>
          </div>
        ))}
      </pre>
    </>
  );
}

/* ---- terminal: 黒い画面 -------------------------------------------- */
function TerminalView({ a }: { a: ArtifactState }) {
  return (
    <>
      <div className="artifact__bar artifact__bar--term">
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__url">{a.title}</span>
      </div>
      <pre className="artifact__term">
        {a.body.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </>
  );
}

/* ---- game: ネオンシューティング ------------------------------------- */
/** 敵編隊は 3×2 の6機。撃破されても次の波がすぐ補充される（ループ） */
const FOES = [0, 1, 2, 3, 4, 5];

function GameView({ a }: { a: ArtifactState }) {
  // body[0]=ゲームタイトル / body[1]="SCORE 12800" 形式（無ければ既定値）
  const gameTitle = a.body[0] ?? 'NEON SHOOTER';
  const base = Number((a.body[1] ?? '').replace(/\D/g, '')) || 12800;
  const motionOff = useMotionOff();
  // “プレイ中”のスコア。撃ち続けている間じゅう刻まれ、撃破でボーナスが乗る
  const [score, setScore] = useState(motionOff ? base : 0);
  const [boom, setBoom] = useState<{ idx: number; id: number } | null>(null);

  useEffect(() => {
    if (motionOff) {
      setScore(base);
      return;
    }
    const tick = window.setInterval(
      () => setScore((s) => s + 20 + Math.floor(Math.random() * 60)),
      140
    );
    // 約1秒ごとにどれかの敵が散る（フラッシュ + 撃破ボーナス）
    let id = 0;
    let clear = 0;
    const kill = window.setInterval(() => {
      id += 1;
      setBoom({ idx: Math.floor(Math.random() * FOES.length), id });
      setScore((s) => s + 250);
      window.clearTimeout(clear);
      clear = window.setTimeout(() => setBoom(null), 460);
    }, 1050);
    return () => {
      window.clearInterval(tick);
      window.clearInterval(kill);
      window.clearTimeout(clear);
    };
  }, [motionOff, base]);

  return (
    <>
      <div className="artifact__bar artifact__bar--term">
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__url">{a.title}</span>
      </div>
      <div className="artifact__game">
        {/* 流れるビル群（2枚連結で無限スクロール） */}
        <motion.div
          className="artifact__game-city"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((k) => (
            <svg key={k} viewBox="0 0 200 60" preserveAspectRatio="none">
              <path
                d="M0 60 V34 h14 v-10 h10 v18 h12 V22 h16 v24 h10 v-14 h18 v22 h12 V18 h14 v30 h12 v-12 h16 v20 h12 V28 h14 v32 Z"
                fill="rgba(255,255,255,0.07)"
              />
            </svg>
          ))}
        </motion.div>

        {/* 撃破の瞬間、画面がうっすら明滅する */}
        <AnimatePresence>
          {boom && (
            <motion.div
              key={`flash-${boom.id}`}
              className="artifact__game-flash"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {/* 敵編隊：左右にスウェイしながら、じわじわ降りてくる */}
        <motion.div
          className="artifact__game-foes"
          animate={{ y: [0, 20, 0], x: [-8, 8, -8] }}
          transition={{
            y: { duration: 6.5, ease: 'easeInOut', repeat: Infinity },
            x: { duration: 2.4, ease: 'easeInOut', repeat: Infinity },
          }}
        >
          {FOES.map((i) => (
            <span
              key={i}
              className="artifact__game-foe"
              style={{ opacity: boom?.idx === i ? 0 : 1 }}
            >
              ▼
            </span>
          ))}
          {/* 撃破フラッシュ（散った敵の位置で弾ける） */}
          <AnimatePresence>
            {boom && (
              <motion.span
                key={boom.id}
                className="artifact__game-boom"
                style={{
                  left: `${(boom.idx % 3) * 33.4 + 16.7}%`,
                  top: boom.idx < 3 ? '-12%' : '52%',
                }}
                initial={{ scale: 0.3, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                ✦
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 自機リグ：機体と弾が一体で左右に流れる（弾は自機から連射） */}
        <motion.div
          className="artifact__game-rig"
          animate={{ x: [-34, 26, -12, 34, -34] }}
          transition={{ duration: 5.6, ease: 'easeInOut', repeat: Infinity }}
        >
          {!motionOff &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="artifact__game-shot"
                animate={{ y: [0, -110], opacity: [1, 1, 0] }}
                transition={{ duration: 0.55, ease: 'linear', repeat: Infinity, delay: i * 0.18 }}
              />
            ))}
          <span className="artifact__game-ship">▲</span>
        </motion.div>

        <div className="artifact__game-hud">
          <span className="artifact__game-title">{gameTitle}</span>
          <span className="artifact__game-score">SCORE {score.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
}

/* ---- dashboard: 監視盤面 -------------------------------------------- */
/** body 1行 = "ラベル|値|増減" 形式の KPI。増減は +/-/0 始まり */

/** "98.2%" のような値の数値部分を、カウントアップ→微小な揺らぎで“生かす” */
function useLiveValue(raw: string, motionOff: boolean, delayMs = 0) {
  const [text, setText] = useState(motionOff ? raw : raw.replace(/-?\d+(?:\.\d+)?/, '0'));
  useEffect(() => {
    const m = raw.match(/-?\d+(?:\.\d+)?/);
    if (motionOff || !m) {
      setText(raw);
      return;
    }
    const target = parseFloat(m[0]);
    const dec = (m[0].split('.')[1] ?? '').length;
    const render = (n: number) => raw.replace(m[0], Math.max(0, n).toFixed(dec));
    // ① 立ち上がりのカウントアップ（約0.9秒）
    const t0 = performance.now() + delayMs;
    let raf = 0;
    const grow = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / 900));
      setText(render(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(grow);
    };
    raf = requestAnimationFrame(grow);
    // ② その後は計測値らしく小さくティックし続ける（0 は 0 のまま）
    const amp = target === 0 ? 0 : Math.max(Math.abs(target) * 0.012, dec > 0 ? 0.1 : 1);
    const jitter = window.setInterval(() => {
      setText(render(target + (Math.random() * 2 - 1) * amp));
    }, 1400 + delayMs);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(jitter);
    };
  }, [raw, motionOff, delayMs]);
  return text;
}

function KpiCard({
  k,
  i,
  motionOff,
}: {
  k: { label: string; value: string; delta: string };
  i: number;
  motionOff: boolean;
}) {
  const value = useLiveValue(k.value, motionOff, i * 120);
  return (
    <motion.div
      className="artifact__dash-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + i * 0.12 }}
    >
      <span className="artifact__dash-label">{k.label}</span>
      <span className="artifact__dash-value">{value}</span>
      {k.delta && (
        <span className={`artifact__dash-delta ${k.delta.startsWith('-') ? 'is-down' : 'is-up'}`}>
          {k.delta.startsWith('-') ? '▼' : k.delta === '0' ? '─' : '▲'} {k.delta.replace(/^[+-]/, '')}
        </span>
      )}
    </motion.div>
  );
}

const SPARK_A = 'M0 18 L12 14 L24 16 L36 9 L48 12 L60 6 L72 9 L84 4 L100 7';
const SPARK_B = 'M0 16 L12 17 L24 11 L36 13 L48 7 L60 10 L72 6 L84 9 L100 3';
const SPARK_C = 'M0 19 L12 13 L24 15 L36 8 L48 13 L60 7 L72 10 L84 5 L100 8';

function DashboardView({ a }: { a: ArtifactState }) {
  const motionOff = useMotionOff();
  const kpis = a.body.map((line) => {
    const [label = '', value = '', delta = ''] = line.split('|');
    return { label, value, delta };
  });
  const bars = [62, 88, 45, 73, 96];
  return (
    <>
      <div className="artifact__bar">
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__dot" />
        <span className="artifact__url">{a.title}</span>
      </div>
      <div className="artifact__dash">
        {/* ライブ計測中のインジケータ */}
        <div className="artifact__dash-head">
          <span className="artifact__dash-live">
            <motion.span
              className="artifact__dash-livedot"
              animate={motionOff ? undefined : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            />
            LIVE
          </span>
          <span className="artifact__dash-feed">受信中 ─ 12 sensors</span>
        </div>
        <div className="artifact__dash-kpis">
          {kpis.slice(0, 4).map((k, i) => (
            <KpiCard key={i} k={k} i={i} motionOff={motionOff} />
          ))}
        </div>
        {/* バーチャート：時間差で伸び、その後も呼吸するように伸び縮みを繰り返す */}
        <div className="artifact__dash-bars">
          {bars.map((w, i) => (
            <motion.span
              key={i}
              className="artifact__dash-bar"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: w / 100 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            >
              <motion.span
                className="artifact__dash-barfill"
                animate={motionOff ? undefined : { scaleX: [1, 0.72, 1.04, 0.85, 1] }}
                transition={{
                  delay: 1.1 + i * 0.18,
                  duration: 3 + i * 0.35,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.span>
          ))}
        </div>
        {/* 折れ線スパークライン：描画されたあと、波形が更新され続ける */}
        <svg className="artifact__dash-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
          <motion.path
            fill="none"
            strokeWidth="1.6"
            initial={{ pathLength: 0, d: SPARK_A }}
            animate={
              motionOff
                ? { pathLength: 1, d: SPARK_A }
                : { pathLength: 1, d: [SPARK_A, SPARK_B, SPARK_C, SPARK_A] }
            }
            transition={{
              pathLength: { delay: 0.7, duration: 0.9, ease: 'easeOut' },
              d: { delay: 2, duration: 7, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
          {/* 最新値の点（波形の終端で脈打つ） */}
          {!motionOff && (
            <motion.circle
              className="artifact__dash-sparkdot"
              cx="100"
              r="1.8"
              initial={{ cy: 7, opacity: 0 }}
              animate={{ cy: [7, 3, 8, 7], opacity: [1, 0.45, 1, 1] }}
              transition={{
                cy: { delay: 2, duration: 7, repeat: Infinity, ease: 'easeInOut' },
                opacity: { delay: 1.6, duration: 1.3, repeat: Infinity },
              }}
            />
          )}
        </svg>
      </div>
    </>
  );
}

/* ---- note: メモ/カード --------------------------------------------- */
function NoteView({ a }: { a: ArtifactState }) {
  return (
    <div className="artifact__note">
      <span className="artifact__note-title">{a.title}</span>
      <ul>
        {a.body.map((line, i) => (
          <li key={i}>{keepKatakana(line)}</li>
        ))}
      </ul>
    </div>
  );
}
