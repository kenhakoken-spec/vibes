import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第8章「データを読む ─ 数字から決める」 — 問いを立てる / 可視化 / ダッシュボード
   章ボス: 惑わしの霧「ノイズ」── 数字の山に紛れ、間違った判断へ誘う歪み。
   ========================================================================= */

export function buildChapter8(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'c8s1',
    title: '惑わしの霧',
    subtitle: '問いを立てる',
    scene: 'data',
    intro: [
      { narration: true, text: '壊れない仕組みも整えた。利用者が増え、数字が日々たまっていく。アクセス、売上、ログ――データの山。' },
      { narration: true, text: 'だが、山が大きいほど、視界は白く濁る。意味ありげな数字が、間違った道を指さす。霧の名は「ノイズ」。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '数字は、多いほど人を惑わす。ノイズに飲まれた者は、たくさんの数字を見て、見当違いの決断をする。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '霧を抜ける第一歩は「問いを立てる」こと。“何を知りたいか”を先に決めるんだ。闇雲に全部集計しても、霧が濃くなるだけだよ。',
          '霧を抜ける第一歩は「問いを立てる」ことだ。“何を知りたいか”を先に決めろ。やみくもに全部集計しても、霧が濃くなるだけだ。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 霧の入口',
      goal: 'たまったデータから意味を引き出す。「データ分析」の最初の一歩はどれ？',
      hint: '数字をたくさん見ること自体は答えではない。先に決めるべきものがある。',
      learn: 'データ分析の第一歩は“問いを立てる”。知りたいことを決めてから数字に当たる。',
      question: 'まず何をする？',
      options: [
        {
          id: 'a',
          text: 'とにかく全部の数字をかき集めて、ひたすら眺める。',
          correct: false,
          feedback: '数字が増えるほど霧は濃くなる。目的のない集計は、ノイズを増やすだけ。',
        },
        {
          id: 'b',
          text: '「何を知りたいか（問い）」を先に決めてから、必要な数字を見る。',
          correct: true,
          feedback: '正解。「利用者は増えている？」と問いを立てれば、見るべき数字が絞れる。霧が晴れ始める。',
        },
        {
          id: 'c',
          text: '数字は見ずに、直感だけで決めてしまう。',
          correct: false,
          feedback: 'それでは霧の中で目を閉じて歩くのと同じ。データは“勘を確かめる”ために使う。',
        },
      ],
      successResponse:
        '問いを立てたよ ──「先月より、毎日使ってくれる人は増えている？」。知りたいことが決まった瞬間、見るべき数字が絞られた。白い霧に、細い道が見えてくる。',
      artifact: { title: 'question.md', kind: 'note', body: ['問い:', '・毎日使う人は増えている？', '→ 見る数字を絞る'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '問いが決まれば、もう迷わない。あとは、その答えを“見える形”にするだけだよ。',
      },
    ],
  };

  const s2: Stage = {
    id: 'c8s2',
    title: '霧を晴らす',
    subtitle: '可視化で掴む',
    scene: 'data',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '数字の表をいくら睨んでも、傾向は見えない。「グラフ（可視化）」にすれば、流れや偏りが一目で分かる。大事なのは、目的に合うグラフを選ぶこと。',
          '数字の表を睨んでも傾向は見えない。「グラフ（可視化）」にすれば流れが一目だ。コツは、目的に合うグラフを選ぶこと。'
        ),
      },
      { speaker: 'mentor', portrait: 'mentor', side: 'left', text: '推移は折れ線、構成比は円、比較は棒。道具を取り違えるな。' },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 正しい見せ方',
      goal: '「毎日の利用者数が、増えているか減っているか」を掴むのに、いちばん適したグラフは？',
      hint: '見たいのは“時間に沿った変化（推移）”。それが一目で分かる形は？',
      learn: '可視化は目的で選ぶ。時間の推移は折れ線、構成比は円、項目の比較は棒グラフ。',
      question: 'どのグラフで見る？',
      options: [
        {
          id: 'a',
          text: '折れ線グラフ（日付を横軸に、人数の推移を線で見る）。',
          correct: true,
          feedback: '正解。時間に沿った増減は折れ線がいちばん。上り坂か下り坂か、一目で分かる。',
        },
        {
          id: 'b',
          text: '円グラフ（全体に占める割合を見る）。',
          correct: false,
          feedback: '円グラフは“構成比”向け。時間の推移を見るのには向かない。',
        },
        {
          id: 'c',
          text: 'グラフにせず、数字の表をそのまま見比べる。',
          correct: false,
          feedback: '表のままでは傾向が埋もれる。可視化してこそ、霧が晴れる。',
        },
      ],
      successResponse:
        '日付を横軸に、利用者数を折れ線グラフにしたよ。すると一目で分かった――右肩上がり。だけど週末だけガクッと落ちている。表では見えなかった形が、線になって浮かび上がる。',
      artifact: { title: '利用者数の推移', kind: 'note', body: ['📈 折れ線グラフ', '右肩上がり ／ 週末に低下', '→ 週末に何かある'] },
    },
    outro: [
      { narration: true, text: '濁っていた数字が、くっきりとした線になる。霧の中に隠れていた“形”が、姿を現した。' },
    ],
  };

  const s3: Stage = {
    id: 'c8s3',
    title: '計器盤',
    subtitle: '一目で分かる場所',
    scene: 'data',
    intro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '毎回グラフを作り直すのは大変。だから本当に大事な数字（KPI）を選んで、グラフを並べた「ダッシュボード（計器盤）」にまとめよう。開けば、誰でも現状が一目で分かる。',
          '毎回グラフを作り直すのは手間だ。本当に大事な数字（KPI）を選び、「ダッシュボード（計器盤）」に並べよう。開けば誰でも現状が一目で分かる。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'あれもこれもは霧の元。本当に見るべき数字に絞れ。さあ、自分の言葉で計器盤を頼んでみろ。',
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 計器盤をつくる',
      goal: '大事な数字（KPI）を選び、グラフを並べた“ダッシュボード”を作って、関係者が一目で現状を把握できるよう、自分の言葉でAIに頼もう。',
      hint: '“どの数字（KPI）を” ＋ “ダッシュボードにグラフで並べて一目で分かるように” を伝えよう。',
      learn: 'ダッシュボードは、大事な数字（KPI）とグラフを一画面に集約した計器盤。開くだけで現状が分かる。',
      placeholder: '例）毎日の利用者数・売上・エラー数を選んで、折れ線グラフで並べたダッシュボードを作って。開けば一目で現状が分かるようにして。',
      keywords: ['ダッシュボード', 'グラフ', '可視化', 'kpi', '指標', '一目', '集計', '推移', '一画面', '数字'],
      minKeywords: 2,
      sampleAnswer: '毎日の利用者数・売上・エラー数を選んで、折れ線グラフで並べたダッシュボードを作って。開けば一目で現状が分かるようにして。',
      successResponse:
        'ダッシュボードを作ったよ。利用者数・売上・エラー数が、グラフで一画面に並んだ。毎回集計しなくても、開けば現状が一目で分かる。霧が晴れ、数字が“地図”になった。',
      artifact: { title: 'dashboard', kind: 'web', body: ['📊 利用者数（折れ線・増加中）', '💰 売上（棒・前月比+18%）', '⚠ エラー数（折れ線・低下）'], fixed: true },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やった。問いを立て、可視化し、計器盤に集約した。これでもう、数字に振り回されない。数字を“読んで”決められる。',
          'やったな。問いを立て、可視化し、計器盤にまとめた。もう数字に振り回されない。数字を“読んで”決められるんだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '霧は晴れた。だが“読む目”は、自分のデータで使って初めて身につく。最後に、お前自身の数字から、次の一手を導いてみせろ。',
      },
    ],
  };

  const s4: Stage = {
    id: 'c8s4',
    title: '仕上げ',
    subtitle: '自分の数字で決める',
    scene: 'data',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '答えを教わるのは易しい。だが、自分の数字から自分で答えを出せて、初めて“読む目”だ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'きみが持っている数字を、一つ思い浮かべて――アプリの利用ログでも、家計でも、勉強時間でもいい。「問い→可視化→次の一手」を、自分の言葉でぼくに頼んで。',
          'アンタが持ってる数字を一つ思い浮かべろ――利用ログでも家計でも勉強時間でもいい。「問い→可視化→次の一手」を、自分の言葉で頼め。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 自分のデータを読む',
      goal: '自分が持つ何かのデータについて、「問いを立て→グラフで可視化→次の一手を提案」までをAIに頼もう。何のデータかは自由だ。',
      hint: '“何のデータか” ＋ “知りたい問い” ＋ “グラフで見せて次の一手まで” を入れて頼もう。',
      learn: 'データは「問いを立て、可視化し、次の一手を決める」まで使う――それが数字を味方にする読む目。',
      placeholder: '例）この半年の自分の勉強時間のデータで、曜日ごとの傾向を折れ線グラフにして。どこを増やせば伸びそうか、次の一手も提案して。',
      keywords: ['データ', '問い', 'グラフ', '可視化', '分析', '傾向', '次の一手', 'ダッシュボード', '推移', '提案'],
      minKeywords: 2,
      sampleAnswer: 'この半年の自分の勉強時間データで、曜日ごとの傾向を折れ線グラフにして。どこを増やせば伸びそうか、次の一手も提案して。',
      successResponse:
        'いいね、その通りにしたよ。きみの数字が、問いに答え、グラフになり、次の一手まで照らし出した。もう数字はただの山じゃない。きみを導く地図だ。それを読む目を、きみは自分のものにした。',
      artifact: { title: 'あなたのデータ → 決断', kind: 'note', body: ['❓ 問いを立てた', '📈 可視化で傾向を発見', '➡ 次の一手が決まった'], fixed: true },
    },
    outro: [
      {
        narration: true,
        text: '白い霧が晴れわたり、無数の数字が、進むべき道を指す一本の光になった。ノイズの惑わしは、もうきみの目を曇らせない。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '作る、繋ぐ、届ける、規模に耐える、壊れを防ぐ、数字で決める……ぜんぶ、きみの手の中だ。',
          '作る、繋ぐ、届ける、規模に耐える、壊れを防ぐ、数字で決める……全部アンタの手の中だ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '……すべての力が、本当に揃った。次でいよいよ、創造の核――OVERSEER と向き合う。行くぞ、一人前。',
      },
    ],
  };

  return {
    id: 'ch8',
    title: '第8章',
    subtitle: 'データを読む ── 数字から決める',
    recap: 'テスト・型・CIで、変更しても壊れない仕組みを手に入れた。',
    keyTerms: ['data-analysis', 'chart', 'dashboard', 'kpi'],
    scene: 'data',
    boss: { name: 'ノイズ', glyph: 'fog', title: '惑わしの霧', blurb: '数字の山に紛れ、意味ありげな嘘で間違った判断へ誘う歪み。読む目を持たぬ者の視界を白く濁らせる。' },
    stages: [s1, s2, s3, s4],
  };
}
