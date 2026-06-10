// 自動通しプレイ（回帰確認用）：タイトル→編選択→章→ステージを実際に操作して進行確認
// 使い方: node scripts/playthrough.mjs [width]
//   - CLAUDE編: 序章 → 第1章 → 幕間 → 第2章 まで通しプレイ
//   - CURSOR編: 序章 のみ
//   - 進行が止まる / コンソールエラー / ページエラー を検出したら最後にまとめて報告
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = Number(process.argv[2] || 412); // Pixel 8 Pro ≈ 412
const H = 915;
const BASE = process.argv[3] || 'http://localhost:5173';
mkdirSync('shots', { recursive: true });

// freeText 依頼を確実に通すための「具体的な頼み方」（各章のキーワードを網羅）
const FREE_ANSWER =
  'ボタンを押しても反応しないエラーを直して修正して。色を変えて大きく目立たせて、' +
  'GitHubのリポジトリにプッシュして公開、READMEも追加してコミットして。';

const problems = []; // { where, detail }
let where = 'boot';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

// コンソールエラー / 未捕捉例外 / リクエスト失敗を記録
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push({ where, detail: `console.error: ${msg.text()}` });
});
page.on('pageerror', (err) => problems.push({ where, detail: `pageerror: ${err.message}` }));
page.on('requestfailed', (req) => {
  // dev サーバ停止などのノイズは除き、アセット欠落を拾う
  const f = req.failure()?.errorText ?? '';
  if (!f.includes('ERR_ABORTED')) problems.push({ where, detail: `requestfailed: ${req.url()} (${f})` });
});
page.on('dialog', (d) => d.accept()); // ロック章の confirm 等は許可で進む

/** セレクタ出現を待つ（失敗は problems に積んで throw） */
async function expect(sel, timeout = 15000) {
  try {
    await page.waitForSelector(sel, { timeout });
  } catch {
    problems.push({ where, detail: `進行停止: ${sel} が ${timeout}ms 以内に現れない` });
    await page.screenshot({ path: `shots/stuck-${where.replace(/[^\w-]/g, '_')}.png` });
    throw new Error(`stuck at ${where}: ${sel}`);
  }
}

/** 会話パート：.story__stage をタップし続けて読み進める
 *  注意: 画面中央を押すと本文中の用語リンク（.term）に当たって用語集が開くことがあるため、
 *  端（左上）をタップする。万一シートが開いたら閉じて続行。 */
async function playStory(phase) {
  await expect('.story__stage');
  for (let i = 0; i < 240; i++) {
    // 用語集シートが開いてしまったら閉じる（本来はタップ位置の問題で開かない想定）
    if (await page.locator('.sheet__backdrop').count()) {
      await page.locator('.sheet__close').click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    const stage = page.locator('.story__stage');
    if ((await stage.count()) === 0) return;
    await stage.click({ timeout: 1500, position: { x: 12, y: 12 } }).catch(() => {});
    await page.waitForTimeout(280);
  }
  problems.push({ where, detail: `進行停止: ${phase} の会話が終わらない（240タップ超）` });
  throw new Error(`story loop at ${where}`);
}

/** 依頼パート：選択式は総当たり、自由記述はキーワード入りの文で突破 */
async function solveChallenge() {
  await expect('.screen.challenge');
  await page.waitForTimeout(900);
  for (let round = 0; round < 14; round++) {
    if (await page.locator('.ch__cleared').count()) break;
    if (await page.locator('.ch__choices').count()) {
      // 選択式：未選択（未 disabled）の先頭から順に試す
      const btn = page.locator('.ch__choices .abtn:not([disabled])').first();
      if (await btn.count()) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(1400);
        continue;
      }
    }
    if (await page.locator('.ch__compose').count()) {
      await page.fill('.ch__textarea', FREE_ANSWER);
      await page.locator('.ch__compose .abtn').click().catch(() => {});
      await page.waitForTimeout(1700);
      continue;
    }
    await page.waitForTimeout(500);
  }
  await expect('.ch__cleared .abtn', 10000);
  await page.locator('.ch__cleared .abtn').click(); // つづける ▶
}

/** 章マップから全ステージを通しでプレイ（リザルト後は自動で次ステージの会話へ） */
async function playChapter(label, stageCount) {
  where = `${label}/map`;
  await expect('.screen.map');
  await page.waitForTimeout(2700); // ボス前口上の演出待ち
  where = `${label}/enter-stage`;
  await expect('.node:not(.node--lock)');
  await page.locator('.node:not(.node--lock):not(.node--clear)').first().click();
  for (let s = 0; s < stageCount; s++) {
    where = `${label}/stage${s + 1}/intro`;
    await playStory('intro');
    where = `${label}/stage${s + 1}/challenge`;
    await solveChallenge();
    where = `${label}/stage${s + 1}/outro`;
    await playStory('outro');
    where = `${label}/stage${s + 1}/result`;
    await expect('.screen.result .abtn');
    await page.waitForTimeout(900);
    await page.locator('.screen.result .abtn').click(); // 次へ ▶
    await page.waitForTimeout(700);
  }
  where = `${label}/chapter-clear`;
  await expect('.screen.chapclear');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `shots/play-${label.replace(/[^\w-]/g, '_')}-clear.png` });
}

/** タイトル → 編選択（cardIndex: 0=CLAUDE / 1=CURSOR）→ ワールド → 章へ */
async function startEdition(label, cardIndex, chapterNodeIndex = 0) {
  where = `${label}/title`;
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await expect('.screen.title');
  // 「＋ はじめから」（セーブ有無でボタン数が変わるのでテキストで特定）
  await page.locator('.title__menu .abtn', { hasText: 'はじめから' }).click();
  where = `${label}/edition`;
  await expect('.edition__card');
  await page.locator('.edition__card').nth(cardIndex).click();
  where = `${label}/world`;
  await expect('.worldnode');
  await page.waitForTimeout(800);
  await page.locator('.worldnode').nth(chapterNodeIndex).click();
}

try {
  // ---- CLAUDE編: 序章 → 第1章 → 幕間 → 第2章 --------------------------
  await startEdition('claude', 0);
  await playChapter('claude-ch0', 2);
  await page.locator('.chapclear__btns .abtn').first().click(); // 次の章へ ▶
  await playChapter('claude-ch1', 4);
  await page.locator('.chapclear__btns .abtn').first().click();
  await playChapter('claude-interlude', 5);
  await page.locator('.chapclear__btns .abtn').first().click();
  await playChapter('claude-ch2', 4);

  // ---- CURSOR編: 序章のみ ---------------------------------------------
  await startEdition('cursor', 1);
  await playChapter('cursor-ch0', 2);

  console.log('PLAYTHROUGH COMPLETE');
} catch (e) {
  console.log(`PLAYTHROUGH ABORTED: ${e.message}`);
}

if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(`  [${p.where}] ${p.detail}`);
} else {
  console.log('PROBLEMS: none');
}

await browser.close();
process.exit(problems.length ? 1 : 0);
