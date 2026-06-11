// 一時スクリプト: 立ち絵v3検証（グリッド＋実ゲーム画面）。検証後に削除。
// 使い方: node scripts/pt-v3.mjs <round>   (dev サーバは 5201 で起動済みであること)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const ROUND = process.argv[2] || 'r1';
const BASE = 'http://localhost:5201';
const DIR = 'shots/portraits-v3';
mkdirSync(DIR, { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const browser = await chromium.launch();

// 1) 全キャラ×全表情グリッド（大きめ表示で顔の出来を判定）
{
  const page = await browser.newPage({ viewport: { width: 760, height: 880 }, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/pt-grid.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${DIR}/${ROUND}-grid.png`, fullPage: true });
  // 各キャラ neutral の単体クローズアップ
  for (let r = 0; r < 4; r++) {
    const cell = page.locator('.row').nth(r).locator('.cell').first();
    await cell.screenshot({ path: `${DIR}/${ROUND}-solo-${['claude', 'cursor', 'hero', 'mentor'][r]}.png` });
  }
  await page.close();
}

// 2) 実ゲーム画面（幅412・.story__portrait）— 各話者の初出をキャプチャ
for (const [ed, ch] of [['claude', 0], ['claude', 1], ['cursor', 0], ['cursor', 1]]) {
  const ctx = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?ed=${ed}&s=story-intro&ch=${ch}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const seen = new Set();
  for (let i = 0; i < 24; i++) {
    const name = await page
      .locator('.story__name')
      .textContent({ timeout: 600 })
      .catch(() => null);
    const hasPortrait = (await page.locator('.story__portrait').count()) > 0;
    if (name && hasPortrait && !seen.has(name)) {
      seen.add(name);
      const safe = name.replace(/[^\w぀-ヿ一-鿿]/g, '');
      await page.waitForTimeout(900); // タイプライタ・入場アニメ待ち
      await page
        .locator('.story__portrait')
        .first()
        .screenshot({ path: `${DIR}/${ROUND}-game-${ed}${ch}-${safe}.png` })
        .catch(() => {});
      await page.screenshot({ path: `${DIR}/${ROUND}-game-${ed}${ch}-${safe}-full.png` });
    }
    await page.locator('.story__stage').click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(450);
    // タイプ送り（1回目クリックはスキップなので、もう一度）
    await page.locator('.story__stage').click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(450);
    if ((await page.locator('.story__stage').count()) === 0) break;
  }
  console.log(`[${ed}] captured: ${[...seen].join(', ')}`);
  await ctx.close();
}

await browser.close();
console.log('done:', ROUND);
