# VIBE GUILD ── バイブコーディング・ギルド

> 言葉で、ものを作る。AIと組んで依頼を解き、気づけば“作れる”自分になる──
> ペルソナ5風のダーク＆スタイリッシュな、**バイブコーディング学習ゲーム**。

スマホ（縦）専用。コード未経験者でも、ストーリーを読みながら遊ぶうちに
「AIへの指示の仕方」と「開発の基礎概念」が身につく。

## 特徴
- **2つの編**：CLAUDE編（思慮深い相棒クロード）／ CURSOR編（高速の相棒カーサ）。世界観もキャラも別物。
- **全7章・大きな敵 OVERSEER への物語**。各章に学習トピックとミニボス。
  1. 初依頼 ── プロンプト基礎 / 文脈 / デバッグ
  2. 記憶と航跡 ── メモリ / Git / GitHub（+Enterprise）
  3. 自動化 ── RPA / Playwright / Chromiumデバッグ起動
  4. 道具をつなぐ ── MCP / knowledge-work-plugins
  5. 世に放つ ── Electron / EXE・batch配布 / GitHub Pages
  6. 雲の力 ── GAS / GCP（Vertex AI・BigQuery・Cloud Run）/ Azure OpenAI
  - 最終章 ── 創造の核 OVERSEER との決戦
- **用語ヘルプ**：本文の専門用語をタップで、素人向けの説明をその場で表示（40語以上収録、常時開ける用語集つき）。
- **遊びやすさ**：序盤は選択式、慣れたら自由記述。間違えても何度でも、反復で学ぶ。
- **演出**：黒赤のP5風UI、斜めスラッシュ遷移、達成スティンガー、街/ギルド/電脳のシーン背景、フィルムグレイン。常に動く画面。
- **ゲームシステム**：進捗セーブ（つづきから）、ランク（S/A/B/C）、合成サウンドSFX、設定（サウンド/演出ON-OFF）。

## あそびかた（フロー）
タイトル → 編選択 → ワールドマップ（章選択）→ 章マップ（依頼選択）→
ストーリー → 依頼（課題）→ 結果 → 章クリア → ワールドへ。前章クリアで次章が解放。

## 技術
React + TypeScript + Vite / framer-motion / zustand。AI応答は現在シミュレーション
（`src/engine/ai.ts` の `AIProvider` を実装すれば本物の Claude API に差し替え可能）。
キャラ肖像はSVG（`CharacterPortrait` に `imageSrc` を渡せばAI生成イラストに差し替え可能）。

## 起動
```bash
npm install
npm run dev      # http://localhost:5173 （スマホは同一LANのIP:5173）
npm run build    # 本番ビルド
npm run preview  # ビルド結果の確認
```

## デバッグ用URL
`?ed=claude&s=challenge&ch=2` のように、編・画面・章を指定して任意の場面へ。
`?dbg=1` で横はみ出し検査オーバーレイ。

## 設計ドキュメント
- `PLAN.md` … 全体設計
- `VISUAL.md` … ペルソナ5ビジュアル基準
- `ROADMAP.md` … カリキュラム＆物語アーク

---
🤖 Built with vibe coding.
