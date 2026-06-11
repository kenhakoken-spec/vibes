import type { ArtifactState, Edition } from '../types';

/* =========================================================================
   ムービー風オープニング「圧倒的な始まり」
   世界説明 → フードの実演者（正体は師、序章で回収）の圧倒的デモ3連発 → 動機づけ。
   バッジや力の説明はしない。「創ることをやめた世界」の提示は
   最終章S3「創る理由」への首尾呼応になる。
   ========================================================================= */

/** オープニングの1拍 */
export interface OpeningCut {
  kind: 'narration' | 'line' | 'demo' | 'title';
  text: string;
  /** shadow=フードの人物（正体は師、序章で回収） / hero=主人公の独白 */
  speaker?: 'shadow' | 'hero';
  /** demo: 打ち込む“一言” */
  command?: string;
  /** demo: 立ち上がる成果物 */
  artifact?: ArtifactState;
  /** 自動送りの保持時間（省略時 2800ms） */
  holdMs?: number;
}

/* ---- デモ3連発の成果物（両編共通。編色は CSS の accent が乗る） ------- */

const DEMO_GAME: ArtifactState = {
  kind: 'game',
  title: 'NEON_SHOOTER.exe',
  body: ['NEON SHOOTER', 'SCORE 12800'],
  fixed: true,
};

const DEMO_DASHBOARD: ArtifactState = {
  kind: 'dashboard',
  title: 'grid-watch ── 街区電力モニタ',
  body: ['稼働率|98.2%|+0.4', '消費電力|312kW|-2.1', '蓄電残量|76%|+5.0', '警報|0件|0'],
  fixed: true,
};

const DEMO_WEB: ArtifactState = {
  kind: 'web',
  title: 'midnight-guide',
  body: ['眠れない夜の、灯りの地図。'],
  hasButton: true,
  buttonLabel: 'いま開いてる店をさがす',
  toast: '今夜も 24 軒、営業中 ✓',
  fixed: true,
};

/** 編ごとのオープニング脚本を組み立てる */
export function buildOpening(edition: Edition): OpeningCut[] {
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  return [
    /* ---- 世界説明（3カット。最終章「創る理由」への首尾呼応の起点） ---- */
    {
      kind: 'narration',
      text: '――近未来。人々は、創ることをやめていた。',
    },
    {
      kind: 'narration',
      text: '管理者AI〈OVERSEER〉が、すべてを与えてくれる。完璧で、誰のためでもない“完成品”を。',
      holdMs: 3200,
    },
    {
      kind: 'narration',
      text: '自分の手で作るのは“非効率”。そう教えられて、街は灰色になった。',
    },
    /* ---- 主人公の独白 ---- */
    {
      kind: 'line',
      speaker: 'hero',
      text: v(
        '（……また今日も、何も作らずに一日が終わる。）',
        '（……また今日も、言われた通りのことだけして終わった。）'
      ),
    },
    /* ---- 遭遇 ---- */
    {
      kind: 'narration',
      text: v(
        'その夜。帰り道の裏路地で、きみは廃ビルの窓に奇妙な灯りを見た。フードの男が、黒い画面に向かって――囁いている。',
        'その夜。終電を逃した地下道で、シアンの光が壁を裂いた。フードの女が、宙に浮くエディタへ――一言、叩き込む。'
      ),
      holdMs: 3600,
    },
    /* ---- 圧倒的デモ3連発 ---- */
    {
      kind: 'demo',
      speaker: 'shadow',
      command: v(
        '相棒、ネオンの撃ち合いができるゲームを。操作は指一本で。',
        '相棒、ネオンの撃ち合い、一丁。指一本で遊べるやつだ。'
      ),
      artifact: DEMO_GAME,
      text: '一言で、ゲームが生まれた。コードは、一行も見えなかった。',
      holdMs: 3400,
    },
    {
      kind: 'demo',
      speaker: 'shadow',
      command: v(
        '次だ。この街区の電力を、ひと目で見張れる盤面を。',
        '次。この街区の電力、ひと目で見張れる盤面にしな。'
      ),
      artifact: DEMO_DASHBOARD,
      text: v(
        '言葉が、次々と“形”になっていく。',
        '言葉が、次々と“形”になる。'
      ),
      holdMs: 3400,
    },
    {
      kind: 'demo',
      speaker: 'shadow',
      command: v(
        '最後。眠れない奴らのための、朝まで開いてる店の案内所を。',
        'ラスト。朝まで開いてる店の案内所。眠れない連中が待ってる。'
      ),
      artifact: DEMO_WEB,
      text: v(
        'OVERSEERの完成品とは違う――誰かの顔を思い浮かべて作られた、温度のあるもの。',
        'OVERSEERの完成品とは違う――誰かのために殴り書きされた、熱のあるもの。'
      ),
      holdMs: 3600,
    },
    /* ---- 動機づけ ---- */
    {
      kind: 'line',
      speaker: 'hero',
      text: v(
        '（創ってる……この時代に、自分の手で。しかも、あんな速さで。――知りたい。あの力の正体を。）',
        '（あの力が、欲しい。）'
      ),
      holdMs: 3400,
    },
    {
      kind: 'narration',
      text: v(
        '男の消えた路地の奥。消えかけた看板が、緋色に瞬いた。',
        '女の消えた闇の先。スプレーで描かれたマークが、シアンに灯った。'
      ),
    },
    /* ---- タイトル ---- */
    {
      kind: 'title',
      text: v('――〈VIBE GUILD〉。', '――〈NEON CURSOR CREW〉。'),
      holdMs: 2200,
    },
  ];
}
