/* =========================================================================
   Core domain types for VIBE GUILD
   ========================================================================= */

export type EditionId = 'claude' | 'cursor';

export type PortraitVariant = 'claude' | 'cursor' | 'mentor' | 'hero';

/** A speaking / appearing character. */
export interface Character {
  id: string;
  name: string;
  role: string;
  /** which SVG portrait to render */
  portrait: PortraitVariant;
  /** accent color for the nameplate */
  color: string;
}

/** A playable "route" chosen on the title screen. */
export interface Edition {
  id: EditionId;
  /** e.g. "CLAUDE 編" */
  label: string;
  tagline: string;
  description: string;
  /** main accent color, drives the whole theme */
  accent: string;
  accent2: string;
  /** the anthropomorphised AI partner */
  partner: Character;
  /** the guild master / mentor */
  mentor: Character;
  /** flavor word shown around the UI */
  guildName: string;
  /** 初見でも“何の編か”が分かる技術的な一言 */
  techNote: string;
}

/** 立ち絵の表情。眉と口で感情を出し分ける。 */
export type Expression = 'neutral' | 'smile' | 'serious' | 'surprised' | 'worried';

/** One line of visual-novel dialogue. */
export interface DialogueLine {
  /** character id (resolved against the edition roster) or undefined for narration */
  speaker?: string;
  /** which portrait sits on screen for this line */
  portrait?: PortraitVariant;
  /** which side the speaker stands on */
  side?: 'left' | 'right';
  /** the spoken / narrated text (typewritered in) */
  text: string;
  /** narration (centered, no nameplate) */
  narration?: boolean;
  /** 立ち絵の表情（未指定なら本文から自動推定） */
  expr?: Expression;
  /** この行と同時に見せる成果物のカットイン（“言葉が形になる”演出用） */
  artifact?: ArtifactState;
}

export type ChallengeKind = 'choice' | 'freeText';

/** 構造説明用の図解の種類 */
export type DiagramKind =
  | 'setup-claude'
  | 'setup-cursor'
  | 'mcp'
  | 'git'
  | 'cloud'
  | 'vary'
  | 'models'
  | 'delegate'
  | 'web-parts'
  | 'rpa-flow'
  | 'ship-flow';

export interface ChoiceOption {
  id: string;
  text: string;
  correct: boolean;
  /** shown after the player picks this option */
  feedback: string;
}

/** 成果物の見せ方 */
export type ArtifactKind = 'web' | 'file' | 'terminal' | 'note' | 'game' | 'dashboard';

/** A snapshot of the artifact being built, shown in the live preview. */
export interface ArtifactState {
  title: string;
  /** lines of "what exists now" */
  body: string[];
  /** 描き分けの種類（省略時は title/body から推定） */
  kind?: ArtifactKind;
  hasButton?: boolean;
  buttonLabel?: string;
  fixed?: boolean;
  /** web: ボタン押下後のトースト文言（省略時は既定の入室メッセージ） */
  toast?: string;
}

export interface Challenge {
  kind: ChallengeKind;
  /** the guild request headline */
  brief: string;
  /** what the player has to accomplish, in plain words */
  goal: string;
  hint: string;
  /** one-line lesson the player walks away with */
  learn: string;
  /** 構造説明の図解（任意）。課題画面に表示される */
  diagram?: DiagramKind;

  /* choice mode */
  question?: string;
  options?: ChoiceOption[];

  /* free-text mode */
  placeholder?: string;
  /** keywords that should appear in a good prompt */
  keywords?: string[];
  /** how many distinct keywords are required to pass */
  minKeywords?: number;
  /** a model answer revealed as a hint / after success */
  sampleAnswer?: string;

  /** the simulated "AI build result" shown on success */
  successResponse: string;
  /** how the live artifact looks after this stage clears */
  artifact: ArtifactState;
}

/** 場面背景の種類 */
export type SceneId = 'void' | 'city' | 'guild' | 'cyber' | 'archive' | 'factory' | 'sky' | 'lab' | 'data';

export interface Stage {
  id: string;
  title: string;
  subtitle: string;
  /** この物語パートで見せる背景（省略時は画面から自動） */
  scene?: SceneId;
  /** story before the challenge */
  intro: DialogueLine[];
  challenge: Challenge;
  /** story after the challenge clears */
  outro: DialogueLine[];
}

export type BossGlyphKind = 'mask' | 'chains' | 'wall' | 'silence' | 'wave' | 'overseer' | 'crack' | 'fog' | 'swarm' | 'static';

export interface BossInfo {
  name: string;
  title: string;
  blurb: string;
  /** ボス固有のシルエット種別（未指定なら汎用マスク） */
  glyph?: BossGlyphKind;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  /** ワールドマップ等で見せる背景 */
  scene?: SceneId;
  /** 章ボス（歪み） */
  boss?: BossInfo;
  /** 章の“依頼”一行。ワールドマップのノードに表示（依頼のスケール拡大＝成長の体感） */
  quest?: string;
  /**
   * 章クリアの余韻（静かな成長描写）。
   * world=世界の変化ナレ ／ partner=相棒の成長言及（数値・称号は禁句） ／ seed=次章への種（伏線）
   */
  afterword?: { world: string; partner: string; seed?: string };
  /** 章開始時に出す「前回までの振り返り」 */
  recap?: string;
  /** この章で学ぶ重要用語（glossaryのid）。コーデックスでタップ解説に使う */
  keyTerms?: string[];
  stages: Stage[];
}

/* ---- runtime / progress -------------------------------------------- */

export type Screen =
  | 'title'
  | 'edition'
  | 'opening'
  | 'world'
  | 'map'
  | 'story-intro'
  | 'challenge'
  | 'story-outro'
  | 'result'
  | 'chapter-clear';

export interface StageResult {
  cleared: boolean;
  /** 0..1 の品質（内部記録のみ。画面に数値・ランクは出さない＝新方針） */
  score: number;
  attempts: number;
}
