// 一時ハーネス: 立ち絵グリッド表示（pt-grid.html から読み込む。検証後に削除）
import { createRoot } from 'react-dom/client';
import { CharacterPortrait } from './components/CharacterPortrait';
import type { Expression, PortraitVariant } from './types';

const EXPRS: Expression[] = ['neutral', 'smile', 'serious', 'surprised', 'worried'];
const CHARS: { v: PortraitVariant; accent: string }[] = [
  { v: 'claude', accent: '#ff5c6e' },
  { v: 'cursor', accent: '#00e5ff' },
  { v: 'hero', accent: '#f5f5f7' },
  { v: 'mentor', accent: '#ffce3a' },
];

function Grid() {
  return (
    <>
      {CHARS.map((c) => (
        <div className="row" key={c.v}>
          {EXPRS.map((e) => (
            <div className="cell" key={e}>
              <span>
                {c.v}/{e}
              </span>
              <CharacterPortrait variant={c.v} accent={c.accent} expr={e} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Grid />);
