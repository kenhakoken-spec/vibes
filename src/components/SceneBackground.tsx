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
      {scene === 'archive' && <ArchiveScene />}
      {scene === 'factory' && <FactoryScene />}
      {scene === 'sky' && <SkyScene />}
      {scene === 'lab' && <LabScene />}
      {scene === 'data' && <DataScene />}
    </div>
  );
}

/** 品質の検査場：補強された足場（青図）と、降りてくる検査の走査線、漂う✓。 */
function LabScene() {
  return (
    <>
      <div className="scene__wash scene__wash--lab" />
      {/* 補強された足場・梁（ブループリント） */}
      <svg className="scene__scaffold" viewBox="0 0 520 300" preserveAspectRatio="xMidYMid slice">
        <g stroke="#1d3a44" strokeWidth="3">
          <line x1="40" y1="0" x2="40" y2="300" />
          <line x1="180" y1="0" x2="180" y2="300" />
          <line x1="340" y1="0" x2="340" y2="300" />
          <line x1="480" y1="0" x2="480" y2="300" />
          <line x1="0" y1="70" x2="520" y2="70" />
          <line x1="0" y1="160" x2="520" y2="160" />
          <line x1="0" y1="250" x2="520" y2="250" />
        </g>
        {/* 筋交い（補強） */}
        <g stroke="#27525e" strokeWidth="2" strokeOpacity="0.7">
          <line x1="40" y1="70" x2="180" y2="160" />
          <line x1="180" y1="70" x2="40" y2="160" />
          <line x1="340" y1="160" x2="480" y2="250" />
          <line x1="480" y1="160" x2="340" y2="250" />
        </g>
      </svg>
      {/* 漂う合格チェック */}
      <svg className="scene__checks" viewBox="0 0 520 300" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="#3fe0a0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5">
          <path className="scene__check scene__check--a" d="M120 90 l10 12 l20 -26" />
          <path className="scene__check scene__check--b" d="M380 120 l10 12 l20 -26" />
          <path className="scene__check scene__check--c" d="M260 210 l10 12 l20 -26" />
        </g>
      </svg>
      {/* 検査の走査線 */}
      <div className="scene__scanline" />
    </>
  );
}

/** データの観測室：立ち上がる棒グラフ、上昇する折れ線、瞬く数値の星々。 */
function DataScene() {
  return (
    <>
      <div className="scene__wash scene__wash--data" />
      <div className="scene__stars" />
      <svg className="scene__charts" viewBox="0 0 520 300" preserveAspectRatio="xMidYMax slice">
        {/* 棒グラフ（下からせり上がる） */}
        <g className="scene__bars" fill="var(--accent)" fillOpacity="0.16">
          <rect className="scene__bar scene__bar--a" x="40" y="150" width="40" height="150" />
          <rect className="scene__bar scene__bar--b" x="110" y="110" width="40" height="190" />
          <rect className="scene__bar scene__bar--c" x="180" y="180" width="40" height="120" />
          <rect className="scene__bar scene__bar--b" x="250" y="90" width="40" height="210" />
          <rect className="scene__bar scene__bar--a" x="320" y="140" width="40" height="160" />
          <rect className="scene__bar scene__bar--c" x="390" y="70" width="40" height="230" />
          <rect className="scene__bar scene__bar--b" x="460" y="120" width="40" height="180" />
        </g>
        {/* 上昇する折れ線 */}
        <polyline
          className="scene__trend"
          points="20,230 90,200 160,210 230,150 300,170 370,100 440,120 510,60"
          fill="none"
          stroke="#5fb0ff"
          strokeWidth="3"
          strokeOpacity="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* 瞬く数値の星々 */}
      <div className="scene__datadots" />
    </>
  );
}

/** 記憶の書庫：そびえる本棚のシルエットと舞う埃 */
function ArchiveScene() {
  return (
    <>
      <div className="scene__wash scene__wash--archive" />
      <svg className="scene__shelves" viewBox="0 0 520 300" preserveAspectRatio="xMidYMax slice">
        <g fill="#120d08">
          {[10, 86, 162, 238, 314, 390, 466].map((x) => (
            <g key={x}>
              <rect x={x} y="20" width="64" height="280" />
              {[40, 78, 116, 154, 192, 230, 268].map((y) => (
                <rect key={y} x={x} y={y} width="64" height="6" fill="#241a10" />
              ))}
            </g>
          ))}
        </g>
      </svg>
      <div className="scene__motes" />
      <div className="scene__emblem-soft" />
    </>
  );
}

/** 自動人形の工房：歯車とパイプ、流れるベルト */
function FactoryScene() {
  return (
    <>
      <div className="scene__wash scene__wash--factory" />
      <svg className="scene__gears" viewBox="0 0 520 300" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="3">
          <circle className="scene__gear scene__gear--a" cx="90" cy="80" r="46" strokeDasharray="6 10" />
          <circle className="scene__gear scene__gear--b" cx="430" cy="220" r="62" strokeDasharray="8 12" />
          <circle className="scene__gear scene__gear--a" cx="380" cy="60" r="30" strokeDasharray="5 8" />
        </g>
        <g stroke="#1a1a22" strokeWidth="10">
          <line x1="0" y1="150" x2="520" y2="150" />
          <line x1="60" y1="0" x2="60" y2="300" strokeWidth="6" />
          <line x1="470" y1="0" x2="470" y2="300" strokeWidth="6" />
        </g>
      </svg>
      <div className="scene__belt" />
    </>
  );
}

/** 雲上のデータセンター：空のグラデと流れる雲・データ筋 */
function SkyScene() {
  return (
    <>
      <div className="scene__wash scene__wash--sky" />
      <div className="scene__stars" />
      <div className="scene__cloud scene__cloud--a" />
      <div className="scene__cloud scene__cloud--b" />
      <div className="scene__cloud scene__cloud--c" />
      <div className="scene__datalines" />
    </>
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
