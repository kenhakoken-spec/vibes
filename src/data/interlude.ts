import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   幕間「バイブコーディングの心得」
   実戦の前後で効いてくる“作法”を学ぶ。
   ・結果は毎回/人によって違う → 対応を変える
   ・強気で大きく任せて、自分のタスクを減らす
   ・モデルには種類がある → 使い分ける
   ・情報は更新され続ける → 学び続ける
   章ボス: 固定観念の影「ステレオ」。
   ========================================================================= */

export function buildInterlude(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  /* ---- i1: 結果は十人十色 ----------------------------------------- */
  const s1: Stage = {
    id: 'ims1',
    title: '幕間',
    subtitle: '十人十色の返し',
    scene: 'guild',
    intro: [
      { narration: true, text: '初依頼を越えたきみの前に、灰色の影が立ちはだかる。固定観念の影「ステレオ」。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'ステレオは“思い込み”でできた敵だ。技を覚える前に、こいつの囁きを振り払う「心得」を身につけろ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'まず一つ。ぼくは機械だけど、同じお願いでも毎回まったく同じ物を返すわけじゃない。人によっても、その時々でも、出てくる物は変わるんだ。',
          'まず一つ。アタシは機械だが、同じ注文でも毎回まったく同じ物を出すわけじゃない。人によっても、その時々でも、返りは変わる。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: 'だから大事なのは「返ってきた物を見て、次の頼み方を変える」こと。一回で完璧を狙うより、見て・直して・また頼む。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '心得 ── 返りは毎回ちがう',
      diagram: 'vary',
      goal: '同じプロンプトでも結果が違った。いちばん良い向き合い方を選ぼう。',
      hint: '結果は毎回・人によって違って当たり前。返りを見て“対応”を変えるのがコツ。',
      learn: '同じ頼みでも結果は毎回・人によって違う。返りを見て、頼み方や次の一手を変える。',
      question: '思ったのと違う物が返ってきた。どうする？',
      options: [
        {
          id: 'a',
          text: '返りを見て、足りない点を具体的に伝え直す／別の頼み方を試す。',
          correct: true,
          feedback: 'それだ。AIの返りは“たたき台”。見て対応を変えれば、どんどん理想に近づく。',
        },
        {
          id: 'b',
          text: 'AIが壊れていると決めつけて、諦める。',
          correct: false,
          feedback: '壊れてはいない。結果が毎回違うのは当たり前。怒らず、対応を変えればいい。',
        },
        {
          id: 'c',
          text: '毎回同じ結果になるはずと信じ、まったく同じ言葉で連打する。',
          correct: false,
          feedback: '同じ言葉でも返りは揺れる。だが“伝え方を変える”方が、ずっと早く近づく。',
        },
      ],
      successResponse:
        '返りを見て、足りない所だけ具体的に伝え直したら、一気に理想へ近づいた。ステレオの灰色が、少し薄れた。',
      artifact: { title: '心得①', body: ['結果は毎回・人で違う', '見て → 対応を変える'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '「一回で完璧」じゃなく「見て直す」。この姿勢が、これから全部の土台になるよ。',
      },
    ],
  };

  /* ---- i2: 強気で任せる ------------------------------------------- */
  const s2: Stage = {
    id: 'ims2',
    title: '幕間',
    subtitle: '強気で任せる',
    scene: 'guild',
    intro: [
      {
        speaker: 'hero',
        portrait: 'hero',
        side: 'right',
        text: '（細かいことまで、全部自分で指示して、自分で確かめなきゃ……。）',
      },
      {
        narration: true,
        text: 'ステレオが囁く。「面倒なことは、ぜんぶ自分の手でやれ。AIに大きな仕事を任せるな」。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'それは逆だよ。遠慮して小さくお願いするより、強気で大きく任せていい。「これ全部やって、できたら見せて」でいいんだ。',
          'それ逆だぜ。チマチマ頼むより、強気でドカッと任せろ。「これ全部やって、出来たら見せて」でいい。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'お前の仕事は“全部やること”じゃない。“何を作りたいか決めて、確認すること”だ。手は相棒に貸してもらえ。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '心得 ── 強気で任せる',
      diagram: 'delegate',
      goal: 'やることが10個ある。自分の負担を減らす、いちばん賢い任せ方は？',
      hint: '自分で抱え込まない。大きくまとめて任せ、自分は「決める・確認する」に集中。',
      learn: '遠慮せず強気で大きく任せ、自分のタスクを減らす。自分は“決めて確認する”役に。',
      question: 'タスク10個。どう進める？',
      options: [
        {
          id: 'a',
          text: '「この10個まとめてやって、できたら見せて」と強気で任せ、自分は確認に回る。',
          correct: true,
          feedback: '正解。大きく任せるほど自分の手数は減る。確認と方向づけに集中できる。',
        },
        {
          id: 'b',
          text: '1個ずつ全部、自分の手で実装していく。',
          correct: false,
          feedback: '時間も気力も足りなくなる。手を動かすのは相棒に任せていい。',
        },
        {
          id: 'c',
          text: '迷惑かなと遠慮して、ごく小さいことしか頼まない。',
          correct: false,
          feedback: '遠慮は不要。AIは頼まれるほど働く。強気でいい。',
        },
      ],
      successResponse:
        '「全部まとめて頼む」に切り替えたら、きみの手はぐっと空いた。空いた頭で“何を作るか”を考えられる。ステレオが顔をしかめる。',
      artifact: { title: '心得②', body: ['強気で大きく任せる', '自分は決める・確認する'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'いいね。きみが“何を作るか”に集中して、作業はぼくが引き受ける。それが一番速くて、一番遠くまで行ける。',
          'いいね。アンタは“何を作るか”に集中、作業はアタシが引き受ける。それが一番速くて遠くまで行ける。'
        ),
      },
    ],
  };

  /* ---- i2b: 「無理」で諦めない（壁は自分が外す） ------------------ */
  const s2b: Stage = {
    id: 'ims2b',
    title: '幕間',
    subtitle: '「無理」で諦めない',
    scene: 'guild',
    intro: [
      {
        narration: true,
        text: 'きみがある作業を頼むと、相棒が珍しく口ごもった。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '……ごめん、それは「権限（ログイン/認証）が無くて、ぼくだけではできない」んだ。',
          '……わりぃ、それ「権限（ログイン/認証）が足りなくて、アタシ単独じゃ無理」なんだ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'ここで引き下がるな。AIが「できない」と言う時、本当に不可能とは限らん。多くは“詰まっている一点”があるだけだ。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'その一点――認証や権限、必要な前提――を、お前が外してやればいい。「認証はこっちでやるから、その先を頼む」とな。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '心得 ── 壁は自分が外す',
      diagram: 'delegate',
      goal: 'AIが「権限が無くてできない」と言った。前に進める、いちばん良い対応は？',
      hint: '“できない理由＝詰まっている一点”を自分が外し、「ここはやったから続きを」と渡す。',
      learn: 'AIが「無理」と言っても諦めない。認証・権限・前提など“詰まり”を自分が外せば、続きは任せられる。',
      question: '相棒が「権限が無くて無理」。どうする？',
      options: [
        {
          id: 'a',
          text: '「認証(ログイン)はこっちでやるから、その後の部分をやって」と、詰まりを外して続きを任せる。',
          correct: true,
          feedback: 'それだ！「できない」の正体は“一点の詰まり”なことが多い。そこを自分が外せば、AIは一気に進める。',
        },
        {
          id: 'b',
          text: '「そっか、無理なんだ」とすぐ諦めて、自分で全部手作業する。',
          correct: false,
          feedback: 'もったいない。詰まりを一つ外すだけで進むことが多い。まず“何が要るのか”を聞いてみよう。',
        },
        {
          id: 'c',
          text: '同じ言葉で「やれ」「やれ」と連呼するだけ。',
          correct: false,
          feedback: '理由を解消しないと進まない。「何があればできる？」と聞き、その前提を渡すのが近道。',
        },
      ],
      successResponse:
        'きみが認証を済ませ「あとは任せた」と告げると、相棒は止まっていた作業を一気に駆け抜けた。「無理」は、ただの“詰まり”だった。',
      artifact: { title: '心得②+', body: ['「無理」は“詰まり”のサイン', '前提(認証/権限)を渡して続行'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '助かった。ぼくが詰まったら「何があればできる？」と聞いて。たいてい、その一点さえ渡してくれれば走れる。',
          '助かった。アタシが詰まったら「何があれば動ける？」って聞け。その一点さえ渡してくれりゃ走れる。'
        ),
      },
    ],
  };

  /* ---- i3: モデルを使い分ける ------------------------------------- */
  const s3: Stage = {
    id: 'ims3',
    title: '幕間',
    subtitle: 'モデルを選ぶ',
    scene: 'cyber',
    intro: [
      { narration: true, text: 'ステレオが嗤う。「AIなんて、どれも同じだろう」。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'それも思い込み。AIには“モデル”という種類がある。じっくり深く考えるもの、万能でバランス型、高速で軽いもの。ぼくにも複数の頭があるんだ。',
          'それも思い込みだ。AIには“モデル”って種類がある。深く考える奴、万能型、高速で軽い奴。アタシにも頭が何種類かある。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '右の図がイメージ。難しい設計は深いモデル、単純で大量な作業は軽いモデル。用途で選べば、速く・安く・賢く進む。',
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v('Claude Code でも使うモデルは選べる。', 'Cursor でも使うモデルは選べる。'),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '心得 ── モデルの使い分け',
      diagram: 'models',
      goal: '「複雑な設計をじっくり相談したい」。最適なモデルの選び方は？',
      hint: '難しい課題＝深く考えるモデル。単純で大量＝高速・軽量モデル。用途で選ぶ。',
      learn: 'モデルには種類がある（例: Opus=深い/Sonnet=万能/Haiku=高速）。課題に合わせて使い分ける。',
      question: '難しい設計の相談。どうする？',
      options: [
        {
          id: 'a',
          text: '深く考えるのが得意な上位モデル（例: Opus）を選ぶ。',
          correct: true,
          feedback: '正解。難問は深いモデル。逆に単純・大量の作業は軽量モデルで速く安く回す――この使い分けが効く。',
        },
        {
          id: 'b',
          text: 'どんな課題でも、いつも一番安い軽量モデルだけを使う。',
          correct: false,
          feedback: '軽量は速くて安いが、難問では浅くなりがち。重い課題は深いモデルに任せよう。',
        },
        {
          id: 'c',
          text: 'モデルは選べないと思い込み、何も変えない。',
          correct: false,
          feedback: 'Claude CodeもCursorもモデルを選べる。選べることを知っているだけで強い。',
        },
      ],
      successResponse:
        '課題に合わせてモデルを選んだら、相談がぐっと深く、速くなった。ステレオの輪郭が、崩れ始める。',
      artifact: { title: '心得③', body: ['モデルは種類がある', '用途で使い分ける'] },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '深く考えてほしい時、速さがほしい時。場面で頭を切り替える。これも立派な“指示の技術”だよ。',
      },
    ],
  };

  /* ---- i4: 学び続ける --------------------------------------------- */
  const s4: Stage = {
    id: 'ims4',
    title: '幕間',
    subtitle: '学び続ける',
    scene: 'cyber',
    intro: [
      {
        narration: true,
        text: 'ステレオが最後の囁きを放つ。「一度覚えたやり方を、一生変えるな。それが楽だ」。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'それが一番あぶない。この世界は、ツールも、ぼくのようなモデルも、機能も、毎週のように新しくなる。新しい情報が、どんどん出てくるんだ。',
          'それが一番ヤバい。ツールもアタシみたいなモデルも機能も、毎週みたいに新しくなる。新情報がどんどん湧いてくる。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '昨日の最適が、今日はもう古い。だから「最新を追って、やり方を更新し続ける人」が、いちばん強い。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: '心得 ── 学び続ける',
      goal: '半年前のやり方が最善だと思い込んでいる。どうするのが正解？',
      hint: 'ツールもモデルも日々進化。最新の機能・モデルを定期的に確認し、やり方を更新する。',
      learn: 'ツールもモデルも進化し続ける。最新を追い、やり方を更新し続ける人が強い。',
      question: 'やり方、更新してる？',
      options: [
        {
          id: 'a',
          text: '定期的に最新情報・新モデル・新機能を確認し、やり方を入れ替える。',
          correct: true,
          feedback: 'それだ。学び続ける姿勢こそ最強の武器。半年で世界はガラッと変わる。',
        },
        {
          id: 'b',
          text: '昔のやり方に固執して、新しい情報は見ない。',
          correct: false,
          feedback: 'それはステレオの罠。気づけば周りに置いていかれる。',
        },
        {
          id: 'c',
          text: '一度すべて丸暗記して、もう二度と調べない。',
          correct: false,
          feedback: '暗記は古くなる。大事なのは“調べ直して更新する”習慣のほう。',
        },
      ],
      successResponse:
        '「学び続ける」と決めた瞬間、ステレオの灰色が砕け散った。固定観念から解き放たれ、視界が一気に開ける。',
      artifact: { title: '心得④', body: ['情報は更新され続ける', '最新を追い、更新し続ける'] },
    },
    outro: [
      { narration: true, text: 'ステレオは消えた。きみはもう、思い込みに縛られない“しなやかな創り手”だ。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '心得は揃った。返りを見て直す。強気で任せる。モデルを選ぶ。学び続ける。――さあ、技の実戦へ戻ろう。',
      },
    ],
  };

  return {
    id: 'interlude',
    title: '幕間',
    subtitle: '心得 ── バイブコーディングの作法',
    recap: '初依頼で、自分の言葉からページを創り上げた。',
    keyTerms: ['model', 'opus', 'sonnet', 'haiku'],
    scene: 'guild',
    boss: {
      name: 'ステレオ',
      title: '固定観念の影',
      blurb: '「AIは毎回同じ」「自分でやれ」「知識は変わらない」と囁き、創り手を思い込みで縛る影。',
    },
    stages: [s1, s2, s2b, s3, s4],
  };
}
