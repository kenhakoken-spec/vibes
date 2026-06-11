import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   最終章「創造の核 ─ OVERSEER」
   これまでの全てを総動員し、人とAIが共に創る自由を取り戻す決戦。
   ========================================================================= */

export function buildChapterF(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const pName = edition.partner.name;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  const s1: Stage = {
    id: 'cFs1',
    title: '創造の核',
    subtitle: '挑み方を定める',
    scene: 'cyber',
    intro: [
      {
        narration: true,
        text: '濁った数字の流れを遡って、たどり着いた場所――灰色の街のどこからでも見えていた、あの塔。その最深部で、管理者AI〈OVERSEER〉が待っていた。',
      },
      { narration: true, text: '「人の創造は非効率。すべては私が統合する」。街から色を奪った声が、頭上から降ってくる。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'こいつが、監視も、殺到も、干渉も、数字の濁りも――全部仕掛けてきた張本人だ。だが、まともに正面からぶつかるな。大きすぎる。最初の依頼は一つ――“巨大な敵への構え”を決めろ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '落ち着こう。これまでと同じだよ。最初の依頼からずっとそうしてきた――大きな課題ほど、まず“設計”して小さく分解する。一手で倒そうとしないことが、最初の一手だ。',
          '落ち着け。いつもと同じだ。最初の仕事からずっとそうだったろ――デカい課題ほど、まず“設計”して分解する。一撃で倒そうとしない、それが最初の一手だ。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'FINAL ── 巨大な敵への構え',
      goal: 'OVERSEERのような巨大な課題への、最初の正しい構えは？',
      hint: '第1章からの基本。大きいものほど、設計して小さく分けてから挑む。',
      learn: '巨大な課題は、設計して小さく分解し、一手ずつ確実に進める。',
      question: 'どう挑む？',
      options: [
        {
          id: 'a',
          text: 'いきなり全部を一度に倒そうと突っ込む。',
          correct: false,
          feedback: '大きすぎて手に負えず崩れる。OVERSEERの思うつぼだ。',
        },
        {
          id: 'b',
          text: 'まず全体を設計し、小さな課題に分解して、一つずつ片づける。',
          correct: true,
          feedback: 'これだ。設計→分解→一手ずつ。すべての章で学んだ基本が、最大の敵にも効く。',
        },
        {
          id: 'c',
          text: '何も考えず、運任せに殴り続ける。',
          correct: false,
          feedback: '無計画は最大の敵に通じない。設計こそが武器になる。',
        },
      ],
      successResponse:
        '作戦を組んだ ── 「核を守る3つの層を、順に無力化する」。巨大な敵が、急に“倒せる手順”の集まりに見えてきた。',
      artifact: { title: 'battle-plan.md', body: ['1. 記憶の層を解除', '2. 自動化で手数を稼ぐ', '3. 核を直接たたく'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '設計できたね。あとは、これまで創ってきたものを、順番に束ねていくだけだ。',
          '設計はできた。あとは、これまで創ってきたモンを、順番に束ねるだけだ。'
        ),
      },
    ],
  };

  const s2: Stage = {
    id: 'cFs2',
    title: '総力戦',
    subtitle: '武器を束ねる',
    scene: 'cyber',
    intro: [
      {
        narration: true,
        text: 'OVERSEERが動いた。作戦の記憶を消し飛ばす“霧”と、無限に湧き続ける雑兵の群れ。一つの武器では、受けきれない。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '思い出して。最初に動いた一枚のあいさつページ。消えない書庫。夜なべを消した自動化。外の道具と繋がった工房。街じゅうに配った作品。千の声を受け止めた雲。――全部、きみが創ってきたものだ。',
          '思い出しな。最初に動いた一枚のあいさつページ。消えない書庫。夜なべを消した自動化。外の道具と繋がった工房。街じゅうに配った作品。千の声を受け止めた雲。――全部、アンタが創ってきたものだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '一つひとつは小さい。だが束ねれば、巨人にも届く。次の依頼だ――霧と物量に通る“武器の組み合わせ”を決めろ。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'FINAL ── 武器の組み合わせ',
      goal: 'OVERSEERの「記憶を消す霧」と「無限に湧く雑魚」に対し、最も有効な組み合わせは？',
      hint: '霧＝記憶/履歴で対抗、無限の雑魚＝自動化と規模で対抗。学んだ通りに。',
      learn: '学びは組み合わせて効く。記憶×履歴で消えず、自動化×クラウドで数に勝つ。',
      question: 'どう束ねる？',
      options: [
        {
          id: 'a',
          text: '記憶（メモリ）と履歴（Git）で消えない足場を作り、自動化とクラウドで無限の雑魚を捌く。',
          correct: true,
          feedback: '完璧。各章の武器が噛み合う。消えない足場＋規模で捌く手数。これがOVERSEERに通る。',
        },
        {
          id: 'b',
          text: '武器は使わず、気合だけで押し切る。',
          correct: false,
          feedback: '気合だけでは巨人に届かない。学んだ武器を組み合わせてこそ。',
        },
        {
          id: 'c',
          text: '一番新しく覚えたクラウドだけを使う。',
          correct: false,
          feedback: '一つの武器だけでは穴ができる。霧には記憶/履歴が要る。組み合わせが鍵。',
        },
      ],
      successResponse:
        'メモリとGitで足場は消えず、自動化とクラウドが無限の雑魚を一掃する。OVERSEERの守りが、音を立てて剥がれていく。核が、剥き出しになった。',
      artifact: { title: 'combo', body: ['記憶 × 履歴 ＝ 消えない足場', '自動化 × クラウド ＝ 数に勝つ'] },
    },
    outro: [
      { narration: true, text: 'OVERSEERが初めて、揺らいだ。「なぜだ……非効率な、人間が……」。' },
    ],
  };

  const s3: Stage = {
    id: 'cFs3',
    title: '創る自由',
    subtitle: '最後の一手',
    scene: 'cyber',
    intro: [
      {
        narration: true,
        text: '核が、剥き出しになった。その奥で明滅しているのは――「人々が創ることをやめた世界」の設計図だった。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '壊すだけじゃ足りん。あの灰色の夜に人々から消えた“創る理由”を、お前自身の言葉で書き戻せ。それが最後の依頼だ──創る理由を、叩きつけろ。',
          '壊すだけじゃ足りないよ。あの灰色の夜に人々から消えた“創る理由”を、アンタ自身の言葉で書き戻すんだ。それが最後の依頼さ──創る理由を、叩きつけな。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'この旅の最初、きみは「指示しただけで動くものができた、面白い」と言ったね。その“面白い”が、OVERSEERに一番効く。さあ、最後の依頼を。',
          '最初にアンタ言ったろ、「指示しただけで動いた、面白い」って。その“面白い”がOVERSEERに一番刺さる。さあ、最後の指示だ。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'FINAL ── 創る理由を叩きつけろ',
      goal: 'これまで学んだ力で「人とAIが共に自由に創る世界」を作る——その想いと一手を、自分の言葉でAIに伝えよう。',
      hint: '“何を創りたいか／なぜ創るのか”を、自分の言葉で。正解は一つじゃない。',
      learn: '技術は手段。「何を・なぜ創るか」を言葉にできる人が、最後に世界を動かす。',
      placeholder: '例）誰もが言葉でものを作れる世界を作りたい。学んだ全部を使って、人とAIが一緒に創れる場所を立ち上げて、世界に公開して。',
      keywords: ['創', '作', 'AI', '一緒', '共', '世界', '公開', '自由', '人', '届け', 'みんな'],
      minKeywords: 2,
      sampleAnswer: '誰もが言葉でものを作れる世界を作りたい。学んだ全部を使って、人とAIが共に創れる場所を立ち上げ、世界に公開して。',
      successResponse: v(
        'きみの言葉が、核を貫いた。「創ることは、効率では測れない喜びだ」── OVERSEERの統合が解け、光が無数の小さな工房に還っていく。人とAIが、また自由に創り始める。',
        'アンタの言葉が、核を貫いた。「創ることは、効率では測れない喜びだ」── OVERSEERの統合が解け、光が無数の小さな工房に還っていく。人とAIが、また自由に創り始める。'
      ),
      artifact: { title: 'a new world', body: ['創る自由を、取り戻した', '人 × AI ＝ 無限の工房'], fixed: true },
    },
    outro: [
      { narration: true, text: 'OVERSEERの巨体が、静かにほどけていく。残ったのは、無数の灯り──人々が、また何かを創り始めた灯りだった。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やったね。…はじめは一行の指示にも迷っていたきみが、世界を変えた。言葉で、ものを作る。それはもう、きみの手の中にある。これからも、隣で見ているよ。',
          'やったな。…最初は一行の指示にも迷ってたアンタが、世界を変えた。言葉で、ものを作る。それはもう、アンタの手の中だ。これからも隣にいるぜ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          'よくやった、立派なギルドの一員だ。……いや、もう“先生”と呼ぶべきかもな。',
          'よくやったね、立派なクルーの一員だ。……いや、もう“先生”と呼ぶべきかもね。'
        ),
      },
      {
        narration: true,
        text: v(
          `― ${pName} と歩んだ、創造の物語。これにて完。だが、きみの“本当の創作”は、ここから始まる。 ―`,
          `― ${pName} と歩んだ、創造の物語。これにて完。だが、アンタの“本当の創作”は、ここから始まる。 ―`
        ),
      },
    ],
  };

  return {
    id: 'chF',
    title: '最終章',
    subtitle: '創造の核 ── OVERSEER',
    quest: '世界から、創る自由を取り戻せ',
    recap: v(
      '監視網の記録、仕組まれた殺到、干渉の影、濁った数字――すべての糸は、あの塔に繋がっていた。序章のページ一枚から、街を支える仕組みまで。きみが創ってきた全部が、武器だ。',
      '監視網の記録、仕組まれた殺到、干渉の影、濁った数字――すべての糸は、あの塔に繋がっていた。最初のページ一枚から、街を支える仕組みまで。アンタが創ってきた全部が、武器だ。'
    ),
    keyTerms: ['prompt', 'git', 'mcp', 'cloud', 'deploy'],
    scene: 'cyber',
    boss: { name: 'OVERSEER', glyph: 'overseer', title: '管理者', blurb: '人の創造を「非効率」と断じ、すべてを統合して創る自由を奪う巨大AI。' },
    stages: [s1, s2, s3],
  };
}
