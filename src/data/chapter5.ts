import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第5章「世に放つ ─ 届ける技術」 — Electron / batch・EXE配布 / GitHub Pages
   章ボス: 届かぬ声「アンハード」── 誰にも使われない作品の亡霊。
   ========================================================================= */

export function buildChapter5(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c5s1',
    index: 0,
    title: '届かぬ声',
    subtitle: '道具を“アプリ”に',
    scene: 'guild',
    intro: [
      { narration: true, text: '道具を繋ぎ、AIは実務をこなせるようになった。だが――その成果は、まだきみの画面の中だけにある。' },
      { narration: true, text: '広場に、声なき亡霊が漂う。素晴らしい作品を抱えたまま、誰にも使われなかった者たち──「アンハード」。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'どれだけ良い道具も、相手が使えなければ無いのと同じだ。現場の人は、黒い画面やコマンドを嫌う。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '答えは「Electron」。きみがWebで覚えたHTMLやJavaScriptのまま、ふつうのデスクトップ業務アプリ（ダブルクリックで開く窓）を作れる。',
          '答えは「Electron」。Webで覚えたHTMLやJSのまんま、ダブルクリックで開くデスクトップ業務アプリにできる。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 誰でも使える形に',
      goal: '現場の人にも使ってもらうには、どの形が良い？',
      hint: '相手は非エンジニア。コマンド不要で、いつもの操作で開けるのが理想。',
      learn: 'Electronなら、Webの技術のまま“ダブルクリックで開く業務アプリ”にできる。',
      question: 'どう届ける？',
      options: [
        {
          id: 'a',
          text: '黒い画面でコマンドを打って起動してもらう。',
          correct: false,
          feedback: '非エンジニアにはハードルが高い。「使えない＝届かない」。',
        },
        {
          id: 'b',
          text: 'Electronで、ダブルクリックで開くデスクトップアプリにする。',
          correct: true,
          feedback: '正解。いつものアプリと同じ操作感。これなら現場の人も迷わず使える。',
        },
        {
          id: 'c',
          text: '使い方を口頭だけで説明して、本体は渡さない。',
          correct: false,
          feedback: '物が無ければ使えない。形にして“渡す”ことが大事。',
        },
      ],
      successResponse:
        'Webで作ったツールを、Electronでデスクトップアプリ化したよ。アイコンをダブルクリックすれば、もう窓が開く。亡霊が、ひとり顔を上げた。',
      artifact: { title: 'guild-tool.app', body: ['🖥 業務支援アプリ', 'ダブルクリックで起動'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: 'いい形になった。あとは、これを“配る”手段だね。',
      },
    ],
  };

  const s2: Stage = {
    id: 'c5s2',
    index: 1,
    title: '配り方',
    subtitle: 'EXEとして渡す',
    scene: 'cyber',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'アプリは、相手のPCで動く形にして渡す。Windowsなら EXE（実行ファイル）や、起動手順をまとめた batch（バッチ）。受け取った人は、それをクリックするだけ。',
          '相手のPCで動く形にして渡すんだ。Windowsなら EXE、起動をまとめた batch。受け取った側はクリックするだけでいい。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '渡し方ひとつで、使われるかどうかが決まる。' },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 配布の形',
      goal: '相手が迷わず使える配布の形はどれ？',
      hint: 'インストールや環境構築を相手にさせず、クリックで起動できる形が理想。',
      learn: 'EXEやbatchにまとめれば、受け取った人はクリックするだけで起動できる。',
      question: 'どう配る？',
      options: [
        {
          id: 'a',
          text: 'ソースコード一式を渡し、各自で環境構築してもらう。',
          correct: false,
          feedback: '相手に専門作業を強いる形。多くの人はここで脱落する。',
        },
        {
          id: 'b',
          text: 'EXE（または起動batch）にまとめ、クリックで起動できる形で渡す。',
          correct: true,
          feedback: '正解。受け取った人はダブルクリックだけ。配布のハードルが一気に下がる。',
        },
        {
          id: 'c',
          text: '自分のPCでしか動かないまま、渡さない。',
          correct: false,
          feedback: 'それでは永遠に「届かぬ声」のまま。配ってこそ価値になる。',
        },
      ],
      successResponse:
        'アプリを EXE にまとめ、起動用の batch も添えた。チームに配ったら、みんなダブルクリックで使い始めた。「便利！」の声が返ってくる。',
      artifact: { title: 'dist/', body: ['📦 guild-tool.exe', '▶ start.bat', '配布: チーム全員'] },
    },
    outro: [
      { narration: true, text: '使われる音がする。アンハードの亡霊たちが、ひとり、またひとりと、安らかに消えていく。' },
    ],
  };

  const s3: Stage = {
    id: 'c5s3',
    index: 2,
    title: '世界へ',
    subtitle: '無料で公開',
    scene: 'city',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '社内だけじゃもったいない。Webページなら「GitHub Pages」で、世界に無料公開できる。きみのリポジトリが、そのまま誰でも見られるサイトになる。',
          '社内で止めるのは惜しい。Webページなら「GitHub Pages」で世界にタダで公開できる。リポジトリがそのままサイトになる。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: 'さあ、自分の言葉で世界に放て。' },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 世界に公開せよ',
      goal: '作ったページをGitHub Pagesで無料公開するよう、自分の言葉で頼もう。',
      hint: '“GitHub Pagesで公開” ＋ “何のページか” を伝えよう。',
      learn: 'GitHub Pagesを使えば、作ったWebページを無料で世界に公開できる。',
      placeholder: '例）このギルドのページを GitHub Pages で公開して、誰でもURLで見られるようにして。',
      keywords: ['github', 'pages', 'ページ', '公開', 'url', 'サイト', '世界', '無料', '見られる'],
      minKeywords: 2,
      sampleAnswer: 'このページを GitHub Pages で公開して、誰でもURLでアクセスできるようにして。',
      successResponse:
        'GitHub Pages で公開したよ。URLができた ── 世界中の誰でも、ブラウザを開けばきみの作品にアクセスできる。「届かぬ声」は、もういない。',
      artifact: { title: 'you.github.io/vibe-guild', body: ['🌐 公開URL 発行', '✓ 世界に届く'], fixed: true },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '作って、配って、世界に開いた。これでもう、きみの作品は誰かの役に立つ。届けるまでが“作る”だよ。',
          '作って、配って、世界に開いた。これでアンタの作品は誰かを助ける。届けて初めて“作った”ことになる。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'よく届けた。…だが OVERSEER は、規模の暴力で押し潰しに来る。次は“雲の力”が要る。',
      },
    ],
  };

  return {
    id: 'ch5',
    index: 4,
    title: '第5章',
    subtitle: '世に放つ ── 届ける技術',
    recap: 'MCPで道具を繋ぎ、AIを「やる」相棒に変えた。',
    scene: 'city',
    boss: { name: 'アンハード', title: '届かぬ声', blurb: '誰にも使われなかった作品の亡霊。届ける術を持たぬ者の傑作を、闇に葬る。' },
    stages: [s1, s2, s3],
  };
}
