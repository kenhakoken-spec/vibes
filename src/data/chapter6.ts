import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第6章「雲の力 ─ 規模に立ち向かう」 — GAS / GCP(Vertex/BQ/Cloud Run) / Azure OpenAI
   章ボス: 無限の負荷「サージ」── 押し寄せる処理の津波。
   ========================================================================= */

export function buildChapter6(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c6s1',
    title: '無限の負荷',
    subtitle: '手軽な自動化',
    scene: 'sky',
    intro: [
      { narration: true, text: '作品を世に放った――その途端、世界中から人が殺到した。アクセス、依頼、データ。嬉しい悲鳴。だが。' },
      { narration: true, text: 'きみの一台のPCでは、もう到底さばけない。処理の津波が押し寄せる。「サージ」。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '自分のPC一台では限界がある。だが、まず小さく軽い波なら、手軽な道具で十分だ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'たとえば「GAS（Google Apps Script）」。スプレッドシートやGmailの中で、サーバーも用意せず手軽に自動処理を回せる。小さな波はこれで十分。',
          'たとえば「GAS（Google Apps Script）」。スプレッドシートやGmailの中で、サーバー無しでサッと自動処理を回せる。小波はこれで十分だ。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 手軽さで捌く',
      goal: '「スプレッドシートの集計を毎晩自動でやる」程度の小さな自動化。最初に選ぶと良いのは？',
      hint: 'サーバー構築不要で、Googleの中だけで完結する手軽さに注目。',
      learn: 'GASはGoogleの中（スプレッドシート/Gmail等）で、サーバー無しに手軽な自動化ができる。',
      question: 'まず何で捌く？',
      options: [
        {
          id: 'a',
          text: '大がかりなサーバーを一から構築して運用する。',
          correct: false,
          feedback: '小さな自動化には過剰。コストも手間も大きすぎる。まずは手軽な道具で。',
        },
        {
          id: 'b',
          text: 'GASで、スプレッドシート上の集計を毎晩自動実行する。',
          correct: true,
          feedback: '正解。サーバー不要・無料枠で完結。小さな反復にはGASがちょうどいい。',
        },
        {
          id: 'c',
          text: '毎晩、自分で手作業で集計し続ける。',
          correct: false,
          feedback: 'それでは波に飲まれる。手軽な自動化に任せて、人は別の仕事を。',
        },
      ],
      successResponse: v(
        'GASで毎晩の集計を自動化したよ。きみが眠っている間に、スプレッドシートが自分で更新される。小さな波は、もうきみを濡らさない。',
        'GASで毎晩の集計を自動化したぜ。アンタが寝てる間に、スプレッドシートが勝手に更新される。小さな波は、もうアンタを濡らさない。'
      ),
      artifact: { title: 'gas.js', body: ['毎晩 23:00 自動実行', '・シート集計 → 更新'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: 'でも、もっと大きな波が来る。データが膨れ、利用者が増えたら──次は本物の“雲（クラウド）”の出番だ。',
      },
    ],
  };

  const s2: Stage = {
    id: 'c6s2',
    title: '雲を選ぶ',
    subtitle: '規模に合う道具',
    scene: 'sky',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '大きな波には「GCP（Google Cloud）」。役割ごとに道具がある。AIを動かす Vertex AI、巨大なデータを一瞬で集計する BigQuery、常に動くサービスを置く Cloud Run。',
          '大波には「GCP」。役割で道具が分かれてる。AIを動かす Vertex AI、巨大データを一撃集計の BigQuery、常時稼働サービスの Cloud Run だ。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '道具を取り違えるな。波の“種類”に合わせて選べ。' },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 道具を当てる',
      diagram: 'cloud',
      goal: '「何億行ものログを、一瞬で集計したい」。GCPで最も適した道具は？',
      hint: '“巨大なデータの集計・分析”に特化した道具を選ぼう。',
      learn: 'GCPは用途別。Vertex AI=AI、BigQuery=巨大データ集計、Cloud Run=常時動くサービス。',
      question: '巨大データの集計には？',
      options: [
        {
          id: 'a',
          text: 'BigQuery（巨大データを高速に集計・分析する）。',
          correct: true,
          feedback: '正解。何億行でも一瞬で集計できる、大規模データ分析の道具。波の“量”に強い。',
        },
        {
          id: 'b',
          text: 'Vertex AI（モデルを動かす）だけで全部やる。',
          correct: false,
          feedback: 'Vertex AIはAI向け。巨大データの集計そのものは BigQuery の得意分野。',
        },
        {
          id: 'c',
          text: '自分のノートPCのExcelで開いて集計する。',
          correct: false,
          feedback: '何億行はPCでは開けない。規模が違う。クラウドの集計基盤が要る。',
        },
      ],
      successResponse:
        'BigQuery に流し込んだら、何億行ものログが数秒で集計された。常時動かす部分は Cloud Run、AI処理は Vertex AI に。役割分担で、津波が捌けていく。',
      artifact: { title: 'gcp/', body: ['BigQuery: ログ集計', 'Cloud Run: 常時稼働API', 'Vertex AI: 推論'] },
    },
    outro: [
      { narration: true, text: 'サージの津波が、いくつもの水路に分かれ、勢いを失っていく。' },
    ],
  };

  const s3: Stage = {
    id: 'c6s3',
    title: '企業の盾',
    subtitle: '安全にAIを',
    scene: 'sky',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '会社で本気で使うなら、安全管理も要る。「Azure OpenAI（AOAI）」なら――これはGCPとは別のクラウド（MicrosoftのAzure）だけど――企業の管理下で、情報を守りながら高性能なAIを使える。クラウドに、AI付きのサービスを置こう。',
          '会社で本気で使うなら安全管理も要る。「Azure OpenAI（AOAI）」は企業の管理下で情報を守りつつ高性能AIを使える。クラウドにAI付きサービスを置くぞ。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '雲の上に、きみのサービスを立ち上げてみせろ。自分の言葉で。' },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 雲の上に立てる',
      goal: 'クラウド（GCPのCloud RunやAzure OpenAI等）に、AI付きの小さなサービスをデプロイ（公開）するよう、自分の言葉で頼もう。',
      hint: '“クラウドにデプロイ/公開” ＋ “AIで何をするサービスか” を伝えよう。',
      learn: 'クラウド（Cloud Run / Azure OpenAI 等）に置けば、AI付きサービスを規模に耐える形で動かせる。',
      placeholder: '例）問い合わせに自動で答えるAIサービスを、Cloud Run にデプロイして公開して。AIは Azure OpenAI を使って、社内情報は安全に扱って。',
      keywords: ['クラウド', 'デプロイ', '公開', 'cloud run', 'azure', 'aoai', 'vertex', 'サービス', 'ai', '稼働'],
      minKeywords: 2,
      sampleAnswer: '問い合わせに答えるAIサービスを Cloud Run にデプロイして公開して。AIは Azure OpenAI を使い、情報は安全に扱って。',
      successResponse: v(
        'クラウドにデプロイしたよ。Cloud Run が常時稼働し、Azure OpenAI が安全に応答する。利用者が増えても、雲が自動で受け止める。サージは、もうきみを飲み込めない。',
        'クラウドにデプロイしたぜ。Cloud Run が常時稼働し、Azure OpenAI が安全に応答する。利用者が増えても、雲が自動で受け止める。サージは、もうアンタを飲み込めない。'
      ),
      artifact: { title: 'cloud-run / AOAI', body: ['☁ 常時稼働サービス 公開', '🛡 企業管理のAI応答', '✓ 規模に耐える'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: 'サージの津波が、いくつもの水路に分かれて勢いを失い――やがて、引いていく。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やった。手軽なGASから、巨大なクラウドまで。波の大きさに合わせて道具を選べる。きみはもう、規模に飲まれない。',
          'やったな。手軽なGASから巨大クラウドまで。波のサイズで道具を選べる。もう規模に飲まれやしない。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'よくやった。だが“選べる”と“使いこなす”は別だ。最後に、もう一つ――自分の波を、自分の手で雲に乗せてみろ。',
      },
    ],
  };

  const s4: Stage = {
    id: 'c6s4',
    title: '仕上げ',
    subtitle: 'もう一つ雲に乗せる',
    scene: 'sky',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'もう一つ、雲に乗せたい処理があるはずだ。今日学んだ“波の大きさで道具を選ぶ”を、自分で使ってみせろ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やり方は同じだよ。軽い自動処理ならGAS、大量集計ならBigQuery、常時動くAIサービスならCloud Run＋Azure OpenAI。「何を」「どの規模で」雲に乗せたいか、自由に言葉にして。',
          'やり方は同じだ。軽い自動処理はGAS、大量集計はBigQuery、常時動くAIサービスはCloud Run＋Azure OpenAI。「何を」「どの規模で」雲に乗せたいか、自由にぶつけろ。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 規模に合わせて雲に乗せる',
      diagram: 'cloud',
      goal: 'もう一つの処理を、規模に合った道具で雲に乗せるよう、自分の言葉でAIに頼もう（例：軽い自動処理はGAS／大量集計はBigQuery／常時動くAIサービスはCloud Run＋Azure OpenAI）。正解は一つじゃない。',
      hint: '「何を」「どの規模で」やりたいか＋「どの道具に乗せるか」を具体的に。小さな波はGAS、大きな波はクラウドへ。',
      learn: '波の大きさで道具を選ぶ――規模に合わせて、GAS / BigQuery / Cloud Run などを自分で選べる。',
      placeholder: '例）毎朝の問い合わせ件数の集計は軽いからGASで自動化して。月次の全ログ分析はBigQueryに、常時動く要約AIはCloud Run＋Azure OpenAIで公開して。',
      keywords: ['クラウド', 'デプロイ', '公開', 'cloud run', 'gas', 'bigquery', 'azure', '自動', 'サービス', '稼働', '集計'],
      minKeywords: 2,
      sampleAnswer: '軽い件数集計はGASで自動化して。大量のログ分析はBigQueryに、常時動く要約AIサービスはCloud Run＋Azure OpenAIにデプロイして公開して。',
      successResponse: v(
        'いいね、その通りに乗せたよ。軽い波はGASがさばき、大きな波はBigQueryとCloud Runが受け止める。規模に合わせて道具を選ぶ――きみはもう、自分でそれができる。',
        'いいね、注文どおりに乗せたぜ。軽い波はGASがさばき、大きな波はBigQueryとCloud Runが受け止める。規模に合わせて道具を選ぶ――アンタはもう、自分でそれができる。'
      ),
      artifact: { title: 'cloud', body: ['⚙ 軽い自動処理 → GAS', '📊 大量集計 → BigQuery', '☁ 常時稼働AI → Cloud Run + AOAI'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: '小さな波も、大きな波も、それぞれの雲が受け止める。きみの作品は、もう世界のどんな規模にも応える。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'ここまで、ずっと一緒だったね。あいさつページ一枚から、世界に届く大きなサービスまで。……でも、大きくなったものほど、足元から崩れやすい。',
          'ここまでずっと一緒だったな。あいさつページ一枚から、世界に届くデカいサービスまで。……だが、大きくなったものほど足元から崩れやすいんだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '規模は手に入れた。だが――作るほどに、過去の成果が静かに崩れ始める。次は“壊れない仕組み”を学べ。',
      },
    ],
  };

  return {
    id: 'ch6',
    title: '第6章',
    subtitle: '雲の力 ── 規模に立ち向かう',
    power: '規模の力',
    recap: '作品を配布・公開し、世界へ届けられるようになった。',
    keyTerms: ['gas', 'gcp', 'bigquery', 'cloud-run', 'vertex-ai', 'aoai', 'cloud'],
    scene: 'sky',
    boss: { name: 'サージ', glyph: 'wave', title: '無限の負荷', blurb: '押し寄せる処理の津波。規模を捌く力を持たぬ者を、容赦なく飲み込む。' },
    stages: [s1, s2, s3, s4],
  };
}
