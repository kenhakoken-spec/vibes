import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { ArtifactKind, ArtifactState } from '../types';

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
              {line}
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
/** SCORE を target までカウントアップ（“動いているゲーム”の生気） */
function useCountUp(target: number, ms = 1800) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

function GameView({ a }: { a: ArtifactState }) {
  // body[0]=ゲームタイトル / body[1]="SCORE 12800" 形式（無ければ既定値）
  const gameTitle = a.body[0] ?? 'NEON SHOOTER';
  const target = Number((a.body[1] ?? '').replace(/\D/g, '')) || 12800;
  const score = useCountUp(target);
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
        {/* 敵編隊（ゆらぎ） */}
        <motion.div
          className="artifact__game-foes"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
        >
          <span>▼</span>
          <span>▼</span>
          <span>▼</span>
        </motion.div>
        {/* 自機の弾 */}
        <motion.span
          className="artifact__game-shot"
          animate={{ y: [-4, -86], opacity: [1, 0] }}
          transition={{ duration: 0.7, ease: 'linear', repeat: Infinity, repeatDelay: 0.35 }}
        >
          |
        </motion.span>
        {/* 自機 */}
        <motion.span
          className="artifact__game-ship"
          animate={{ x: [-26, 22, -26] }}
          transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
        >
          ▲
        </motion.span>
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
function DashboardView({ a }: { a: ArtifactState }) {
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
        <div className="artifact__dash-kpis">
          {kpis.slice(0, 4).map((k, i) => (
            <motion.div
              key={i}
              className="artifact__dash-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
            >
              <span className="artifact__dash-label">{k.label}</span>
              <span className="artifact__dash-value">{k.value}</span>
              {k.delta && (
                <span className={`artifact__dash-delta ${k.delta.startsWith('-') ? 'is-down' : 'is-up'}`}>
                  {k.delta.startsWith('-') ? '▼' : k.delta === '0' ? '─' : '▲'} {k.delta.replace(/^[+-]/, '')}
                </span>
              )}
            </motion.div>
          ))}
        </div>
        {/* バーチャート（時間差で伸びる） */}
        <div className="artifact__dash-bars">
          {bars.map((w, i) => (
            <motion.span
              key={i}
              initial={{ width: 0 }}
              animate={{ width: `${w}%` }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </div>
        {/* 折れ線スパークライン */}
        <svg className="artifact__dash-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
          <motion.path
            d="M0 18 L12 14 L24 16 L36 9 L48 12 L60 6 L72 9 L84 4 L100 7"
            fill="none"
            strokeWidth="1.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
          />
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
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
