import type { SceneId } from '../types';

/* =========================================================================
   シーン背景 — 黒一色をやめ、場面ごとに世界を見せる。
   多層パララックス（奥はゆっくり、手前は速く）でP5的な「常に動く」背景。
   後でAI生成の一枚絵に差し替えるなら imageSrc 版を足せばよい構造。
   ========================================================================= */

export type { SceneId };

export function SceneBackground({ scene }: { scene: SceneId }) {
  return (
    <div className={`scene scene--${scene}`} aria-hidden="true">
      {scene === 'void' && <VoidScene />}
      {scene === 'city' && <CityScene />}
      {scene === 'guild' && <GuildScene />}
      {scene === 'cyber' && <CyberScene />}
    </div>
  );
}

function VoidScene() {
  return (
    <>
      <div className="scene__wash scene__wash--void" />
      <div className="scene__stripes" />
      <div className="scene__burst" />
    </>
  );
}

/** ネオンの夜の街。深い藍〜紅の空にビル群とサイン。 */
function CityScene() {
  return (
    <>
      <div className="scene__wash scene__wash--city" />
      <div className="scene__stars" />
      {/* 遠景ビル（ゆっくり） */}
      <svg className="scene__sky-far" viewBox="0 0 520 300" preserveAspectRatio="xMidYMax slice">
        <g fill="#160e26">
          <rect x="10" y="150" width="40" height="150" />
          <rect x="60" y="110" width="34" height="190" />
          <rect x="104" y="170" width="48" height="130" />
          <rect x="166" y="90" width="30" height="210" />
          <rect x="210" y="140" width="52" height="160" />
          <rect x="276" y="120" width="36" height="180" />
          <rect x="324" y="165" width="46" height="135" />
          <rect x="384" y="100" width="32" height="200" />
          <rect x="430" y="150" width="50" height="150" />
        </g>
      </svg>
      {/* 近景ビル（手前・濃い）＋窓灯り */}
      <svg className="scene__sky-near" viewBox="0 0 520 300" preserveAspectRatio="xMidYMax slice">
        <g fill="#0a0612">
          <rect x="-10" y="190" width="80" height="120" />
          <rect x="80" y="150" width="70" height="160" />
          <rect x="160" y="210" width="90" height="100" />
          <rect x="260" y="160" width="64" height="150" />
          <rect x="334" y="200" width="96" height="110" />
          <rect x="440" y="170" width="90" height="140" />
        </g>
        <g className="scene__windows" fill="var(--accent)">
          <rect x="92" y="168" width="6" height="8" />
          <rect x="106" y="168" width="6" height="8" />
          <rect x="92" y="186" width="6" height="8" />
          <rect x="276" y="178" width="6" height="9" />
          <rect x="290" y="178" width="6" height="9" />
          <rect x="276" y="198" width="6" height="9" />
          <rect x="458" y="190" width="6" height="9" />
          <rect x="472" y="190" width="6" height="9" />
        </g>
      </svg>
      {/* ネオンの光芒 */}
      <div className="scene__neon scene__neon--a" />
      <div className="scene__neon scene__neon--b" />
    </>
  );
}

/** ギルドの大広間。暖かい闇に紅の垂れ幕と紋章。 */
function GuildScene() {
  return (
    <>
      <div className="scene__wash scene__wash--guild" />
      {/* 中央の紋章（ゆっくり回転） */}
      <svg className="scene__emblem" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="86" fill="none" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="2" />
        <circle cx="100" cy="100" r="64" fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="4 10" />
        <polygon
          points="100,30 116,84 172,84 127,118 143,172 100,140 57,172 73,118 28,84 84,84"
          fill="var(--accent)"
          opacity="0.12"
        />
      </svg>
      {/* 左右の垂れ幕 */}
      <div className="scene__drape scene__drape--l" />
      <div className="scene__drape scene__drape--r" />
      <div className="scene__floor" />
    </>
  );
}

/** 電脳空間。奥へ流れるパースグリッドとデータライン。 */
function CyberScene() {
  return (
    <>
      <div className="scene__wash scene__wash--cyber" />
      <div className="scene__grid" />
      <div className="scene__datalines" />
      <div className="scene__neon scene__neon--c" />
    </>
  );
}
