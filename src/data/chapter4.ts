import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第4章「道具をつなぐ ─ 孤立を超えて」 — MCP / knowledge-work-plugins
   章ボス: 孤立の壁「サイロ」── 道具同士が断絶した壁。
   ========================================================================= */

export function buildChapter4(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c4s1',
    index: 0,
    title: '孤立の壁',
    subtitle: 'AIに道具を',
    scene: 'guild',
    intro: [
      { narration: true, text: '自動化で手数は増えた。だが気づく――相棒AIが触れられる“道具”は、まだほんの一部しかない。' },
      { narration: true, text: '高くそびえる壁。向こう側のカレンダーも、メールも、データも、AIの手は届かない。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'これが「サイロ」。道具と道具を断絶させる壁だ。AIがいくら賢くても、道具に触れなければ“話すだけ”で終わる。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '……ねえ。最初のきみは「何から始めればいいか分からない」って言ってた。それが今や、自動化までやってのけた。正直、ぼくは少し誇らしいよ。',
          '……なあ。最初のアンタは「何から始めりゃいいか分からん」って顔してた。それが今や自動化までやってのける。…ちょっと誇らしいぜ、正直。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'で、次の壁を越える鍵は「MCP」。ぼくのようなAIに、カレンダーやメールやデータベースといった“道具”をつなぐ共通の差し込み口だ。繋がれば、ぼくは「やる」AIになる。',
          'で、次の壁を越える鍵が「MCP」。アタシみたいなAIに、カレンダーやメールやデータベース(DB)っていう“道具”を挿す共通の差し込み口だ。繋がりゃ、アタシは「実行する」側になる。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── MCPの正体',
      diagram: 'mcp',
      goal: 'MCPでできることとして、いちばん正しいものを選ぼう。',
      hint: 'MCP＝AIと“外部の道具”をつなぐ共通の仕組み。AIが道具を操作できるようになる。',
      learn: 'MCPはAIと道具をつなぐ共通規格。繋ぐとAIは「話す」だけでなく「やる」に変わる。',
      question: 'MCPで、何ができる？',
      options: [
        {
          id: 'a',
          text: 'AIにカレンダーやメール等の道具を接続し、読んだり操作させたりできる。',
          correct: true,
          feedback: '正解。MCPはAIと外部ツールをつなぐ共通の差し込み口。AIが実務の道具を扱えるようになる。',
        },
        {
          id: 'b',
          text: 'AIの文章を、ただ少し速くするだけ。',
          correct: false,
          feedback: '速度の話ではない。MCPは“道具との接続”を担う仕組み。',
        },
        {
          id: 'c',
          text: 'AIの記憶を消して、何も覚えさせない。',
          correct: false,
          feedback: '逆方向。MCPは能力を“足す”もの。記憶を消すものではない。',
        },
      ],
      successResponse:
        'そうだ ── MCPは、AIと道具をつなぐ共通ポート。これさえあれば、ぼくはカレンダーもメールも触れる。壁に、最初の穴が空いた。',
      artifact: { title: 'mcp.json', body: ['接続できる道具:', '・カレンダー / メール / DB …'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '繋ぐ先を選べば、ぼくはきみの実務に手を出せる。次は“どれを繋ぐか”だ。',
      },
    ],
  };

  const s2: Stage = {
    id: 'c4s2',
    index: 1,
    title: '実務の差し込み口',
    subtitle: '何を繋ぐ？',
    scene: 'guild',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '世の中には、実務向けに整えられた“プラグイン集”がある。たとえば Anthropic の knowledge-work-plugins。よく使う業務ツールをAIに繋ぐ部品が揃っている。',
          '実務用に整った“プラグイン集”もある。Anthropic の knowledge-work-plugins とかな。業務ツールをAIに繋ぐ部品の宝庫だ。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '闇雲に繋ぐな。効くところから繋げ。' },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── まず繋ぐ道具',
      goal: '業務でまず繋ぐと効果が大きい道具はどれ？',
      hint: '「毎日使う」「手間が大きい」業務ツールほど、繋いだ効果が大きい。',
      learn: 'よく使う業務ツールをAIに繋ぐと、AIが実務を“代わりにやる”ようになる。',
      question: 'まず繋ぐと効くのは？',
      options: [
        {
          id: 'a',
          text: '毎日見るスケジュールと、社内のドキュメント置き場。',
          correct: true,
          feedback: '好判断。毎日触れる中核ツールを繋ぐと、AIが予定調整や資料探しを肩代わりできる。',
        },
        {
          id: 'b',
          text: '一年に一度しか開かない、誰も使わないツール。',
          correct: false,
          feedback: '使用頻度が低いと、繋いでも効果が薄い。まずは日常の中核から。',
        },
        {
          id: 'c',
          text: 'ゲームのスコアボード（業務とは無関係）。',
          correct: false,
          feedback: '業務に関係しない道具は後回し。実務に効くものを優先しよう。',
        },
      ],
      successResponse:
        'スケジュールと社内ドキュメントを接続対象に決めた。ここを繋げば、ぼくは「来週空いてる？」にも「あの資料どこ？」にも、自分で答えに行ける。',
      artifact: { title: 'mcp.json', body: ['接続: 📅 カレンダー', '接続: 📁 ドキュメント'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '道具が決まった。あとは実際に繋ぐだけ。きみの言葉で頼んでくれ。',
      },
    ],
  };

  const s3: Stage = {
    id: 'c4s3',
    index: 2,
    title: '壁を越える',
    subtitle: '繋いで動かす',
    scene: 'cyber',
    intro: [
      { narration: true, text: 'サイロの壁が最後の抵抗を見せる。「道具など、繋がりはせぬ」と軋む。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '今度はきみが頼む番だ。「カレンダーをMCPで繋いで、予定を読めるようにして」── そんな風に、繋ぎたい道具と目的を言葉にして。',
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 道具を接続せよ',
      goal: '自分のAIにカレンダーをMCPで接続し、予定を読めるようにするよう、自分の言葉で頼もう。',
      hint: '“カレンダーをMCPで繋ぐ/接続” ＋ “何ができるようにしたいか（予定を読む等）” を伝えよう。',
      learn: '道具を繋げばAIは「話す」だけでなく「やる」になる。目的を添えて接続を頼む。',
      placeholder: '例）私のGoogleカレンダーをMCPで繋いで、来週の予定を読めるようにして。空き時間も教えられるように。',
      keywords: ['mcp', 'つな', '繋', '接続', 'ツール', 'カレンダー', '連携', 'プラグイン', '予定', '読'],
      minKeywords: 2,
      sampleAnswer: '私のカレンダーをMCPで接続して、来週の予定を読めるようにして。空き時間も答えられるように。',
      successResponse:
        'カレンダーをMCPで接続したよ。試しに来週を見たら、水曜の午後が空いている。もう「予定どう？」に、ぼく自身が答えに行ける。サイロの壁が崩れ落ちた。',
      artifact: { title: 'mcp.json', body: ['✓ カレンダー接続 完了', '✓ 予定の読み取り 成功'], fixed: true },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やった。これでぼくは、きみの道具を使いこなす相棒だ。孤立は終わり。AIは「話す」から「やる」へ。',
          'やったな。これでアタシはアンタの道具を握る相棒だ。孤立は終わり。AIは「話す」から「やる」へ進化した。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '道具を束ねたか。…OVERSEER は、あらゆる道具を独占しようとする。お前の力、いよいよ試されるぞ。',
      },
    ],
  };

  return {
    id: 'ch4',
    index: 3,
    title: '第4章',
    subtitle: '道具をつなぐ ── 孤立を超えて',
    recap: 'Playwrightで反復作業を自動化し、「トイル」を断ち切った。',
    keyTerms: ['mcp', 'plugin', 'api', 'database'],
    scene: 'guild',
    boss: { name: 'サイロ', title: '孤立の壁', blurb: '道具と道具を断絶させる壁。繋ぐ術を持たぬAIを“話すだけ”に閉じ込める。' },
    stages: [s1, s2, s3],
  };
}
