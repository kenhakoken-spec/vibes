import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './store/gameStore';
import { bgm } from './engine/bgm';
import { TitleScreen } from './screens/TitleScreen';
import { EditionSelect } from './screens/EditionSelect';
import { WorldMap } from './screens/WorldMap';
import { StageMap } from './screens/StageMap';
import { StoryScene } from './screens/StoryScene';
import { ChallengeScreen } from './screens/ChallengeScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ChapterClear } from './screens/ChapterClear';
import { Particles } from './components/Particles';
import { SlashWipe } from './components/SlashWipe';
import { Glossary } from './components/Glossary';
import { SettingsPanel } from './components/SettingsPanel';
import { DebugSize } from './components/DebugSize';
import { SceneBackground, type SceneId } from './components/SceneBackground';
import type { Screen } from './types';
import './App.css';

/** 画面/ステージごとに見せる世界（背景）を決める */
function sceneFor(screen: Screen, stageScene?: SceneId): SceneId {
  switch (screen) {
    case 'title':
      return 'city';
    case 'edition':
      return 'void';
    case 'world':
      return 'city';
    case 'map':
      return 'guild';
    case 'story-intro':
    case 'story-outro':
      return stageScene ?? 'guild';
    case 'challenge':
      return 'cyber';
    case 'result':
      return 'guild';
    case 'chapter-clear':
      return 'city';
    default:
      return 'void';
  }
}

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('dbg');

export default function App() {
  const screen = useGame((s) => s.screen);
  const edition = useGame((s) => s.edition);

  // 編が決まったら、その色をテーマ全体に流し込む
  const themeVars = edition
    ? ({
        ['--accent' as string]: edition.accent,
        ['--accent-2' as string]: edition.accent2,
        ['--accent-soft' as string]: edition.accent + '26',
      } as React.CSSProperties)
    : undefined;

  const showGlossButton = !['title', 'edition'].includes(screen);
  const stageScene = useGame((s) => s.currentStage()?.scene);
  const chapterIndex = useGame((s) => s.chapterIndex);
  const stageIndex = useGame((s) => s.stageIndex);
  const scene = sceneFor(screen, stageScene);
  // ステージ毎に確実に再マウントさせ、前の文言が残らないようにする
  const stageKey = `${chapterIndex}-${stageIndex}`;

  // 画面に応じてBGMの雰囲気を切り替え（依頼/ボスは緊張感）
  useEffect(() => {
    if (screen === 'title') {
      bgm.stop();
      return;
    }
    bgm.start(screen === 'challenge' ? 'tense' : 'calm');
  }, [screen]);

  return (
    <div className="app" style={themeVars}>
      {/* 背景はクロスフェードで切替（瞬間切替のちらつき防止） */}
      <AnimatePresence>
        <motion.div
          key={scene}
          className="scene-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SceneBackground scene={scene} />
        </motion.div>
      </AnimatePresence>
      <Particles />

      <AnimatePresence>
        {screen === 'title' && <TitleScreen key="title" />}
        {screen === 'edition' && <EditionSelect key="edition" />}
        {screen === 'world' && <WorldMap key="world" />}
        {screen === 'map' && <StageMap key="map" />}
        {screen === 'story-intro' && <StoryScene key={`intro-${stageKey}`} phase="intro" />}
        {screen === 'challenge' && <ChallengeScreen key={`challenge-${stageKey}`} />}
        {screen === 'story-outro' && <StoryScene key={`outro-${stageKey}`} phase="outro" />}
        {screen === 'result' && <ResultScreen key="result" />}
        {screen === 'chapter-clear' && <ChapterClear key="chapclear" />}
      </AnimatePresence>

      {/* 画面切替ごとに走る赤いスラッシュ（keyで再生） */}
      <SlashWipe key={screen} />

      {/* 印刷物の質感（グレイン/網点/ビネット） */}
      <div className="fx" aria-hidden="true">
        <div className="fx__grain" />
        <div className="fx__halftone" />
        <div className="fx__vignette" />
      </div>

      <Glossary showButton={showGlossButton} />
      <SettingsPanel />
      {DEBUG && <DebugSize />}

      <div className="rotate-hint">
        <div>
          <div className="rotate-hint__icon">📱</div>
          <p className="head">スマホを縦にして遊んでね</p>
        </div>
      </div>
    </div>
  );
}
