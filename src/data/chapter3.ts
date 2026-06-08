import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第3章「自動化 ─ 反復を断つ」 — RPA / Playwright / Chromiumデバッグ起動
   章ボス: 反復の鎖「トイル」── 同じ作業を永遠にやらせる鎖。
   ========================================================================= */

export function buildChapter3(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c3s1',
    title: '反復の鎖',
    subtitle: '何を自動化する？',
    scene: 'factory',
    intro: [
      { narration: true, text: '記憶も履歴も手に入れた。失敗はもう怖くない。――だが今度は別の影が、きみの“時間”を奪い始めていた。' },
      { narration: true, text: '無数の人影が、同じ書類を延々と書き写している。鎖の名は「トイル」。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'トイルに捕まると、人は同じ作業を永遠に繰り返す。…お前も毎朝、同じ手作業をしていないか？',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '断ち切る鍵は「自動化（RPA）」。人がやる繰り返し作業を、機械に肩代わりさせる。まず“何を”自動化するかの見極めが大事だ。',
          '断ち切るのは「自動化（RPA）」だ。繰り返しは機械にやらせろ。まず“どれを”自動化するか、ここを外すな。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 自動化の的を絞れ',
      goal: '自動化して効果が大きいのはどれ？ 繰り返す定型作業を見極めよう。',
      hint: '「毎回ほぼ同じ手順」で「頻繁に繰り返す」ものほど自動化が効く。',
      learn: '自動化の的は“繰り返す定型作業”。一度きりの判断仕事は人がやる。',
      question: 'まず自動化するなら、どれ？',
      options: [
        {
          id: 'a',
          text: '毎朝20件のサイトを開いて数字をコピペし表に貼る作業。',
          correct: true,
          feedback: '完璧。毎日・同手順・大量＝自動化の王道。ここを機械に任せれば時間が一気に空く。',
        },
        {
          id: 'b',
          text: '新しい企画を一度だけ考える作業。',
          correct: false,
          feedback: '一度きりで毎回違う“判断”は自動化に不向き。人の頭が要る仕事。',
        },
        {
          id: 'c',
          text: '気が向いたときに雑談する作業。',
          correct: false,
          feedback: 'そもそも繰り返しの定型作業ではない。自動化の対象ではない。',
        },
      ],
      successResponse:
        '毎朝の「20サイト巡回→数字をコピペ」を自動化対象に決めた。これを機械に任せよう。トイルの鎖が一本、緩んだ。',
      artifact: { title: 'plan.md', body: ['自動化する作業:', '・毎朝20サイトの数字収集'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '的が決まれば半分勝ち。「繰り返しは機械、判断は人」── この切り分けが自動化の第一歩だよ。',
      },
    ],
  };

  const s2: Stage = {
    id: 'c3s2',
    title: '台本を書く',
    subtitle: 'ブラウザを操る',
    scene: 'factory',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '使うのは「Playwright」。ブラウザを“台本どおり”に自動操作する道具だ。人がやる手順を順番に書けば、その通りに動く。',
          '武器は「Playwright」。ブラウザを台本どおりに動かす。人の手順を順に書く、それだけで再現する。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '台本の質が、自動化の質だ。手順を正しく並べてみせろ。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 自動操作の台本',
      diagram: 'rpa-flow',
      goal: 'ブラウザ自動操作の台本に書くべき内容として、いちばん適切なのは？',
      hint: '人が実際にやる操作（開く→入力→押す→読む）を、順番どおりに。',
      learn: '自動操作は「人がやる手順」を、開く→操作→確認の順に並べること。',
      question: 'Playwrightの台本、どれが正しい？',
      options: [
        {
          id: 'a',
          text: '「いい感じにデータ取ってきて」とだけ書く。',
          correct: false,
          feedback: '曖昧。機械は手順どおりにしか動けない。具体的な操作を順に書く必要がある。',
        },
        {
          id: 'b',
          text: 'サイトを開く→検索欄に語を入力→検索ボタンを押す→結果の数字を読む、を順に書く。',
          correct: true,
          feedback: '見事。人の操作を一手ずつ順番に。これなら機械は迷わず再現できる。',
        },
        {
          id: 'c',
          text: '手順は書かず、AIに毎回その場で考えさせる。',
          correct: false,
          feedback: '自動化は“決まった手順の再現”が肝。毎回考えさせると遅く・不安定になる。',
        },
      ],
      successResponse:
        '台本完成 ── 「開く→入力→押す→読む」。Playwrightがブラウザを操り、20サイトを次々巡回し始めた。手作業が消えていく。',
      artifact: { title: 'collect.spec.ts', body: ['1. サイトを開く', '2. 検索語を入力', '3. ボタンを押す', '4. 数字を読む'] },
    },
    outro: [
      {
        narration: true,
        text: '画面の中で、ブラウザがひとりでに動き出す。人影たちが、手を止めて顔を上げた。',
      },
    ],
  };

  const s3: Stage = {
    id: 'c3s3',
    title: '見えない不調',
    subtitle: '覗いて直す',
    scene: 'factory',
    intro: [
      { narration: true, text: 'だが自動操作が途中で止まった。何が起きたのか、画面の外からは分からない。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '自動化は普段“見えない（ヘッドレス）”で速く走る。でも失敗の原因が掴めない時は、ブラウザを画面に表示して動かし、どこで詰まるか覗けばいい。',
          '普段は“見えない（ヘッドレス）”で高速に走らせる。けど詰まった時は、ブラウザを表示して動かし、どこでコケるか目で見るのが早い。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'ブラウザ（Chromium）を画面に表示して動かし、どこで失敗するか覗くんだ。さあ、自分の言葉で頼んでみろ。',
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 止まる原因を覗け',
      goal: '自動操作が途中で止まる原因を掴むため、ブラウザを「見える状態」で動かして確認するようAIに頼もう。',
      hint: '“ブラウザを画面に表示（ヘッドあり）で起動” ＋ “どこで止まるか確認/スクショ” を伝えよう。',
      learn: '見えない自動化が失敗したら、ブラウザを表示して起動し、止まる箇所を目で確かめる。',
      placeholder: '例）自動操作が途中で止まる。ブラウザを画面に表示した状態で起動して、どのステップで失敗するか確認して。要所でスクリーンショットも撮って。',
      keywords: ['ブラウザ', '表示', 'ヘッド', 'デバッグ', '起動', '止ま', '失敗', '確認', 'スクリーンショット', 'スクショ', '覗'],
      minKeywords: 2,
      sampleAnswer:
        '自動操作が途中で止まる。ブラウザを画面に表示した状態（ヘッドあり）で起動して、どのステップで失敗するか確認して。要所でスクリーンショットも撮って。',
      successResponse:
        'ブラウザを表示して動かしたよ。3番目の「検索ボタン」が、読み込み前に押されて空振りしていた。待つ処理を足したら、最後まで走り切った。トイルの鎖が砕けた。',
      artifact: { title: 'collect.spec.ts', body: ['✓ 待機を追加して安定化', '✓ 20サイト 自動巡回 成功'], fixed: true },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'お見事。見えない不調も、覗けば必ず原因がある。これで毎朝の作業は、きみが寝ていても終わっている。',
          'お見事。見えない不調も、覗けば必ず尻尾を出す。もう毎朝の作業は、寝てる間に片付くぞ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '一本の鎖は砕いた。だが“繰り返し”は一つじゃない。同じ手で、もう一つ断ち切ってみせろ。',
      },
    ],
  };

  const s4: Stage = {
    id: 'c3s4',
    title: '仕上げ',
    subtitle: 'もう一つ自動化',
    scene: 'factory',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'トイルの鎖は、まだ別の作業にも巻きついている。今日学んだ“自動化”を、自分の手でもう一度かけてみろ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やり方は同じだよ。繰り返す定型作業を見つけて、その手順を“台本”にすればいい。毎朝のレポート送信でも、定期的なデータ収集でも――自由に頼んでみて。',
          'やることは同じだ。繰り返す定型作業を、手順ごと台本に落とすだけ。毎朝のレポート送信でも、定期のデータ収集でも――好きに投げてこい。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 別の作業も自動化',
      goal: 'もう一つの繰り返し作業を、自分の言葉でAIに自動化させよう（例：毎朝のレポート送信／定期的なデータ収集）。何を・いつ・どんな手順で動かすかを伝えるのがコツ。',
      hint: '「どの作業を」「どのタイミングで（毎朝など）」「どんな手順で繰り返すか」を具体的に。',
      learn: '繰り返す定型作業は、手順を“台本”にすれば何でも自動化できる――それが自動化の真髄。',
      placeholder: '例）毎朝9時に、売上データを集めてレポートにまとめ、チームに自動で送信するスクリプトを作って。手順どおりに繰り返し動くようにして。',
      keywords: ['自動', '毎朝', '毎日', '繰り返し', '定型', 'playwright', 'スクリプト', '巡回', '収集', '送信'],
      minKeywords: 2,
      sampleAnswer:
        '毎朝9時に、各サイトを巡回して売上データを収集し、レポートにまとめてチームへ自動送信するスクリプトを作って。手順どおりに毎日繰り返し動くようにして。',
      successResponse:
        'いいね、その通りに組んだよ。手順を台本にして、毎朝決まった時刻に自動で走るようにした。データ収集からレポート送信まで、もうきみの手を借りない。トイルの鎖が、また一本砕けた。',
      artifact: { title: 'daily-report.spec.ts', body: ['毎朝9:00 自動実行', '1. データを収集', '2. レポートを作成', '3. チームへ送信'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: '二本目の鎖が、光の粒になって砕け散る。同じ作業を繰り返していた人影たちが、ゆっくりと顔を上げた。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'できたね。一つ自動化できれば、あとは同じ。繰り返しを見つけて、手順を台本にする――その目を、きみはもう持っている。',
          'やったな。一つできりゃ後は応用だ。繰り返しを見抜いて手順を台本にする――その目、もうアンタのもんだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '反復の鎖、断ち切ったな。…だが OVERSEER は、人の時間そのものを支配する。まだ足りん。',
      },
    ],
  };

  return {
    id: 'ch3',
    title: '第3章',
    subtitle: '自動化 ── 反復を断つ',
    recap: '記憶・Git・GitHubで、成果を失わず共有する術を得た。',
    keyTerms: ['rpa', 'playwright', 'headless', 'screenshot'],
    scene: 'factory',
    boss: { name: 'トイル', glyph: 'chains', title: '反復の鎖', blurb: '同じ作業を永遠に繰り返させる鎖。自動化を知らぬ者を縛り続ける。' },
    stages: [s1, s2, s3, s4],
  };
}
