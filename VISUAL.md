# VIBE GUILD — ビジュアル基準（ペルソナ5像を固める）

> 出典: [Game UI Database: Persona 5](https://www.gameuidatabase.com/gameData.php?id=72) /
> [Atlus Reveals Design Secrets (Siliconera)](https://www.siliconera.com/atlus-reveals-design-secrets-behind-persona-5s-distinctive-ui/) /
> [P5 — A masterclass in UI Design (Medium)](https://medium.com/@marktan_98815/persona-5-a-masterclass-in-ui-design-6e0470d2020f)

## 5原則（必ず守る）
1. **色は赤・黒・白のみ。** 赤が主役（反逆の象徴）。サブ色は機能表示（成功=緑等）に限定。
2. **コミック＋グラフィティ。** 鋭角・斜めの厚いシェイプ、ハーフトーン網点、星形バースト、破れ縁の吹き出し、ランサムノート的レイヤー文字。
3. **多重スピードのモーション。** 背景はゆっくり、UIは速く。「常に何かが動いている」。静止画面を作らない。
4. **文字は大きく・斜体で飛び込む。** Anton等の極太コンデンス。skew(-8deg)前後。影でガツンと。
5. **中心線・対角線で視線誘導。** 余白も攻めの構図。

## モーションの型
- **背景**: 斜め網点＋ストライプが常時ドリフト。赤い粒子がゆっくり上昇。巨大な放射バーストが超低速回転。
- **遷移**: 赤い対角スラッシュが画面をワイプ（in/out）。0.4〜0.6sでキレよく。
- **強調/正解/クリア**: 星形コミックバースト爆発＋白フラッシュ＋「達成！」が回転・オーバーシュートで飛び込む（All-Out-Attack風）。
- **アイドル**: チップやボタンは微小に呼吸（scale/translate）。肖像はゆっくり上下。
- `prefers-reduced-motion` では全部静める。

## スマホ専用（PC非対応で割り切る）
- 高さは `100dvh`（svh/lvhフォールバック）。URLバー出入りで崩れない。
- `env(safe-area-inset-*)` でノッチ回避。
- **縦固定**。横向き時は「縦にしてね」オーバーレイ。
- 2カラムは廃止、全画面1カラム縦積み。内部は必要に応じてスクロール。
- タップ領域は最低44px。

## 用語ヘルプ
- 文中の専門用語（バグ/プロンプト/デバッグ等）を赤い点線で示し、タップでボトムシート（素人向け説明）。
- 画面右下に常時「？用語」ボタン。用語集一覧もそこから。
