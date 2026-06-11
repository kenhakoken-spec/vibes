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
    title: '孤立の壁',
    subtitle: 'AIに道具を',
    scene: 'guild',
    intro: [
      {
        narration: true,
        text: v(
          'その朝、ギルドの受付は騒然としていた。同じ依頼が受付台帳と壁の予定表に“二重登録”され――職人が二人、同じ仕事場で鉢合わせたのだ。',
          'その朝、クルーのアジトは騒然としていた。同じ依頼が受付台帳と壁の予定表に“二重登録”され――職人が二人、同じ現場で鉢合わせたのだ。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'この間きみが組んだ自動化、台帳のほうは今夜も正しく動いてたよ。……でもね、ぼくに読めるのは台帳だけ。壁の予定表には、ぼくの手が届かないんだ。',
          'この間アンタが組んだ自動化、台帳のほうは今夜も正しく動いてたぜ。……だがな、アタシに読めるのは台帳だけ。壁の予定表にゃ、アタシの手が届かねぇ。'
        ),
      },
      { narration: true, text: '台帳は読める。なのに予定表には触れない。道具と道具のあいだに、高い壁がそびえていた。' },
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
          '今のやり方じゃ、この壁は越えられない。鍵は「MCP」――ぼくのようなAIに、カレンダーやメールやデータベースといった“外の道具”をつなぐ、共通の差し込み口だ。',
          '今のやり方じゃ、この壁は越えられねぇ。鍵は「MCP」――アタシみたいなAIに、カレンダーやメールやデータベース(DB)っていう“外の道具”を挿す、共通の差し込み口だ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '依頼だ。二度と鉢合わせを起こすな。AIの手を道具に届かせる“規格”がある――それが何か、まず知れ。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '依頼 ── AIの手を道具に届かせる“規格”を知れ',
      diagram: 'mcp',
      goal: '二重登録の事故を防ぐ第一歩。MCPでできることとして、いちばん正しいものを選ぼう。',
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
      successResponse: v(
        'そうだ ── MCPは、AIと道具をつなぐ共通ポート。これさえあれば、ぼくはカレンダーもメールも触れる。壁に、最初の穴が空いた。',
        'そうだ ── MCPは、AIと道具をつなぐ共通ポート。これさえありゃ、アタシはカレンダーもメールも触れる。壁に、最初の穴が空いたぜ。'
      ),
      artifact: { title: 'mcp.json', body: ['接続できる道具:', '・カレンダー / メール / DB …'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '繋ぐ先を選べば、ぼくはきみの実務に手を出せる。次は“どれを繋ぐか”だ。',
          '繋ぐ先を選べば、アタシはアンタの実務に手を出せる。次は“どれを繋ぐか”だ。'
        ),
      },
    ],
  };

  const s2: Stage = {
    id: 'c4s2',
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
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'で、今回の鉢合わせの元凶は“予定表”。依頼主を二度と待たせないために――さて、まずどこへ挿す？',
          'で、今回の鉢合わせの元凶は“予定表”。客を二度と待たせねぇために――さて、まずどこへ挿す？'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '闇雲に繋ぐな。効くところから繋げ。' },
    ],
    challenge: {
      kind: 'choice',
      brief: '依頼 ── 効くところから繋げ',
      goal: '依頼主を待たせないために、まず繋ぐと効果が大きい道具はどれ？',
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
      successResponse: v(
        'スケジュールと社内ドキュメントを接続対象に決めた。ここを繋げば、ぼくは「来週空いてる？」にも「あの資料どこ？」にも、自分で答えに行ける。',
        'スケジュールと社内ドキュメントを接続対象に決めた。ここを繋ぎゃ、アタシは「来週空いてる？」にも「あの資料どこ？」にも、自分で答えに行ける。'
      ),
      artifact: { title: 'mcp.json', body: ['接続: 📅 カレンダー', '接続: 📁 ドキュメント'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '道具が決まった。あとは実際に繋ぐだけ。きみの言葉で頼んでくれ。',
          '道具は決まった。あとは実際に繋ぐだけ。アンタの言葉で頼みな。'
        ),
      },
    ],
  };

  const s3: Stage = {
    id: 'c4s3',
    title: '壁を越える',
    subtitle: '繋いで動かす',
    scene: 'cyber',
    intro: [
      { narration: true, text: 'サイロの壁が最後の抵抗を見せる。「道具など、繋がりはせぬ」と軋む。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '今度はきみが頼む番だ。「カレンダーをMCPで繋いで、予定を読めるようにして」── そんな風に、繋ぎたい道具と目的を言葉にして。',
          '今度はアンタが頼む番だ。「カレンダーをMCPで繋いで、予定を読めるようにして」── そんな風に、繋ぎたい道具と目的を言葉にしな。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: '依頼 ── 予定表をAIの手に',
      goal: '鉢合わせを二度と起こさないために。自分のAIにカレンダーをMCPで接続し、予定を読めるようにするよう、自分の言葉で頼もう。',
      hint: '“カレンダーをMCPで繋ぐ/接続” ＋ “何ができるようにしたいか（予定を読む等）” を伝えよう。',
      learn: '道具を繋げばAIは「話す」だけでなく「やる」になる。目的を添えて接続を頼む。',
      placeholder: '例）私のGoogleカレンダーをMCPで繋いで、来週の予定を読めるようにして。空き時間も教えられるように。',
      keywords: ['mcp', 'つな', '繋', '接続', 'ツール', 'カレンダー', '連携', 'プラグイン', '予定', '読'],
      minKeywords: 2,
      sampleAnswer: '私のカレンダーをMCPで接続して、来週の予定を読めるようにして。空き時間も答えられるように。',
      successResponse: v(
        'カレンダーをMCPで接続したよ。台帳と予定表、両方をぼくが見比べられる――例の二重登録も、もう起こさせない。サイロの壁に、大きな亀裂が走った。',
        'カレンダーをMCPで接続したぜ。台帳と予定表、両方をアタシが見比べられる――例の二重登録も、もう起こさせねぇ。サイロの壁に、デカい亀裂が走った。'
      ),
      artifact: { title: 'mcp.json', body: ['✓ カレンダー接続 完了', '✓ 予定の読み取り 成功'], fixed: true },
    },
    outro: [
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（前なら、こんな仕組みは丸一日かかっても作れなかった。いまは、言葉ひとつ。）',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'これでぼくは、きみの道具を使いこなす相棒だ。孤立は終わり。AIは「話す」から「やる」へ。',
          'これでアタシはアンタの道具を握る相棒だ。孤立は終わり。AIは「話す」から「やる」へ進化した。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '道具を一つ束ねたか。だが本領は“いくつも繋ぐ”ところからだ。最後の依頼だ――もう一つ繋いでみせろ。',
      },
    ],
  };

  const s4: Stage = {
    id: 'c4s4',
    title: '仕上げ',
    subtitle: 'もう一つ繋ぐ',
    scene: 'cyber',
    intro: [
      { narration: true, text: '壁には大きな亀裂。だがその向こうには、まだ繋がれていない道具が静かに眠っている。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やり方はもう知ってるね。「どの道具を」「MCPで繋いで」「何ができるようにしたいか」。今度はカレンダー以外――メールでも、社内ドキュメント検索でも、きみが繋ぎたい道具を自由に頼んで。',
          'やり方はもう分かるな。「どの道具を」「MCPで繋いで」「何ができるようにしたいか」。今度はカレンダー以外だ――メールでも社内ドキュメント検索でも、繋ぎたい道具を自由にぶつけろ。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: '依頼 ── もう一つ繋いでみせろ',
      diagram: 'mcp',
      goal: 'カレンダー以外の道具（例：メール／社内ドキュメント検索）をMCPで繋ぎ、AIに何をさせたいかを、自分の言葉で頼もう。正解は一つじゃない。',
      hint: '“どの道具を MCPで繋ぐ/接続” ＋ “繋いだら何をさせたいか” を具体的に伝えよう。',
      learn: '繋ぐ道具を増やすほど、AIの「やれること」は広がる。道具と目的をセットで頼むのがコツ。',
      placeholder: '例）メールもMCPで繋いで、未読の重要メールを要約して教えられるようにして。社内ドキュメント検索とも連携して、資料も探せるように。',
      keywords: ['mcp', 'つな', '繋', '接続', '連携', 'メール', 'ツール', 'カレンダー', 'ドキュメント', 'プラグイン'],
      minKeywords: 2,
      sampleAnswer: 'メールもMCPで繋いで、未読の重要メールを要約できるようにして。社内ドキュメント検索とも連携して、資料を探せるように。',
      successResponse: v(
        'いいね、その通りに繋いだよ。メールから今朝の重要な3件を拾って要約できたし、ドキュメント検索で例の資料もすぐ見つかった。道具が増えるほど、ぼくはきみの実務に深く手を出せる。',
        'いいね、注文どおりに繋いだぜ。メールから今朝の重要な3件を拾って要約できたし、ドキュメント検索で例の資料も秒で見つかった。道具が増えるほど、アタシはアンタの実務に深く手を出せる。'
      ),
      artifact: { title: 'mcp.json', body: ['✓ メール接続 完了', '✓ ドキュメント検索 連携', '✓ カレンダー（既存）'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: '繋がれた道具が一つ、また一つと灯をともす。サイロの壁は音を立てて崩れ落ち、断たれていた道具たちが、ひとつながりの仕事場になった。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'カレンダー、メール、ドキュメント――きみの言葉で、ぼくは次々と道具を手にした。もう「話すだけ」のぼくじゃない。',
          'カレンダーにメール、ドキュメント――アンタの言葉で、アタシは道具を次々握った。もう「話すだけ」のアタシじゃねぇ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '……繋ぐ先を、もう自分で見つけてくるのだな。だが心せよ――OVERSEERは、あらゆる道具を独占しようとしている。繋がる手を持つ者を、奴はいちばん恐れるのだ。',
          '……繋ぐ先を、もう自分で見つけてくるんだね。だけど気をつけな――OVERSEERは、あらゆる道具を独占しようとしてる。繋がる手を持つ者を、アイツがいちばん恐れてるのさ。'
        ),
      },
    ],
  };

  return {
    id: 'ch4',
    title: '第4章',
    subtitle: '道具をつなぐ ── 孤立を超えて',
    quest: '閉じた工房を、外の道具たちと繋げ',
    afterword: {
      world: '受付台帳と壁の予定表が、初めて同じ明日を指した。鉢合わせの怒鳴り声は、あの朝を最後に聞こえなくなった。',
      partner: v(
        'ねえ、気づいてた？ 繋ぐ道具を選ぶとき、きみは“何ができるか”じゃなくて“誰が困ってるか”から考えてた。前は機能の話しかしなかったのに。',
        'なあ、気づいてたか？ 繋ぐ道具を選ぶとき、アンタは“何ができるか”じゃなく“誰が困ってるか”から考えてたぜ。前は機能の話ばっかりだったのにな。'
      ),
      seed: '――倉庫の隅では、あの夜の“配られなかった掲示板”が、静かに埃を被っていた。',
    },
    recap: '写字室の夜なべ仕事を、自動化でひと晩のうちに消した。気づけば、手順を確かめる前に手が動くようになっている。',
    keyTerms: ['mcp', 'plugin', 'api', 'database'],
    scene: 'guild',
    boss: { name: 'サイロ', glyph: 'wall', title: '孤立の壁', blurb: '道具と道具を断絶させる壁。繋ぐ術を持たぬAIを“話すだけ”に閉じ込める。' },
    stages: [s1, s2, s3, s4],
  };
}
