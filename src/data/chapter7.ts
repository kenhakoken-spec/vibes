import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第7章「品質を守る ─ 壊れない仕組み」 — 自動テスト / 型(TypeScript) / CI
   章ボス: 崩落「リグレッション」── 作るほどに過去の成果が崩れ落ちる歪み。
   ========================================================================= */

export function buildChapter7(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c7s1',
    index: 0,
    title: '崩落の予兆',
    subtitle: '壊れに気づく',
    scene: 'cyber',
    intro: [
      { narration: true, text: '規模を捌く力も得た。きみの作品は、大きく、強くなった。――だが、大きいものほど、足元から崩れる。' },
      { narration: true, text: '新しい機能を一つ足すたび、関係ないはずの古い機能が、音もなく壊れていく。瓦礫の影が囁く――「崩落（リグレッション）」。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '作るほどに、過去の成果が崩れていく。これがリグレッションだ。…お前も、直したはずの所が別の所を壊した経験はないか？',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '守る鍵は「自動テスト」。「ボタンを押したら挨拶が出る」みたいな“あるべき動作”を先に書いておけば、変更のたびに機械が毎回チェックしてくれる。',
          '守る鍵は「自動テスト」だ。“あるべき動作”を先に書いておけば、変更のたびに機械が毎回見張ってくれる。崩落を未然に察知できる。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 壊れを見張る',
      goal: '新機能を足すたび、前の機能が壊れていないかを毎回どう確かめる？',
      hint: '人の目視は見落とすし疲れる。機械に毎回・同じチェックを任せられる形は？',
      learn: '自動テストは「あるべき動作」を機械が毎回確かめてくれる安全網。崩落（リグレッション）を早く見つける。',
      question: 'どう見張る？',
      options: [
        {
          id: 'a',
          text: '毎回すべての画面を手で動かして、目視で確認する。',
          correct: false,
          feedback: '機能が増えるほど大変になり、必ず見落としが出る。人の根性では守りきれない。',
        },
        {
          id: 'b',
          text: '自動テストを書いて、変更のたびに機械にチェックさせる。',
          correct: true,
          feedback: '正解。一度書けば、何度でも機械が同じ確認をしてくれる。崩落の予兆を即つかめる。',
        },
        {
          id: 'c',
          text: '壊れたら使う人が気づいて連絡してくれる、と放っておく。',
          correct: false,
          feedback: 'それは“ユーザーにバグを踏ませる”こと。信頼を失う。守りは自分の側で張る。',
        },
      ],
      successResponse:
        '主要な動作に自動テストを書いたよ。「挨拶が出る」「合計が正しい」――変更するたび、機械が毎回チェックしてくれる。崩落の地面に、最初の杭を打った。',
      artifact: { title: 'app.test.ts', kind: 'file', body: ['✓ ボタンで挨拶が出る', '✓ 合計金額が正しい', '✓ 3件すべて成功'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: 'これで「壊れたら気づける」。でも、もっといいのは“そもそも壊れを書けなくする”ことなんだ。',
      },
    ],
  };

  const s2: Stage = {
    id: 'c7s2',
    index: 1,
    title: '書けなくする',
    subtitle: '型で守る',
    scene: 'cyber',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '使うのは「TypeScript（型）」。「ここは数値」「ここは文字」と決めておくと、うっかり違うものを入れた“その瞬間”に赤線で教えてくれる。動かす前にミスに気づける。',
          '武器は「TypeScript（型）」。「ここは数値」と決めておけば、違うものを入れた瞬間に赤線が出る。動かす前にミスを潰せるんだ。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '転んでから直すな。転ばぬ先の杖を持て。' },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 事故を未然に',
      goal: '「個数（数値）」のつもりの場所に、うっかり文字を入れてしまう事故を“書いた時点で”防ぐには？',
      hint: '実行して気づくのでは遅い。「書いた瞬間」に間違いを教えてくれる仕組みは？',
      learn: '型（TypeScript）は、値の取り違えを“書いた瞬間”に教えてくれる、転ばぬ先の杖。',
      question: 'どう未然に防ぐ？',
      options: [
        {
          id: 'a',
          text: '型（TypeScript）で「ここは数値」と決め、違う型を即エラーにする。',
          correct: true,
          feedback: '正解。間違った型を入れた瞬間に赤線。実行する前に、机の上でミスを潰せる。',
        },
        {
          id: 'b',
          text: '間違えないように気をつける、と心に誓う。',
          correct: false,
          feedback: '人はいつか必ず間違える。気合いではなく仕組みで防ぐのが品質の鉄則。',
        },
        {
          id: 'c',
          text: 'とりあえず動かして、エラーが出てから直す。',
          correct: false,
          feedback: '見つかるのが遅いほど直すのは大変。型なら“書く前”の段階で止められる。',
        },
      ],
      successResponse:
        '主要な値に型をつけたよ。試しに数値の欄へ文字を入れてみたら、その場で赤線が出た。バグになる前に、書いた瞬間に捕まえられる。崩落の地面が、固くなっていく。',
      artifact: { title: 'types.ts', kind: 'file', body: ['count: number  // 個数', 'name: string   // 名前', '⚠ 文字→数値は即エラー'] },
    },
    outro: [
      { narration: true, text: 'ぐらついていた足場が、一段ずつ固まっていく。崩落の影が、苛立たしげに身をよじった。' },
    ],
  };

  const s3: Stage = {
    id: 'c7s3',
    index: 2,
    title: '関所をつくる',
    subtitle: '自動で見張る',
    scene: 'cyber',
    intro: [
      { narration: true, text: 'だが、テストも型も「自分が走らせなければ」意味がない。人は、忙しいと確認を飛ばす。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'そこで「CI（GitHub Actions）」。コードを送る（push）たびに、自動でテストや型チェックが走る“関所”を置くんだ。通らないコードは、そもそも取り込まない。',
          'そこで「CI（GitHub Actions）」だ。pushのたびに自動でテスト・型チェックが走る“関所”を置く。通らないコードは入れない。人の油断ごと封じる。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '人の意志に頼るな。仕組みに見張らせろ。さあ、自分の言葉で関所を頼んでみろ。',
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 自動の関所',
      goal: 'pushするたびに自動でテスト（や型チェック）が走り、失敗したら止める仕組み（CI）を作るよう、自分の言葉でAIに頼もう。',
      hint: '“push したら自動でテストを走らせる” ＋ “失敗したら取り込まない（止める）” を伝えよう。',
      learn: 'CI（GitHub Actions）は、pushのたびに自動でチェックを走らせる関所。壊れたコードの混入を防ぐ。',
      placeholder: '例）GitHubにpushしたら、GitHub Actionsで自動テストと型チェックを走らせて。失敗したら取り込まないようにして。',
      keywords: ['ci', 'github actions', 'actions', 'テスト', '型', '自動', 'push', '関所', '失敗', 'チェック'],
      minKeywords: 2,
      sampleAnswer: 'GitHubにpushしたら、GitHub Actionsで自動テストと型チェックを走らせて。失敗したコードは取り込まないようにして。',
      successResponse:
        'CIの関所を立てたよ。pushするたびにテストと型チェックが自動で走り、緑のチェックが並ぶ。失敗すれば赤く止まり、壊れたコードは中に入れない。崩落は、もう足場を崩せない。',
      artifact: { title: '.github/workflows/ci.yml', kind: 'terminal', body: ['$ on: push', '✓ test ... passing', '✓ typecheck ... passing'], fixed: true },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やった。テストで気づき、型で未然に防ぎ、CIで自動で見張る。三重の安全網だ。もう、足元は崩れない。',
          'やったな。テストで気づき、型で防ぎ、CIで見張る。三重の網だ。もう足元は崩れやしない。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '崩落は鎮めた。だが“仕組み”は、なぞるだけでは身につかん。最後に、お前自身の作品へ、自分の手で安全網を一つ掛けてみろ。',
      },
    ],
  };

  const s4: Stage = {
    id: 'c7s4',
    index: 3,
    title: '仕上げ',
    subtitle: '自分の作品に安全網',
    scene: 'cyber',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '手順をなぞるのは誰でもできる。本当に守れるかは、自分の作品で試して分かる。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'きみが前に作った道具やページを、一つ思い浮かべて。それに「テスト」「型」「CI」のどれか――安全網を一つ掛けるよう、自分の言葉でぼくに頼んで。',
          'アンタが前に作った道具かページを一つ思い浮かべろ。それに「テスト」「型」「CI」のどれか、安全網を一つ掛けるよう自分の言葉で頼め。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 自分の作品を守る',
      goal: '自分が作ったもの（ツールやページ）に、壊れを防ぐ安全網（自動テスト／型／CIのどれか）を掛けるよう、自分の言葉でAIに頼もう。何を守るかは自由だ。',
      hint: '“何に” ＋ “どの安全網を（テスト／型／CI）” ＋ “何を守りたいか” を入れて頼もう。',
      learn: '壊れない仕組みは「気づく(テスト)・防ぐ(型)・見張る(CI)」。自分の作品にも掛けてこそ身につく。',
      placeholder: '例）自分のメモ帳ツールに、保存機能が壊れていないか確かめる自動テストを書いて。pushのたびにCIで走るようにもして。',
      keywords: ['テスト', '型', 'ci', 'typescript', '自動', '守', '壊れ', 'チェック', 'push', '安全'],
      minKeywords: 2,
      sampleAnswer: '自分のメモ帳ツールに、保存機能が壊れていないか確かめる自動テストを書いて。pushのたびにCIで自動チェックされるようにして。',
      successResponse:
        'いいね、その通りにしたよ。きみの作品に安全網がかかった。これからは、変更しても“壊れたら即わかる”。直す勇気は、壊れに気づける仕組みから生まれる。もう、きみはそれを自分で張れる。',
      artifact: { title: 'あなたの作品 + 安全網', kind: 'file', body: ['🛡 自動テスト 追加', '⚠ 型でミスを防止', '✓ CIで毎回チェック'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: '崩れ落ちかけていた足場が、一枚の堅い大地になった。リグレッションの影は、もうどこにも亀裂を見つけられない。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'よく守った。…だが「壊れない」と「正しく決められる」は別の力だ。次は、膨れ上がった数字から“次の一手”を読み解く目を持て。',
      },
    ],
  };

  return {
    id: 'ch7',
    index: 6,
    title: '第7章',
    subtitle: '品質を守る ── 壊れない仕組み',
    recap: 'GASから巨大クラウドまで、規模に合わせて道具を選べるようになった。',
    keyTerms: ['regression', 'test', 'typescript', 'ci'],
    scene: 'cyber',
    boss: { name: 'リグレッション', glyph: 'crack', title: '崩落', blurb: '作るほどに過去の成果を崩し落とす歪み。守る仕組みを持たぬ者の土台を、静かに砕く。' },
    stages: [s1, s2, s3, s4],
  };
}
