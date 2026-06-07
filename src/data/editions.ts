import type { Edition, EditionId } from '../types';

/* =========================================================================
   2つの編 — 世界観もキャラも別物。
   Claude編 = 静かで思慮深い相棒「クロード」。蒼を帯びた紅。
   Cursor編 = 鋭く高速な相棒「カーサ」。電光のシアン×紅。
   ========================================================================= */

export const EDITIONS: Record<EditionId, Edition> = {
  claude: {
    id: 'claude',
    label: 'CLAUDE 編',
    tagline: '思考する相棒と、コードに潜る。',
    description:
      '近未来。あらゆる開発が〈ギルド〉に集約された街。きみは新人エンジニアとして、思慮深いAI「クロード」と組み、依頼（クエスト）を一つずつ解いていく。焦らず、対話しながら、確かなものを作る道。',
    accent: '#ff2d4a',
    accent2: '#ff7a86',
    guildName: 'ARCANE CODE GUILD',
    techNote: 'Claude Code（ターミナルに棲むAIの相棒）を学ぶ',
    partner: {
      id: 'claude',
      name: 'クロード',
      role: '相棒AI / 思索する知性',
      portrait: 'claude',
      color: '#ff5c6e',
    },
    mentor: {
      id: 'mentor',
      name: '棟梁ザイン',
      role: 'ギルド棟梁',
      portrait: 'mentor',
      color: '#ffce3a',
    },
  },
  cursor: {
    id: 'cursor',
    label: 'CURSOR 編',
    tagline: '光速の相棒と、エディタを駆ける。',
    description:
      '同じ街、別の路地。きみは反逆の開発クルー「CURSORS」に拾われた。相棒AI「カーサ」は早口で容赦ないが、誰より速い。エディタの中を駆け抜けながら、手を動かして覚えていく道。',
    accent: '#00e5ff',
    accent2: '#6cf0ff',
    guildName: 'NEON CURSOR CREW',
    techNote: 'Cursor（AIが組み込まれたエディタの相棒）を学ぶ',
    partner: {
      id: 'cursor',
      name: 'カーサ',
      role: '相棒AI / エディタの住人',
      portrait: 'cursor',
      color: '#00e5ff',
    },
    mentor: {
      id: 'mentor',
      name: 'リーダー・ヴェイル',
      role: 'クルー首領',
      portrait: 'mentor',
      color: '#ffce3a',
    },
  },
};

export const HERO = {
  id: 'hero',
  name: 'きみ',
  role: '新人',
  portrait: 'hero' as const,
  color: '#f5f5f7',
};
