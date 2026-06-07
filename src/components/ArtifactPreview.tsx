import { motion } from 'framer-motion';
import type { ArtifactKind, ArtifactState } from '../types';

/**
 * 章を通して育つ“成果物”の表示。種類ごとに正しい見た目で描き分ける。
 * web=ブラウザ / file=ファイル(エディタ) / terminal=黒画面 / note=カード。
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
          {a.body.map((line, i) => (
            <h2 key={i} className="artifact__hello">
              {line}
            </h2>
          ))}
          {a.hasButton && (
            <button className={`artifact__btn ${a.fixed ? 'is-live' : 'is-dead'}`} disabled>
              {a.buttonLabel}
            </button>
          )}
          {a.fixed && a.hasButton && <p className="artifact__toast">入室しました ✓</p>}
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
