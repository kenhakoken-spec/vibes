import { useId } from 'react';
import type { DiagramKind } from '../types';
import { noWidow } from './keepKatakana';

/* =========================================================================
   構造説明の図解。手順系はHTML、関係系はSVGで。
   （唐突になりがちな概念＝セットアップ/MCP/Git/クラウドを“見て”理解できるように）
   ※ SVGのmarker等のidはインスタンス毎ユニーク化（複数表示時の衝突防止）。
   ========================================================================= */

export function Diagram({ kind }: { kind: DiagramKind }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return <div className="diagram">{RENDER[kind](uid)}</div>;
}

/** 矢印マーカー（各SVGに同梱して使う） */
function ArrowDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <marker id={`mk-${uid}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0 0 L8 4 L0 8 Z" fill="var(--accent)" />
      </marker>
    </defs>
  );
}

function Step({ n, title, lines }: { n: number; title: string; lines: (string | { code: string })[] }) {
  return (
    <div className="dgm__step">
      <span className="dgm__num">{n}</span>
      <div className="dgm__body">
        <b>{title}</b>
        {lines.map((l, i) =>
          typeof l === 'string' ? (
            <span key={i} className="dgm__note">
              {noWidow(l)}
            </span>
          ) : (
            <code key={i} className="dgm__code">
              {l.code}
            </code>
          ),
        )}
      </div>
    </div>
  );
}

const RENDER: Record<DiagramKind, (uid: string) => React.ReactElement> = {
  'setup-claude': () => (
    <div className="dgm__steps">
      <div className="dgm__title">クロード召喚の儀 ＝ Claude Code 導入</div>
      <Step
        n={1}
        title="ターミナル（黒い画面）を開く"
        lines={[
          'Mac: ⌘+スペース →「ターミナル」と打って開く',
          'Windows: スタートで「PowerShell」または「ターミナル」を開く',
          '※ ここに“呪文”を貼って実行していく',
        ]}
      />
      <Step
        n={2}
        title="インストール（公式・コピペ1回）"
        lines={[
          'ターミナルに下を貼って Enter：',
          { code: 'Mac/Linux: curl -fsSL https://claude.ai/install.sh | bash' },
          { code: 'Windows: irm https://claude.ai/install.ps1 | iex' },
        ]}
      />
      <Step n={3} title="作りたいもののフォルダで起動" lines={['そのフォルダで、こう打つ：', { code: 'claude' }]} />
      <Step n={4} title="ログイン" lines={['画面の案内に従ってサインイン（Claude Pro / Max / API などの契約が必要）']} />
    </div>
  ),
  'setup-cursor': () => (
    <div className="dgm__steps">
      <div className="dgm__title">カーサ召喚の儀 ＝ Cursor 導入</div>
      <Step n={1} title="ダウンロード＆インストール" lines={['公式 cursor.com から（ふつうのアプリと同じ。案内に従うだけ／Win・Mac・Linux対応）']} />
      <Step n={2} title="サインイン" lines={['メールでアカウント作成。VS Codeを使ってたなら設定もそのまま取り込める']} />
      <Step n={3} title="フォルダを開く" lines={['「ファイル → フォルダを開く」で、作りたいものの置き場所を開く']} />
      <Step
        n={4}
        title="指示を出す（ショートカット）"
        lines={[
          { code: 'Ctrl/⌘ + K : その場でコード編集' },
          { code: 'Ctrl/⌘ + L : チャットで相談' },
          { code: 'Ctrl/⌘ + I : エージェント(複数ファイル)' },
        ]}
      />
    </div>
  ),
  mcp: (uid) => (
    <svg className="dgm__svg" viewBox="0 0 320 180" role="img" aria-label="MCPの図">
      <ArrowDefs uid={uid} />
      <rect x="120" y="70" width="80" height="40" rx="6" fill="var(--accent)" />
      <text x="160" y="95" textAnchor="middle" fontSize="14" fontWeight="700" fill="#000">AI</text>
      {[
        { x: 20, y: 16, t: '📅 カレンダー' },
        { x: 210, y: 16, t: '✉ メール' },
        { x: 20, y: 132, t: '🗄 DB' },
        { x: 210, y: 132, t: '🔧 ツール' },
      ].map((n, i) => (
        <g key={i}>
          <rect x={n.x} y={n.y} width="90" height="32" rx="5" fill="#1a1a24" stroke="var(--accent)" strokeOpacity="0.5" />
          <text x={n.x + 45} y={n.y + 20} textAnchor="middle" fontSize="11" fill="#f5f5f7">
            {n.t}
          </text>
        </g>
      ))}
      <g stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#mk-${uid})`} opacity="0.8" fill="none">
        <path d="M120 84 L112 32" />
        <path d="M200 84 L210 32" />
        <path d="M120 100 L112 148" />
        <path d="M200 100 L210 148" />
      </g>
      <text x="160" y="130" textAnchor="middle" fontSize="10" fill="var(--ink-faint)">
        MCP＝共通の差し込み口
      </text>
    </svg>
  ),
  git: (uid) => (
    <svg className="dgm__svg" viewBox="0 0 320 120" role="img" aria-label="Gitの図">
      <ArrowDefs uid={uid} />
      <line x1="20" y1="60" x2="300" y2="60" stroke="var(--accent)" strokeWidth="2" opacity="0.5" />
      {[40, 110, 180, 250].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="60" r="9" fill={i === 3 ? 'var(--accent)' : '#1a1a24'} stroke="var(--accent)" strokeWidth="2" />
          <text x={x} y="88" textAnchor="middle" fontSize="10" fill="var(--ink-dim)">
            記録{i + 1}
          </text>
        </g>
      ))}
      <text x="160" y="28" textAnchor="middle" fontSize="11" fill="#f5f5f7">
        コミット＝セーブ地点
      </text>
      <path d="M250 45 Q200 18 150 45" fill="none" stroke="var(--gold)" strokeWidth="2" markerEnd={`url(#mk-${uid})`} />
      <text x="200" y="14" textAnchor="middle" fontSize="9" fill="var(--gold)">
        いつでも戻れる
      </text>
    </svg>
  ),
  cloud: () => (
    <svg className="dgm__svg" viewBox="0 0 320 150" role="img" aria-label="クラウドの図">
      {[
        { x: 10, w: 92, t: 'GAS', s: '手軽・小規模', c: '#2a2a34' },
        { x: 114, w: 92, t: 'GCP', s: 'Vertex/BQ/Run', c: '#3a1530' },
        { x: 218, w: 92, t: 'Azure OpenAI', s: '企業で安全に', c: '#10243a' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="40" width={b.w} height="70" rx="8" fill={b.c} stroke="var(--accent)" strokeOpacity="0.5" />
          <text x={b.x + b.w / 2} y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f5f5f7">
            {b.t}
          </text>
          <text x={b.x + b.w / 2} y="94" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">
            {b.s}
          </text>
        </g>
      ))}
      <text x="160" y="22" textAnchor="middle" fontSize="11" fill="#f5f5f7">
        波の大きさで道具を選ぶ
      </text>
      <text x="160" y="130" textAnchor="middle" fontSize="10" fill="var(--ink-faint)">
        小 ────────────▶ 大・安全
      </text>
    </svg>
  ),
  vary: (uid) => (
    <svg className="dgm__svg" viewBox="0 0 320 170" role="img" aria-label="結果は毎回違うの図">
      <ArrowDefs uid={uid} />
      <rect x="16" y="62" width="96" height="44" rx="6" fill="var(--accent)" />
      <text x="64" y="80" textAnchor="middle" fontSize="11" fontWeight="700" fill="#000">
        同じ頼み
      </text>
      <text x="64" y="96" textAnchor="middle" fontSize="9" fill="#000">
        “ページ作って”
      </text>
      {[
        { y: 16, t: '結果A' },
        { y: 68, t: '結果B' },
        { y: 120, t: '結果C' },
      ].map((b, i) => (
        <g key={i}>
          <rect x="210" y={b.y} width="94" height="34" rx="5" fill="#1a1a24" stroke="var(--accent)" strokeOpacity="0.5" />
          <text x="257" y={b.y + 21} textAnchor="middle" fontSize="11" fill="#f5f5f7">
            {b.t}（違う）
          </text>
          <path d={`M114 84 L210 ${b.y + 17}`} stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#mk-${uid})`} opacity="0.75" fill="none" />
        </g>
      ))}
      <text x="160" y="160" textAnchor="middle" fontSize="10" fill="var(--ink-faint)">
        毎回・人によって違う → 返りを見て“対応”を変える
      </text>
    </svg>
  ),
  models: () => (
    <svg className="dgm__svg" viewBox="0 0 320 150" role="img" aria-label="モデルの使い分けの図">
      {[
        { x: 10, t: 'Opus', s: '深い思考・最高性能', c: '#3a1530' },
        { x: 114, t: 'Sonnet', s: 'バランス・速い', c: '#2a2238' },
        { x: 218, t: 'Haiku', s: '高速・軽量・安い', c: '#10243a' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="42" width="92" height="68" rx="8" fill={b.c} stroke="var(--accent)" strokeOpacity="0.5" />
          <text x={b.x + 46} y="74" textAnchor="middle" fontSize="13" fontWeight="700" fill="#f5f5f7">
            {b.t}
          </text>
          <text x={b.x + 46} y="93" textAnchor="middle" fontSize="8.5" fill="var(--ink-faint)">
            {b.s}
          </text>
        </g>
      ))}
      <text x="160" y="24" textAnchor="middle" fontSize="11" fill="#f5f5f7">
        用途でモデルを使い分ける
      </text>
      <text x="160" y="132" textAnchor="middle" fontSize="9.5" fill="var(--ink-faint)">
        種類は増え続ける。重い時はOpus、速さ重視はHaiku
      </text>
    </svg>
  ),
  'rpa-flow': (uid) => (
    <svg className="dgm__svg" viewBox="0 0 320 130" role="img" aria-label="自動化の流れの図">
      <ArrowDefs uid={uid} />
      <text x="160" y="18" textAnchor="middle" fontSize="11" fill="#f5f5f7">
        人の手順を台本にして、機械に代行させる
      </text>
      {[
        { x: 8, t: '毎朝の', t2: '手作業', c: '#2a2a34' },
        { x: 116, t: 'Playwright', t2: 'の台本に', c: '#1a1422' },
        { x: 224, t: '自動で', t2: '実行', c: '#3a1530' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="38" width="88" height="46" rx="5" fill={b.c} stroke="var(--accent)" strokeOpacity="0.5" />
          <text x={b.x + 44} y="60" textAnchor="middle" fontSize="11" fill="#f5f5f7">{b.t}</text>
          <text x={b.x + 44} y="76" textAnchor="middle" fontSize="11" fill="#f5f5f7">{b.t2}</text>
          {i < 2 && (
            <path d={`M${b.x + 88} 61 L${b.x + 116} 61`} stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#mk-${uid})`} />
          )}
        </g>
      ))}
      <text x="160" y="108" textAnchor="middle" fontSize="9.5" fill="var(--ink-faint)">
        一度書けば、寝ている間に毎朝終わっている
      </text>
    </svg>
  ),
  'ship-flow': (uid) => (
    <svg className="dgm__svg" viewBox="0 0 320 130" role="img" aria-label="配布の流れの図">
      <ArrowDefs uid={uid} />
      <text x="160" y="18" textAnchor="middle" fontSize="11" fill="#f5f5f7">
        作る → 配れる形に → 世に出す → 使われる
      </text>
      {[
        { x: 4, t: '作る', s: 'Electron' },
        { x: 84, t: 'EXEに', s: 'batch' },
        { x: 164, t: '公開', s: 'Pages' },
        { x: 244, t: '使われる', s: '🎉' },
      ].map((b, i) => (
        <g key={i}>
          <rect x={b.x} y="40" width="68" height="44" rx="5" fill="#16131d" stroke="var(--accent)" strokeOpacity="0.5" />
          <text x={b.x + 34} y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f5f5f7">{b.t}</text>
          <text x={b.x + 34} y="77" textAnchor="middle" fontSize="8.5" fill="var(--ink-faint)">{b.s}</text>
          {i < 3 && (
            <path d={`M${b.x + 68} 62 L${b.x + 80} 62`} stroke="var(--accent)" strokeWidth="2" markerEnd={`url(#mk-${uid})`} />
          )}
        </g>
      ))}
      <text x="160" y="108" textAnchor="middle" fontSize="9.5" fill="var(--ink-faint)">
        作って終わりじゃない。届けて初めて価値になる
      </text>
    </svg>
  ),
  'web-parts': () => (
    <svg className="dgm__svg" viewBox="0 0 320 160" role="img" aria-label="Webページの3部品の図">
      <text x="160" y="18" textAnchor="middle" fontSize="11" fill="#f5f5f7">
        Webページは3つの部品でできている
      </text>
      {/* HTML = 骨組み（ワイヤーフレーム） */}
      <g>
        <rect x="14" y="34" width="90" height="86" rx="4" fill="none" stroke="#888" strokeWidth="2" strokeDasharray="4 3" />
        <rect x="24" y="44" width="70" height="12" fill="none" stroke="#888" strokeWidth="1.5" />
        <rect x="24" y="62" width="70" height="30" fill="none" stroke="#888" strokeWidth="1.5" />
        <rect x="24" y="98" width="40" height="14" fill="none" stroke="#888" strokeWidth="1.5" />
        <text x="59" y="135" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f5f5f7">HTML</text>
        <text x="59" y="150" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">骨組み</text>
      </g>
      <text x="116" y="80" textAnchor="middle" fontSize="16" fill="var(--ink-faint)">＋</text>
      {/* CSS = 見た目（色がつく） */}
      <g>
        <rect x="130" y="34" width="90" height="86" rx="4" fill="#1a1422" stroke="var(--accent)" strokeWidth="2" />
        <rect x="140" y="44" width="70" height="12" rx="2" fill="var(--accent)" opacity="0.8" />
        <rect x="140" y="62" width="70" height="30" rx="3" fill="#2a2238" />
        <rect x="140" y="98" width="40" height="14" rx="7" fill="var(--accent)" />
        <text x="175" y="135" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f5f5f7">CSS</text>
        <text x="175" y="150" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">見た目</text>
      </g>
      <text x="232" y="80" textAnchor="middle" fontSize="16" fill="var(--ink-faint)">＋</text>
      {/* JS = 動き（押すと反応） */}
      <g>
        <rect x="246" y="34" width="60" height="86" rx="4" fill="#10182a" stroke="#00e5ff" strokeWidth="2" />
        <rect x="256" y="74" width="40" height="16" rx="8" fill="#00e5ff" />
        <text x="276" y="86" textAnchor="middle" fontSize="8" fontWeight="700" fill="#000">押す</text>
        <path d="M276 60 l4 8 l-8 0 z" fill="#ffce3a" />
        <text x="276" y="135" textAnchor="middle" fontSize="10" fontWeight="700" fill="#f5f5f7">JS</text>
        <text x="276" y="150" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">動き</text>
      </g>
    </svg>
  ),
  delegate: () => (
    <svg className="dgm__svg" viewBox="0 0 320 160" role="img" aria-label="任せる量の図">
      <text x="80" y="20" textAnchor="middle" fontSize="11" fill="var(--ink-faint)">
        自分で抱える
      </text>
      <text x="240" y="20" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--accent)">
        強気で任せる
      </text>
      {/* 左: 自分のタスク山盛り */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={36 + (i % 2) * 50} y={36 + Math.floor(i / 2) * 26} width="44" height="18" rx="3" fill="#2a2a34" stroke="#444" />
      ))}
      <text x="80" y="150" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">
        手数が多い・疲れる
      </text>
      {/* 右: AIに任せて自分は少し */}
      <rect x="196" y="36" width="96" height="70" rx="6" fill="var(--accent)" opacity="0.85" />
      <text x="244" y="68" textAnchor="middle" fontSize="11" fontWeight="700" fill="#000">
        AIがまとめて実行
      </text>
      <text x="244" y="84" textAnchor="middle" fontSize="9" fill="#000">
        （大きく任せる）
      </text>
      <rect x="220" y="112" width="48" height="16" rx="3" fill="#2a2a34" stroke="#444" />
      <text x="244" y="150" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">
        自分の手数は最小
      </text>
    </svg>
  ),
};
