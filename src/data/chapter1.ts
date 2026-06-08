import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第1章「初依頼」 — 3ステージ
   1. プロンプトの基礎（選択）
   2. 文脈を与える（選択）
   3. デバッグ＝反復改善（自由記述）
   章を終えると、動く「ギルド入室ページ」が1つ完成する。

   buildChapter1(edition) で編ごとに台詞のトーンが変わる（世界観・相棒が別物）。
   ========================================================================= */

export function buildChapter1(edition: Edition): Chapter {
  const partnerId = edition.partner.id; // roster key
  const partnerPortrait = edition.partner.portrait; // 'claude' | 'cursor'
  const pName = edition.partner.name;
  const isClaude = edition.id === 'claude';

  /** 編で言い回しを出し分けるヘルパー */
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  /* ---- STAGE 1 : プロンプトの基礎 ---------------------------------- */
  const stage1: Stage = {
    id: 's1',
    title: '初依頼',
    subtitle: 'はじめてのプロンプト',
    intro: [
      {
        narration: true,
        text: v(
          '〈ARCANE CODE GUILD〉── 開発のすべてが集約された塔。きみは今日、最下層の新人としてここに立っている。',
          'ネオンの裏路地。反逆の開発クルー〈NEON CURSOR CREW〉のアジトに、きみは拾われたばかりだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          'よく来た、新人。ここではコードを“書く”だけが仕事じゃない。AIに“頼む”力こそが武器になる。',
          'おう新入り。勘違いするなよ、ここじゃ手前で全部書く奴は二流だ。AIをどう走らせるか――それが腕だ。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'はじめまして。ぼくはクロード。きみの相棒だ。きみが「何を作りたいか」を言葉にしてくれれば、ぼくが形にする。',
          'よっ、アタシがカーサ。アンタの相棒。やりたいこと言いな、こっちが秒で形にしてやる。'
        ),
      },
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（言葉にする……それだけで、ものが作れるのか？）',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '最初の依頼だ。ギルドの入口に置く「あいさつページ」を作れ。やり方は――そこの相棒に“頼む”だけだ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'コツを一つ。ぼくは魔法使いじゃない。「何を」「どうなってほしいか」を具体的に言ってくれるほど、いいものを返せる。',
          '先に言っとく。アタシは超能力者じゃない。「何を」「どうしたい」かハッキリ言え。曖昧だとゴミが出るぞ。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST 01 ── あいさつページを作れ',
      goal: 'AIに「あいさつを表示するページ」を作らせる、いちばん良い“頼み方”を選べ。',
      hint: '具体的に。「何を」「どう表示するか」が入っている指示が強い。',
      learn: '良いプロンプト＝『何を』『どうなってほしいか』を具体的に伝えること。',
      question: `${pName}に、どう頼む？`,
      options: [
        {
          id: 'a',
          text: 'なんか、いい感じにして。',
          correct: false,
          feedback:
            '“いい感じ”は人によって違う。AIは何を作ればいいか分からず、的外れなものが返ってくる。',
        },
        {
          id: 'b',
          text: '「ようこそ VIBE GUILD へ」と大きく表示する、シンプルなページを作って。',
          correct: true,
          feedback:
            '完璧。「何を表示するか（文言）」「どう見せるか（大きく・シンプル）」が具体的。AIは迷わない。',
        },
        {
          id: 'c',
          text: 'HTMLとCSSとJSとReactとTypeScriptで、全部、今すぐ作って。',
          correct: false,
          feedback:
            '技術名を並べても“何を”作るかが無い。盛りすぎは逆効果。まず「作りたいもの」を言葉にしよう。',
        },
      ],
      successResponse:
        '了解。中央に大きく「ようこそ VIBE GUILD へ」と表示する、シンプルなページを作ったよ。',
      artifact: {
        title: 'guild.html',
        body: ['ようこそ VIBE GUILD へ'],
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'できた。見てごらん、きみの言葉がそのままページになった。これが“バイブコーディング”の第一歩だ。',
          'ほら、できた。アンタの一言がページになった。これがバイブコーディングってやつ。悪くないだろ？'
        ),
      },
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（指示しただけなのに……動くものができた。なんだ、これ。面白い。）',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '上出来だ。だが本番はここからだぞ。',
      },
    ],
  };

  /* ---- STAGE 2 : 文脈を与える -------------------------------------- */
  const stage2: Stage = {
    id: 's2',
    title: '第二依頼',
    subtitle: '文脈を渡す',
    intro: [
      {
        narration: true,
        text: 'あいさつページは評判だった。棟梁は次の依頼書を放ってよこす。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'ページに「入口」が要る。来た者が押せる“ギルドに入る”ボタンを足せ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'ここで大事なこと。ぼくは前の会話を覚えていないこともある。「どのページに」「どこへ」「何を」足すのか、文脈を渡してほしい。',
          '注意な。アタシは前の話を忘れてることもある。「どのページの」「どこに」「何を」足すか、ちゃんと文脈をよこせ。'
        ),
      },
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（“ボタン足して”だけじゃ伝わらない、ってことか……。）',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'ちなみに豆知識。Webページは3つの部品でできてる――骨組み(HTML)・見た目(CSS)・動き(JS)。ボタンも同じで、形と見た目と「押した時の動き」を足すんだ。',
          'ちな豆知識。Webページは3部品――骨組み(HTML)・見た目(CSS)・動き(JS)。ボタンも同じ、形と見た目と「押した時の動き」を足す。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST 02 ── 入口のボタンを足せ',
      diagram: 'web-parts',
      goal: 'さっきのページに「ギルドに入る」ボタンを追加する、文脈の伝わる指示を選べ。',
      hint: '“対象（どのページ）・場所（どこ）・ラベル（何のボタン）”が揃っているか？',
      learn: 'AIは文脈を覚えていないことがある。『どれに・どこに・何を』を補って指示する。',
      question: `${pName}に、どう頼む？`,
      options: [
        {
          id: 'a',
          text: 'ボタン作って。',
          correct: false,
          feedback: 'どのページの、何のボタン？文脈がゼロ。AIは当てずっぽうで作るしかない。',
        },
        {
          id: 'b',
          text: 'さっきのあいさつページの下に、押すと反応する「ギルドに入る」ボタンを追加して。',
          correct: true,
          feedback:
            '見事。対象（あいさつページ）・場所（下）・ラベル（ギルドに入る）・挙動（押すと反応）が揃った。',
        },
        {
          id: 'c',
          text: '全部いちから作り直して、ボタンも付けて。',
          correct: false,
          feedback:
            '作り直す必要はない。せっかくのページを壊すリスクも。“足す”ときは既存を活かして追記しよう。',
        },
      ],
      successResponse:
        '前に作った guild.html を読み込んで、あいさつの下に「ギルドに入る」ボタンを追加したよ。今はまだ押しても静かだけどね。',
      artifact: {
        title: 'guild.html',
        body: ['ようこそ VIBE GUILD へ'],
        hasButton: true,
        buttonLabel: 'ギルドに入る',
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '文脈を渡したから、前のページを壊さずに追記できた。AIへの“伝え方”が、そのまま結果の質になる。',
          '文脈を渡したろ？だから前のを壊さず足せた。伝え方がそのまま結果になる――覚えとけ。'
        ),
      },
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（ボタンができた。……あれ、でも“押しても静か”って言ってたな。）',
      },
    ],
  };

  /* ---- STAGE 3 : デバッグ＝反復改善（自由記述） -------------------- */
  const stage3: Stage = {
    id: 's3',
    title: '最終依頼',
    subtitle: 'バグと向き合う',
    intro: [
      {
        narration: true,
        text: '完成――と思った矢先。来訪者がボタンを押す。だが、何も起きない。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'おい、ボタンが死んでるぞ。押しても無反応だ。コンソールには赤いエラーまで出てる。直せ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '落ち着いて。バグは敵じゃない、手がかりだ。ぼくに直してほしいなら――「どんな症状か」と「本当はどうなってほしいか」を言葉で伝えて。',
          'ビビんな。バグは敵じゃねぇ、ヒントだ。直させたいなら――「どう壊れてる」と「本当はどうしたい」をアタシに投げろ。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '今回はきみが自分の言葉で頼む番だ。一発で決まらなくていい。何度でも直せる。それが反復改善だ。',
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST 03 ── 動かないボタンを直せ',
      goal: '「押しても反応しないボタン」を直すよう、自分の言葉でAIに頼もう。症状と期待する結果を伝えるのがコツ。',
      hint: '“ボタンを押しても反応しない（症状）” ＋ “押したらこうなってほしい（期待）” を入れて頼もう。',
      learn: 'うまくいかない時は『症状』と『期待する結果』を伝えて、何度でも直してもらえばいい。',
      placeholder:
        '例）ギルドに入るボタンを押しても反応しない。押したら「入室しました」と表示されるように直して。',
      keywords: ['ボタン', '押', '反応', '動か', 'エラー', '直', '修正', '入室', '表示'],
      minKeywords: 2,
      sampleAnswer:
        'ギルドに入るボタンを押しても何も起きない。押したら「入室しました」と表示されるように直して。',
      successResponse:
        'エラーを読んだよ。ボタンに「押されたときの処理」が繋がっていなかった。処理を接続して、押すと「入室しました」と出るように直したよ。もう一度押してみて。',
      artifact: {
        title: 'guild.html',
        body: ['ようこそ VIBE GUILD へ'],
        hasButton: true,
        buttonLabel: 'ギルドに入る',
        fixed: true,
      },
    },
    outro: [
      {
        narration: true,
        text: 'ボタンを押す。ポン、と軽い音。画面に「入室しました」。来訪者が、笑った。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やったね。きみは自分の言葉でバグを退治した。完璧な一発じゃなくていい――伝えて、試して、直す。これがすべての基本だ。',
          'やるじゃん。自分の言葉でバグを仕留めたな。一発で完璧じゃなくていい――言って、試して、直す。全部の基本だ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '……新人。お前、見どころがある。最後にもう一つ、今日の総仕上げといこう。',
      },
    ],
  };

  /* ---- STAGE 4 : 応用練習（学びを総動員・自由記述） ----------------- */
  const stage4: Stage = {
    id: 's4',
    title: '仕上げ',
    subtitle: '学びを総動員',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '動くページはできた。だが“あと一歩”の魅力が欲しい。今日学んだ全部を使って、自分で仕上げてみろ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やり方は同じだよ。「どこに」「何を」「どうしたいか」を具体的に。うまくいかなければ、見て、直す。きみの“こうしたい”を、自由に言葉にして。',
          'やり方は同じだ。「どこに・何を・どうしたい」を具体的に言え。コケたら見て直す。アンタの“こうしたい”を、自由にぶつけろ。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST 04 ── 自分で仕上げる',
      goal: '完成したギルドページに、もう一工夫。自分の言葉で改善をAIに頼もう（例：歓迎の一行を足す／色を変える／ボタンを目立たせる）。正解は一つじゃない。',
      hint: '「どこに・何を・どうしたいか」を具体的に。一発で完璧じゃなくていい――頼んで、見て、直す。',
      learn: '具体化・文脈・反復改善――学んだ全部を組み合わせれば、もっと良くできる。',
      placeholder: '例）あいさつの下に「一緒に創ろう」と小さく一行足して。ボタンはもう少し大きく目立たせて。',
      keywords: ['足し', '追加', '変え', '色', '大き', '目立', '文言', 'メッセージ', '一行', '下に', '上に', 'ボタン', '背景', '整え', '画像'],
      minKeywords: 1,
      sampleAnswer: 'あいさつの下に「一緒に創ろう」と一行足して、ボタンをもう少し大きく目立たせて。',
      successResponse:
        'いいね、その通りに直したよ。短い一行が温かさを足して、ボタンも押したくなる見た目になった。きみの“ひと工夫”が、ページに命を吹き込んだ。',
      artifact: {
        title: 'guild.html',
        body: ['ようこそ VIBE GUILD へ', '一緒に創ろう'],
        hasButton: true,
        buttonLabel: 'ギルドに入る',
        fixed: true,
      },
    },
    outro: [
      {
        narration: true,
        text: '小さな一行と、押したくなるボタン。きみの手で、ページが“きみのもの”になった。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '……見事だ。具体化・文脈・反復改善――もう全部、使いこなしてる。第1章は、ここまでだ。',
      },
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（あいさつページに、動くボタン、そして僕のひと工夫。小さいけど――確かに、僕が“作った”ものだ。）',
      },
    ],
  };

  return {
    id: 'ch1',
    title: '第1章',
    subtitle: '初依頼 ── バイブコーディングの夜明け',
    recap: '相棒を喚び出し、「まず試して直す」創り手の覚悟を決めた。',
    keyTerms: ['prompt', 'html', 'css', 'js', 'bug', 'debug'],
    scene: 'guild',
    boss: {
      name: 'ノイズ',
      title: '群れバグ',
      blurb: '無数の小さな不具合の群れ。曖昧な指示につけ込み、作りかけを濁らせる。',
    },
    stages: [stage1, stage2, stage3, stage4],
  };
}

/** 章を通して読み手に与える台詞の話者を解決するためのロスター。 */
export function rosterFor(edition: Edition) {
  return {
    hero: { id: 'hero', name: 'きみ', role: '新人', portrait: 'hero' as const, color: '#f5f5f7' },
    mentor: edition.mentor,
    [edition.partner.id]: edition.partner,
  } as Record<string, { id: string; name: string; role: string; portrait: 'hero' | 'mentor' | 'claude' | 'cursor'; color: string }>;
}
