import { Fragment, type ReactNode } from 'react';
import { MATCH_INDEX } from '../data/glossary';
import { useGlossary } from '../store/glossaryStore';

/**
 * 本文中の専門用語を見つけて、タップで説明が開く赤点線リンクにする。
 * タイプライタ表示中の途中文字列を渡してもOK（途切れた語は単にマッチしない）。
 */
export function RichText({ text }: { text: string }) {
  const openTerm = useGlossary((s) => s.openTerm);
  const nodes: ReactNode[] = [];
  let buf = '';
  let key = 0;

  const flush = () => {
    if (buf) {
      nodes.push(<Fragment key={`t${key++}`}>{buf}</Fragment>);
      buf = '';
    }
  };

  for (let i = 0; i < text.length; ) {
    let hit: { word: string; id: string } | null = null;
    for (const entry of MATCH_INDEX) {
      const slice = text.substr(i, entry.word.length);
      if (slice.length === entry.word.length && slice.toLowerCase() === entry.word.toLowerCase()) {
        hit = entry;
        break;
      }
    }
    if (hit) {
      flush();
      const id = hit.id;
      const label = text.substr(i, hit.word.length);
      nodes.push(
        <button
          key={`g${key++}`}
          className="term"
          onClick={(e) => {
            e.stopPropagation();
            openTerm(id);
          }}
        >
          {label}
        </button>,
      );
      i += hit.word.length;
    } else {
      buf += text[i];
      i += 1;
    }
  }
  flush();

  return <>{nodes}</>;
}
