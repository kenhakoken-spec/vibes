import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第5章「世に放つ ─ 届ける技術」 — Electron / batch・EXE配布 / GitHub Pages
   章ボス: 届かぬ声「アンハード」── 誰にも使われない作品の亡霊。
   物語の軸: 幕間の夜に作り、直し終えたまま配らなかった“あの掲示板”が
   亡霊の群れの中にいる──自分の過去作を届けることが、章を貫く動機になる。
   ========================================================================= */

export function buildChapter5(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c5s1',
    title: '届かぬ声',
    subtitle: '道具を“アプリ”に',
    scene: 'guild',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'この間MCPで繋いだカレンダーとメール、あれから毎朝ちゃんと働いてるよ。……でもね、ひとつ困ったことが起きた。',
          'この間MCPで繋いだカレンダーとメール、あれから毎朝きっちり回ってるぜ。……だがな、ひとつ困ったことが起きた。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '受付の人に、あの台帳の道具を渡したんだ。なのに「黒い画面が怖くて、開けない」って――一度も使われないまま返ってきた。',
          '受付の連中に、あの台帳の道具を渡したんだ。なのに「黒い画面が怖くて開けない」って――一度も使われないまま突っ返された。'
        ),
      },
      {
        narration: true,
        text: '広場に、声なき亡霊が漂っていた。確かに完成したのに、誰にも使われなかった作品たち──「届かぬ声」アンハード。',
      },
      {
        narration: true,
        text: v(
          'その群れの中に、見覚えのある影がある。あの失敗の夜に作りかけ、直し終えたまま誰にも見せていない――きみの掲示板だ。',
          'その群れの中に、見覚えのある影がある。あの失敗の夜に作りかけ、直し終えたまま誰にも見せていない――あの掲示板だ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          'どれだけ良い道具も、相手が使えなければ無いのと同じだ。現場の人間は、黒い画面やコマンドを嫌う。……依頼だ。お前の道具を「誰でも使える形に」しろ。',
          'どれだけ良い道具も、相手が使えなきゃ無いのと同じさ。現場の人間は、黒い画面やコマンドを嫌う。……依頼だよ。アンタの道具を「誰でも使える形に」しな。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'コマンドのままじゃ、この依頼は解けない。鍵は「Electron」――きみがWebで覚えたHTMLやJavaScriptのまま、ダブルクリックで開くふつうのデスクトップ業務アプリを作れるんだ。',
          'コマンドのままじゃ、この依頼は解けない。鍵は「Electron」――Webで覚えたHTMLやJSのまんま、ダブルクリックで開くデスクトップ業務アプリにできる。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '依頼 ── 誰でも使える形に',
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
      successResponse: v(
        'Webで作った道具を、Electronでデスクトップアプリにしたよ。アイコンをダブルクリックすれば、もう窓が開く。広場で、亡霊がひとり顔を上げた。',
        'Webで作った道具、Electronでデスクトップアプリにしたぜ。アイコンをダブルクリックすりゃ、もう窓が開く。広場で、亡霊がひとり顔を上げた。'
      ),
      artifact: {
        title: v('guild-tool.app', 'crew-tool.app'),
        body: ['🖥 業務支援アプリ', 'ダブルクリックで起動'],
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'いい形になった。受付の人にも、これなら渡せる。あとは“配り方”だね。',
          'いい形になったな。受付の連中にも、これなら渡せる。あとは“配り方”だ。'
        ),
      },
    ],
  };

  const s2: Stage = {
    id: 'c5s2',
    title: '配り方',
    subtitle: 'EXEとして渡す',
    scene: 'cyber',
    intro: [
      {
        narration: true,
        text: 'アプリはできた。だが今度は「これ、どうやって私のPCに入れるの？」――受け取る側の声が、次の壁になった。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'アプリは、相手のPCで動く形にして渡す。Windowsなら EXE（実行ファイル）や、起動手順をまとめた batch（バッチ）。受け取った人は、それをクリックするだけ。',
          '相手のPCで動く形にして渡すんだ。Windowsなら EXE、起動をまとめた batch。受け取った側はクリックするだけでいい。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '渡し方ひとつで、使われるかどうかが決まる。次の依頼は「配布の形」だ。相手の手間を、ゼロにしろ。',
          '渡し方ひとつで、使われるかどうかが決まるのさ。次の依頼は「配布の形」。相手の手間を、ゼロにしな。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '依頼 ── 配布の形',
      diagram: 'ship-flow',
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
      successResponse: v(
        'アプリを EXE にまとめて、起動用の batch も添えたよ。ギルドのみんなに配ったら、ダブルクリックだけで使い始めた。「便利！」って声が返ってくる。',
        'アプリを EXE にまとめて、起動用の batch も添えたぜ。クルーの連中に配ったら、ダブルクリックだけで使い始めた。「便利！」って声が返ってくる。'
      ),
      artifact: {
        title: 'dist/',
        body: [v('📦 guild-tool.exe', '📦 crew-tool.exe'), '▶ start.bat', '配布: チーム全員'],
      },
    },
    outro: [
      { narration: true, text: '使われる音がする。アンハードの亡霊たちが、ひとり、またひとりと、安らかに消えていく。' },
    ],
  };

  const s3: Stage = {
    id: 'c5s3',
    title: '世界へ',
    subtitle: '無料で公開',
    scene: 'city',
    intro: [
      {
        narration: true,
        text: v(
          '亡霊は減った。だが広場の隅に、まだ一体だけ残っている。――直し終えたまま、誰にも見せていない、きみの掲示板。',
          '亡霊は減った。だが広場の隅に、まだ一体だけ残っている。――直し終えたまま、誰にも見せていない、あの掲示板。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'アプリの配布じゃ、あの子は救えない。あれはWebページだ。なら「GitHub Pages」――きみのリポジトリを、そのまま世界中の誰でも見られるサイトにして、無料で公開できる。',
          'アプリの配布じゃ、アイツは救えない。ありゃWebページだ。なら「GitHub Pages」――リポジトリをそのまま世界中の誰でも見られるサイトにして、タダで公開できる。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '依頼だ──「世界に公開せよ」。あの掲示板を、街のすべての人へ届けろ。',
          '依頼だよ──「世界に公開せよ」。あの掲示板を、街のすべての人へ届けな。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: '依頼 ── 世界に公開せよ',
      goal: '作ったページをGitHub Pagesで無料公開するよう、自分の言葉で頼もう。',
      hint: '“GitHub Pagesで公開” ＋ “何のページか” を伝えよう。',
      learn: 'GitHub Pagesを使えば、作ったWebページを無料で世界に公開できる。',
      placeholder: v(
        '例）直したあの掲示板ページを GitHub Pages で公開して、誰でもURLで見られるようにして。',
        '例）直したあの掲示板ページを GitHub Pages で公開して、誰でもURLで見られるようにしてくれ。'
      ),
      keywords: ['github', 'pages', 'ページ', '公開', 'url', 'サイト', '世界', '無料', '見られる'],
      minKeywords: 2,
      sampleAnswer: 'このページを GitHub Pages で公開して、誰でもURLでアクセスできるようにして。',
      successResponse: v(
        'GitHub Pages で公開したよ。URLができた ── 世界中の誰でも、ブラウザを開けばあの掲示板に届く。広場の最後の亡霊が、ふっと笑って消えた。',
        'GitHub Pages で公開したぜ。URLができた ── 世界中の誰でも、ブラウザを開けばあの掲示板に届く。広場の最後のひとりが、ふっと笑って消えた。'
      ),
      artifact: {
        title: v('you.github.io/vibe-guild', 'you.github.io/neon-cursor-crew'),
        body: ['🌐 公開URL 発行', '✓ 世界に届く'],
        fixed: true,
      },
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
        text: v(
          'よく届けた。…なら仕上げだ。一度きりで終わらせるな。今度は“お前自身の作品”を、もう一つ世に出してみろ。',
          'よく届けたね。…なら仕上げだ。一度きりで終わらせるんじゃないよ。今度は“アンタ自身の作品”を、もう一つ世に出してみな。'
        ),
      },
    ],
  };

  const s4: Stage = {
    id: 'c5s4',
    title: '仕上げ',
    subtitle: 'もう一つ世に出す',
    scene: 'city',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '習った手順をなぞるだけなら誰でもできる。本当の試しはこれだ──「自分の作品を届ける」。何をどう届けるかは、お前が決めろ。',
          '習った手順をなぞるだけなら誰でもできるさ。本当の試しはこれ──「自分の作品を届ける」。何をどう届けるかは、アンタが決めな。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'きみが前に作った道具やページを、一つ思い浮かべて。それを「どう届けるか」――EXEで配るのか、GitHub Pagesで公開するのか、自分の言葉でぼくに頼んで。',
          'アンタが前に作った道具かページ、一つ思い浮かべろ。それを「どう届けるか」――EXEで配るか、GitHub Pagesで公開するか、自分の言葉で頼め。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: '依頼 ── 自分の作品を届ける',
      diagram: 'ship-flow',
      goal: '自分が作ったもの（ツールやページ）を「届ける／公開する」よう、自分の言葉でAIに頼もう。配る手段は自由だ。',
      hint: '“何を” ＋ “どう届けるか（EXEで配る／GitHub Pagesで公開）” を入れて頼もう。',
      learn: '作って終わりにせず「届ける」までやる――それが、学んだ技術を本当に活かす最後の一歩。',
      placeholder: '例）自分で作ったメモ帳ツールを EXE にして、チームの全員がダウンロードして使えるように配って。',
      keywords: ['配', '公開', 'exe', 'pages', 'github', '共有', 'url', '届け', 'ダウンロード', '配布'],
      minKeywords: 2,
      sampleAnswer: '自分が作ったツールを EXE にして、チームみんながダウンロードして使えるように配って。',
      successResponse: v(
        'いいね、その通りにしたよ。きみの作品が、きみの手元を離れて誰かのもとへ届いていく。「作って終わり」じゃなく、「届けて完成」だ。',
        'いいね、注文どおりにしたぜ。アンタの作品が、アンタの手元を離れて誰かのもとへ届いていく。「作って終わり」じゃなく、「届けて完成」だ。'
      ),
      artifact: { title: 'dist/ → 世界へ', body: ['📦 自分の作品', '✓ 配布・公開ずみ', '👥 使う人のもとへ'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: v(
          'きみの作品が、誰かの画面で動き出す。広場にはもう、うつむく影はひとつもない。',
          'その作品が、誰かの画面で動き出す。広場にはもう、うつむく影はひとつもない。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '……顔つきが変わったな。作るだけの顔じゃない、届ける者の顔だ。だが覚えておけ――届けば届くほど、声は殺到する。次に来るのは“数”だ。',
          '……顔つきが変わったね。作るだけの顔じゃない、届ける者の顔さ。けど覚えときな――届けば届くほど、声は殺到する。次に来るのは“数”だよ。'
        ),
      },
    ],
  };

  return {
    id: 'ch5',
    title: '第5章',
    subtitle: '世に放つ ── 届ける技術',
    quest: '作品を、街のすべての人へ届けろ',
    recap: 'MCPで道具を繋ぎ、AIは「話す」から「やる」相棒になった。道具と目的をセットで頼むのは、もう癖になっている。',
    keyTerms: ['electron', 'exe', 'batch', 'github-pages', 'deploy'],
    scene: 'city',
    boss: { name: 'アンハード', glyph: 'silence', title: '届かぬ声', blurb: '誰にも使われなかった作品の亡霊。届ける術を持たぬ者の傑作を、闇に葬る。' },
    afterword: {
      world: '街のあちこちの画面で、配られた道具が動き出した。広場から、亡霊の影がひとつ残らず消えた。',
      partner: v(
        '届いたね。……覚えてる？ 前のきみは、作り上げたところで手を止めてた。今日のきみは、作る前から「誰に渡すか」の話をしてたよ。',
        '届いたな。……覚えてるか？ 前のアンタは、作り上げたとこで手が止まってた。今日のアンタは、作る前から「誰に渡すか」の話をしてたぜ。'
      ),
      seed: '――街に出回った作品たちを、OVERSEERの監視網が初めて“ノイズ”として記録した。',
    },
    stages: [s1, s2, s3, s4],
  };
}
