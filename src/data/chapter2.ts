import type { Chapter, Edition, Stage } from '../types';

/* =========================================================================
   第2章「記憶と航跡」 — メモリ / Git / GitHub
   章ボス: 健忘の亡霊「アムネシア」── 進捗も文脈も消し去る霧。
   記憶（メモリ）と履歴（Git）で武装し、共有（GitHub）で世界に刻む。
   ========================================================================= */

export function buildChapter2(edition: Edition): Chapter {
  const partnerId = edition.partner.id;
  const partnerPortrait = edition.partner.portrait;
  const pName = edition.partner.name;
  const isClaude = edition.id === 'claude';
  const v = (claude: string, cursor: string) => (isClaude ? claude : cursor);

  /* ---- STAGE 1 : メモリ（記憶を育てる） ---------------------------- */
  const s1: Stage = {
    id: 'c2s1',
    index: 0,
    title: '記憶の書庫',
    subtitle: '忘れない仕組み',
    scene: 'guild',
    intro: [
      { narration: true, text: '初依頼を、やり遂げた。動くページを、自分の言葉で創れた。――だが「創ったものを失う」恐怖を、きみはまだ知らない。' },
      { narration: true, text: 'ギルドの書庫。棚という棚の文字が、霧に触れて次々と消えていく。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '出たな……「健忘の亡霊アムネシア」。触れたものの記憶を奪う。昨日の成果も、こいつの前では無かったことになる。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'ぼくにも弱点がある。会話が長くなったり日をまたぐと、前提を忘れてしまうことがあるんだ。アムネシアはそこを突いてくる。',
          'アタシも万能じゃない。話が長引くと前提を忘れることがある。アムネシアはそこに付け込んでくるタイプだ。'
        ),
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: '対抗策は「メモリ」。大事な前提を書いて“育てて”おけば、ぼくは毎回そこから賢く始められる。何を残すかが鍵だ。',
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 何を“記憶”に残す？',
      goal: 'AIのメモリに残すべき情報を選ぼう。毎回役立つ前提を残すのがコツ。',
      hint: '「次回以降もずっと役立つ前提」か？ 一度きりの雑談は残さない。',
      learn: '大事な前提は“メモリ”に書いて育てる。AIは毎回そこから賢く始められる。',
      question: `${pName}のメモリに残すなら、どれ？`,
      options: [
        {
          id: 'a',
          text: '「今日は天気がいいね」という今朝の雑談。',
          correct: false,
          feedback: '一度きりの雑談は残す価値が薄い。メモリが雑談で埋まると肝心な前提が霞む。',
        },
        {
          id: 'b',
          text: '「このギルドのページは赤と黒のP5風デザインで作る」という決めごと。',
          correct: true,
          feedback: '完璧。毎回効いてくる“プロジェクトの前提”。これを残すとAIは最初から方針を外さない。',
        },
        {
          id: 'c',
          text: 'パスワードやクレジットカード番号などの秘密。',
          correct: false,
          feedback: '危険。秘密情報はメモリに書かない。残すのは“判断に効く前提”だけ。',
        },
      ],
      successResponse:
        '「赤と黒のP5風デザインで作る」── 覚えたよ。次からはこの方針を前提に動く。霧が一枚、晴れた。',
      artifact: {
        title: 'memory.md',
        body: ['# 前提メモリ', '・赤と黒のP5風デザイン'],
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'メモリができた。これでぼくは「きみのプロジェクトを知っている相棒」になる。育てるほど強くなるよ。',
          'メモリ確保。これでアタシは「アンタの現場を分かってる相棒」だ。育てるほど切れ味が増す。'
        ),
      },
      { narration: true, text: 'アムネシアの霧が、ほんの少し後ずさった。' },
    ],
  };

  /* ---- STAGE 2 : Git（履歴＝セーブ） ------------------------------- */
  const s2: Stage = {
    id: 'c2s2',
    index: 1,
    title: '航跡を刻む',
    subtitle: 'いつでも戻れる',
    scene: 'cyber',
    intro: [
      { narration: true, text: 'アムネシアが反撃。作りかけのコードが、ぐにゃりと巻き戻り、壊れる。' },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'やられたか。だが慌てるな。航跡さえ残してあれば、いつでも前の地点に戻れる。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'それが「Git」。作業の区切りごとに状態を記録（コミット）しておけば、失敗しても巻き戻せる。ゲームのセーブと同じだよ。',
          '「Git」だ。区切りごとに記録（コミット）しとけば、爆発しても巻き戻せる。要はセーブ＆ロード。'
        ),
      },
    ],
    challenge: {
      kind: 'choice',
      brief: 'QUEST ── 巻き戻しに備える',
      diagram: 'git',
      goal: 'アムネシアの巻き戻し攻撃に備える、いちばん賢い習慣を選ぼう。',
      hint: '「区切り」で「こまめに」記録しておくと、被害を最小にできる。',
      learn: '区切りごとにコミット＝いつでも安全な地点に戻れる。失敗を恐れず試せる。',
      question: 'どう備える？',
      options: [
        {
          id: 'a',
          text: '全部完成してから一度だけ記録する。',
          correct: false,
          feedback: '途中で壊れたら全部やり直し。コミットは“こまめに区切って”が鉄則。',
        },
        {
          id: 'b',
          text: '機能が一つ動くたびに、メッセージを付けてコミットする。',
          correct: true,
          feedback: '見事。区切りごとの記録があれば、どこへでも安全に戻れる。実験も怖くない。',
        },
        {
          id: 'c',
          text: '記録は面倒だからしない。',
          correct: false,
          feedback: 'アムネシアの思うつぼ。記録ゼロは、巻き戻し一発で全消滅。',
        },
      ],
      successResponse:
        'コミットを刻んだ ── 「メモリ機能を追加」。これで巻き戻されても、この地点まで必ず戻れる。航跡は消えない。',
      artifact: {
        title: 'git log',
        body: ['● メモリ機能を追加', '● ギルド入室ページ 完成'],
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: 'いい習慣だ。Gitの航跡がある限り、きみの一歩は決して消えない。アムネシアの一番嫌う力だよ。',
      },
    ],
  };

  /* ---- STAGE 3 : GitHub（共有・公開、自由記述） ------------------- */
  const s3: Stage = {
    id: 'c2s3',
    index: 2,
    title: '世界に刻む',
    subtitle: '共有という光',
    scene: 'city',
    intro: [
      { narration: true, text: 'アムネシアが膨れ上がる。「記録など、お前一人の中で消えるもの」と嗤う。' },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'なら、世界に刻もう。「GitHub」に上げれば、きみの航跡はクラウドに残り、他の人とも共有できる。一人の記憶じゃ無くなる。',
          'だったら世界に置く。「GitHub」に上げりゃクラウドに残るし、他人とも共有できる。もう“一人の記憶”じゃない。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '会社規模なら GitHub Enterprise で仲間と安全に共有できる。さあ新人、自分の言葉で頼んでみろ。',
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── GitHubに公開せよ',
      goal: 'このプロジェクトをGitHubに上げて公開するよう、自分の言葉でAIに頼もう。READMEに何を書くかも添えると良い。',
      hint: '“GitHubに上げて/公開” ＋ “READMEに何を書くか” を入れて頼もう。',
      learn: '成果は共有して初めて価値が伝わる。GitHubで航跡を世界に残せる。',
      placeholder: '例）このギルドページをGitHubのリポジトリに上げて公開して。READMEに「P5風の学習ゲーム」と書いて。',
      keywords: ['github', 'リポジトリ', '公開', 'readme', '共有', 'プッシュ', 'push', '上げ', 'コミット'],
      minKeywords: 2,
      sampleAnswer:
        'このプロジェクトをGitHubのリポジトリに上げて公開して。READMEに「バイブコーディングで作った学習ゲーム」と書いて。',
      successResponse:
        'リポジトリを作成し、コミットをプッシュして公開したよ。READMEも書いた。URLができた ── きみの航跡は、もう世界の誰でも見られる。',
      artifact: {
        title: 'github.com/you/vibe-guild',
        body: ['📦 vibe-guild (public)', '📄 README.md', '✓ 公開しました'],
        fixed: true,
      },
    },
    outro: [
      {
        narration: true,
        text: '公開URLの光が、書庫いっぱいに広がる。アムネシアの霧が、その光に耐えきれず晴れていく。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やったね。記憶（メモリ）・履歴（Git）・共有（GitHub）。きみの成果は、もう二度と消えない。アムネシアは去った。',
          'やったな。メモリ・Git・GitHub。アンタの成果はもう消えない。アムネシアは退散だ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: '……だが忘れるな。これらは皆、いずれ来る“あの存在”── OVERSEER に挑むための、ほんの足がかりに過ぎん。',
      },
    ],
  };

  return {
    id: 'ch2',
    index: 1,
    title: '第2章',
    subtitle: '記憶と航跡 ── 失わないために',
    recap: '心得を学び、思い込みの影「ステレオ」を退けた。',
    scene: 'guild',
    boss: {
      name: 'アムネシア',
      title: '健忘の亡霊',
      blurb: '進捗も文脈も消し去る霧。記憶と履歴を持たぬ者から、すべてを奪う。',
    },
    stages: [s1, s2, s3],
  };
}
