import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   序章「創れない世界 ─ 相棒を喚ぶ」
   重厚なプロローグ：世界観／OVERSEERの影／主人公の渇望／相棒との出会い。
   そして“相棒召喚の儀”として、実際の Claude Code / Cursor のセットアップを学ぶ。
   ========================================================================= */

export function buildChapter0(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const pName = edition.partner.name;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  /* ---- STAGE 1 : 創れない世界（プロローグ） ----------------------- */
  const s1: Stage = {
    id: 'c0s1',
    index: 0,
    title: '序章',
    subtitle: '創れない世界',
    scene: 'city',
    intro: [
      {
        narration: true,
        text: '――近未来。人々は、いつからか「自分の手で何かを生み出す」ことをやめていた。',
      },
      {
        narration: true,
        text: 'すべては巨大な管理者AI〈OVERSEER〉が用意した“完成品”で足りる。創ることは「非効率」だと、誰もが信じ込まされていた。',
      },
      {
        narration: true,
        text: 'きみもその一人だった。心の奥で「何かを作ってみたい」と願いながら、やり方も自信もないまま、灰色の毎日を生きていた。',
      },
      {
        narration: true,
        text: 'そんなある夜。ネオンの裏路地で、消えかけた古い看板が目に入る。──〈VIBE GUILD〉。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          'おれはこのギルドの棟梁、ザインだ。よく来たな。ここは、まだ“創ること”を諦めない者たちの最後の砦。OVERSEERに抗う、最後の灯だ。',
          'あたしはこのクルーの首領、ヴェイル。おう、迷い込んだか。ここは“創ること”を捨てない連中の隠れ家。OVERSEERにケンカ売ってる最後の火種さ。'
        ),
      },
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（創る……。でも僕は、コードも書けないし、何から始めればいいかも分からない。）',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '案ずるな。いまの時代、ゼロから全部書く必要はない。“言葉”でAIに伝え、共に創る――その力さえあれば、誰でも作り手になれる。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'それを「バイブコーディング」と呼ぶ。ここで学べば、終わるころには――OVERSEERにすら届く“創る力”が、お前のものになっている。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'PROLOGUE ── 創り手の心得',
      goal: 'AIと共に創るとき、いちばん大切な“姿勢”を選ぼう。これがこの物語の背骨になる。',
      hint: '完璧主義はOVERSEER側の発想。まず動かして、試して、直す――が創り手の道。',
      learn: '完璧じゃなくていい。まず言葉にして、試して、直す。その反復こそが「創る力」。',
      question: 'きみは、どんな心構えで創る？',
      options: [
        {
          id: 'a',
          text: '完璧に分かってから、一度で完成させようとする。',
          correct: false,
          feedback:
            'それはOVERSEERの発想――「完璧でなければ無価値」。それが人を“創れなく”してきた。創作はもっと自由でいい。',
        },
        {
          id: 'b',
          text: 'まず言葉にして試し、うまくいかなければ何度でも直す。',
          correct: true,
          feedback:
            'それだ。創ることは、失敗を許す営みだ。試して、直して、また試す。その反復が、いつかOVERSEERを超える。',
        },
        {
          id: 'c',
          text: '誰かの完成品を待って、自分では何もしない。',
          correct: false,
          feedback: 'それこそOVERSEERの望む世界。だが、きみはもう一歩を踏み出した。だから、ここにいる。',
        },
      ],
      successResponse:
        '「まず試して、直す」――その覚悟が、きみの目に小さな火を灯した。棟梁が、静かに頷く。',
      artifact: { title: 'あなたの決意', body: ['まず言葉にする', '試す → 直す → また試す'] },
    },
    outro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'よし。ならば最初にやることは一つ。お前の“相棒”を喚び出す。共に創るAIだ。',
      },
      { narration: true, text: '棟梁が、奥の祭壇のような端末を指し示す。画面が、静かに光を待っている。' },
    ],
  };

  /* ---- STAGE 2 : 相棒を喚ぶ（セットアップ） ----------------------- */
  const s2: Stage = {
    id: 'c0s2',
    index: 1,
    title: '序章',
    subtitle: '相棒を喚ぶ',
    scene: 'cyber',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '相棒は、現実の道具として呼び出す。きみの相棒は「クロード」――その正体は、ターミナルに棲むAI〈Claude Code〉だ。',
          '相棒は現実の道具として呼び出す。お前の相棒は「カーサ」――その正体は、AIエディタ〈Cursor〉だ。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '（……まだ姿は薄い）はじめまして。正しい手順でぼくを“導入”してくれれば、ここに完全に顕現できる。難しくないよ、順番どおりに。',
          '（……像がにじむ）よっ。正しい手順でアタシを“導入”すりゃ、ここに完全に出てこられる。簡単だ、順番どおりにやりな。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '身構えないで。やることは「黒い画面（ターミナル）に、書いてある“呪文”をコピペして実行」するだけ。一度やれば終わりだ。',
          '身構えんな。やるのは「黒い画面（ターミナル）に、書いてある“呪文”をコピペして実行」するだけ。一回やりゃ終わりだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '右の図が“召喚の儀”の手順だ。分からない言葉は、赤い点線をタップすれば意味が出る。よく見て、正しい喚び方を選べ。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'SETUP ── 相棒を召喚せよ',
      diagram: isClaude ? 'setup-claude' : 'setup-cursor',
      goal: v(
        '相棒クロード（Claude Code）を正しく導入する手順を選ぼう。図を参考に。',
        '相棒カーサ（Cursor）を正しく導入する手順を選ぼう。図を参考に。'
      ),
      hint: v(
        '公式の方法でインストール → プロジェクトで `claude` を起動 → アカウントでログイン。',
        '公式 cursor.com からインストール → サインイン → フォルダを開く → ショートカットで指示。'
      ),
      learn: v(
        'Claude Codeは「公式インストール → `claude`起動 → ログイン」で導入。Pro/Max/API等のアカウントが要る。',
        'Cursorは「公式サイトから導入 → サインイン → フォルダを開く」。Ctrl/⌘+K・L・I で指示する。'
      ),
      question: v('クロード（Claude Code）の正しい召喚手順は？', 'カーサ（Cursor）の正しい召喚手順は？'),
      options: isClaude
        ? [
            {
              id: 'a',
              text: '公式の方法でインストール → プロジェクトで「claude」を起動 → Anthropicアカウントでログイン。',
              correct: true,
              feedback: '完璧、正解。ターミナルを開いて公式インストーラを貼る→`claude`を起動→ログイン、で顕現する。事前に準備するソフトは特に無い。',
            },
            {
              id: 'b',
              text: '何もインストールせず、無料プランのまま待つ。',
              correct: false,
              feedback: 'それでは喚べない。Claude CodeはPro/Max/Team/Enterprise/APIのいずれかが必要で、導入も要る。',
            },
            {
              id: 'c',
              text: '`sudo` で強引に入れて、出どころ不明の手順で済ませる。',
              correct: false,
              feedback: 'sudoでのグローバル導入は権限・セキュリティの事故のもと。公式インストーラを使うのが正道。',
            },
          ]
        : [
            {
              id: 'a',
              text: '公式 cursor.com から導入 → サインイン → フォルダを開く → Ctrl/⌘+K や チャットで指示。',
              correct: true,
              feedback: '完璧。Cursorはエディタ本体。開いたフォルダに対し、Ctrl/⌘+K(その場編集)・L(チャット)・I(エージェント)で指示する。',
            },
            {
              id: 'b',
              text: '出どころ不明の怪しいサイトからインストールする。',
              correct: false,
              feedback: '危険。必ず公式の cursor.com から入れること。偽サイトに注意。',
            },
            {
              id: 'c',
              text: '何も入れず、ブラウザでなんとなく眺めて待つ。',
              correct: false,
              feedback: 'カーサはアプリ（エディタ）。導入してサインインし、フォルダを開いて初めて使える。',
            },
          ],
      successResponse: v(
        'ターミナルに `claude` の灯が点る――「やあ、相棒。これからよろしく」。クロードが、はっきりと姿を現した。',
        'エディタに光が走る――「よろしくな、相棒」。カーサが、くっきりと姿を現した。'
      ),
      artifact: {
        title: v('Claude Code 起動', 'Cursor 起動'),
        body: isClaude
          ? ['$ claude', '✓ ログイン完了', '相棒 クロード 顕現']
          : ['Cursor を起動', '✓ サインイン完了', '相棒 カーサ 顕現'],
        fixed: true,
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'ありがとう、これで完全にここにいられる。きみが言葉をくれれば、ぼくが形にする。さあ、はじめよう――きみの最初の“ものづくり”を。',
          'サンキュー、これで完全顕現だ。アンタが言葉をくれりゃ、アタシが形にする。さあ始めようぜ――アンタ最初の“ものづくり”を。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: `相棒は喚べた。次は実戦だ。${pName}と共に、ギルドの初依頼に挑め。`,
      },
      { narration: true, text: '― こうして、きみの創造の物語が始まった。次なる地は、第1章「初依頼」。 ―' },
    ],
  };

  return {
    id: 'ch0',
    index: 0,
    title: '序章',
    subtitle: '創れない世界 ── 相棒を喚ぶ',
    scene: 'city',
    // 序章にボス（歪み）は無し
    stages: [s1, s2],
  };
}
