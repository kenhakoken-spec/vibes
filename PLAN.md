# VIBE GUILD — 開発計画書

バイブコーディングを“遊びながら”学べる、ペルソナ5風のストーリーゲーム。

## コンセプト
近未来、開発が〈ギルド〉に集約された街。プレイヤーは新人エンジニアとして、
擬人化したAIの相棒と組み、依頼（クエスト）を解きながら「言葉でものを作る力」を
身につけていく。章を終えるたびに、実際に動く成果物が一つ完成している。

## 確定仕様
| 項目 | 決定 |
|---|---|
| 技術 | React + TypeScript + Vite / framer-motion / zustand |
| ビジュアル | P5風・黒赤ダーク。CSS + SVGでスタイライズド（AI生成絵に差し替え可能な構造） |
| コア体験 | 序盤＝選択式プロンプト → 後半＝自由記述。AI応答はシミュレーション（本物API差し替え可能） |
| 2つの編 | Claude編／Cursor編。世界観・相棒・トーンが別物。初期選択 |
| 対象 | コード未経験の初心者 |
| 学べる事 | 開発の基礎概念 ＋ AIへの指示の仕方 |
| 世界観 | 近未来の開発ギルド。AIは擬人化した相棒キャラ |

## 第1章（実装済み・MVP）「初依頼」3ステージ
1. **プロンプトの基礎**（選択）— 「何を・どうなってほしいか」を具体的に伝える
2. **文脈を与える**（選択）— 「どれに・どこに・何を」を補って指示する
3. **デバッグ＝反復改善**（自由記述）— 症状と期待を伝え、何度でも直す

→ クリアすると「動くギルド入室ページ」が完成する。

## アーキテクチャ
```
src/
  types.ts                 ドメイン型
  store/gameStore.ts       zustand：画面遷移・進捗・習得スキル
  data/
    editions.ts            Claude編/Cursor編とキャラ定義
    chapter1.ts            第1章の台詞・課題・模擬応答（編で出し分け）
  engine/
    ai.ts                  AIProvider（差し替え可能）／SimulatedProvider
    rank.ts                スコア→ランク（S/A/B/C）
  components/              CharacterPortrait(SVG) / AngledButton / ArtifactPreview
  hooks/useTypewriter.ts   ビジュアルノベル風のタイプライタ
  screens/                 Title / EditionSelect / StageMap / Story / Challenge / Result / ChapterClear
```

## 拡張ポイント（“差し替え可能”な設計）
- **本物のClaude API**: `engine/ai.ts` の `AIProvider` を実装した `ClaudeProvider` を作り、
  末尾の `export const ai` を差し替えるだけ。判定（keyword方式）→ LLM評価に置換可能。
- **AI生成キャラ絵**: `CharacterPortrait` に `imageSrc` を渡せばSVGから画像に切替。
- **新しい章**: `data/chapterN.ts` を追加し、ストアの章ロードを拡張するだけ。

## ロードマップ（今後）
- [ ] 第2章：タスク分解／複数ファイルの概念（自由記述比率UP）
- [ ] 第3章：テストとGit、安全なやり直し
- [ ] 進捗のローカル保存（localStorage / zustand persist）
- [ ] 効果音・BGM（P5風ジングル）、画面遷移トランジションの強化
- [ ] 本物のClaude APIモード（任意でON）
- [ ] AI生成イラストへの差し替え
- [ ] Cloudflare tunnelでモバイル公開

## 起動
```bash
cd C:\tools\... もしくは C:\Users\kenha\vibe-guild
npm install
npm run dev     # http://localhost:5173
npm run build   # 本番ビルド
```
