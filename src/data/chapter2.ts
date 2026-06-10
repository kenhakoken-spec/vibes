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
    title: '記憶の書庫',
    subtitle: '忘れない仕組み',
    scene: 'archive',
    intro: [
      { narration: true, text: '初依頼をやり遂げ、思い込みの影も振り払った。動くページを、自分の言葉で創れた。――だが「創ったものを失う」恐怖を、きみはまだ知らない。' },
      {
        narration: true,
        text: v(
          'ギルドの書庫。棚という棚の文字が、霧に触れて次々と消えていく。',
          'アジトの資料庫。棚という棚の文字が、霧に触れて次々と消えていく。'
        ),
      },
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
        text: v(
          '対抗策は「メモリ」。大事な前提を書いて“育てて”おけば、ぼくは毎回そこから賢く始められる。何を残すかが鍵だ。',
          '対抗策は「メモリ」だ。大事な前提を書いて“育てて”おけば、アタシは毎回そこから賢く始められる。何を残すかが鍵だぜ。'
        ),
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
          text: v(
            '「このギルドのページは赤と黒のP5風デザインで作る」という決めごと。',
            '「このアジトのページは赤と黒のP5風デザインで作る」という決めごと。'
          ),
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
    title: '航跡を刻む',
    subtitle: 'いつでも戻れる',
    scene: 'archive',
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
        body: ['● メモリ機能を追加', v('● ギルド入室ページ 完成', '● アジト入室ページ 完成')],
      },
    },
    outro: [
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'いい習慣だ。Gitの航跡がある限り、きみの一歩は決して消えない。アムネシアの一番嫌う力だよ。',
          'いい習慣だ。Gitの航跡がある限り、アンタの一歩は決して消えない。アムネシアが一番嫌う力さ。'
        ),
      },
    ],
  };

  /* ---- STAGE 3 : GitHub（共有・公開、自由記述） ------------------- */
  const s3: Stage = {
    id: 'c2s3',
    title: '世界に刻む',
    subtitle: '共有という光',
    scene: 'archive',
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
      placeholder: v(
        '例）このギルドページをGitHubのリポジトリに上げて公開して。READMEに「P5風の学習ゲーム」と書いて。',
        '例）このアジトのページをGitHubのリポジトリに上げて公開して。READMEに「P5風の学習ゲーム」と書いて。'
      ),
      keywords: ['github', 'リポジトリ', '公開', 'readme', '共有', 'プッシュ', 'push', '上げ', 'コミット'],
      minKeywords: 2,
      sampleAnswer:
        'このプロジェクトをGitHubのリポジトリに上げて公開して。READMEに「バイブコーディングで作った学習ゲーム」と書いて。',
      successResponse: v(
        'リポジトリを作成し、コミットをプッシュして公開したよ。READMEも書いた。URLができた ── きみの航跡は、もう世界の誰でも見られる。',
        'リポジトリを作って、コミットをプッシュして公開した。READMEも書いといた。URLができたぜ ── アンタの航跡は、もう世界の誰でも見られる。'
      ),
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
        text: '見事だ。だが“分かった”と“できる”は別物だ。最後に、今のひと続きを自分の手でやってみろ。',
      },
    ],
  };

  /* ---- STAGE 4 : 応用練習（記憶・Git・GitHubを総動員、自由記述） ---- */
  const s4: Stage = {
    id: 'c2s4',
    title: '仕上げ',
    subtitle: '航跡を残す練習',
    scene: 'archive',
    intro: [
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: 'まだ霧の残り香がある。アムネシアを二度と寄せつけぬよう、今日の流れを自分の言葉で回してみせろ。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          '流れはシンプルだよ。何か手を加えて、こまめにコミットして、GitHubへ上げる――READMEも一言添えるといい。きみの“こうしたい”を、自由に言葉にして。',
          '流れは単純だ。ちょい手を加えて、こまめにコミット、GitHubに上げる――READMEも一言添えとけ。アンタの“こうしたい”を、自由にぶつけろ。'
        ),
      },
    ],
    challenge: {
      kind: 'freeText',
      brief: 'QUEST ── 自分で記録・共有',
      goal: 'ページに小さな変更を加えて、こまめにコミットし、GitHubへ上げて共有しよう。READMEの更新も添えると良い。自分の言葉でAIに頼もう。',
      hint: '“変更を加える” ＋ “コミットする” ＋ “GitHubに上げる/READMEを更新” を、自分の言葉でつなげて頼もう。',
      learn: 'メモリ・Git・GitHub――学んだ全部を一続きにすれば、成果は失われず世界に残る。',
      placeholder: '例）あいさつの下に一行足して、その変更をコミットして、GitHubに上げて。READMEに更新内容も書き足して。',
      keywords: ['コミット', 'git', 'github', '公開', 'readme', 'push', '上げ', '共有', '記録', 'プッシュ'],
      minKeywords: 2,
      sampleAnswer:
        'あいさつの下に一行足して、その変更をコミットして。終わったらGitHubに上げて、READMEにも更新内容を書き足して。',
      successResponse: v(
        'いいね、その通りに進めたよ。変更をコミットして、GitHubへプッシュ。READMEも更新した。新しい航跡が一本、世界に刻まれた――これがきみ自身の手で回せた一周だ。',
        'いいね、注文どおりに進めたぜ。変更をコミットして、GitHubへプッシュ。READMEも更新した。新しい航跡が一本、世界に刻まれた――これがアンタ自身の手で回せた一周だ。'
      ),
      artifact: {
        title: 'github.com/you/vibe-guild',
        body: ['● 変更をコミット', '● GitHubへプッシュ', '📄 README.md 更新', '✓ 共有しました'],
        fixed: true,
      },
    },
    outro: [
      {
        narration: true,
        text: '新しいコミットの光が、書庫の隅々まで届く。霧の残り香は、もうどこにも無い。',
      },
      {
        speaker: partnerId,
        portrait: partnerPortrait,
        side: 'right',
        text: v(
          'やったね。記憶し、記録し、共有する――その一周を、きみは自分の手で回した。もうアムネシアはきみに触れられない。',
          'やるじゃん。記憶して、記録して、共有する――その一周を自分の手で回したな。もうアムネシアはアンタに手出しできねぇ。'
        ),
      },
      {
        speaker: 'mentor',
        portrait: 'mentor',
        side: 'left',
        text: v(
          '……だが忘れるな。これらは皆、いずれ来る“あの存在”── OVERSEER に挑むための、ほんの足がかりに過ぎん。',
          '……だけど忘れるんじゃないよ。これは全部、いずれ来る“あの存在”── OVERSEER に挑むための、ほんの足がかりに過ぎないのさ。'
        ),
      },
    ],
  };

  return {
    id: 'ch2',
    title: '第2章',
    subtitle: '記憶と航跡 ── 失わないために',
    power: '失わない力',
    recap: '心得を学び、思い込みの影「ステレオ」を退けた。',
    keyTerms: ['memory', 'git', 'commit', 'repository', 'github', 'readme'],
    scene: 'archive',
    boss: {
      name: 'アムネシア',
      title: '健忘の亡霊',
      blurb: '進捗も文脈も消し去る霧。記憶と履歴を持たぬ者から、すべてを奪う。',
    },
    stages: [s1, s2, s3, s4],
  };
}
