// 細部の目視確認用ズームショット：clip-pathの文字食われ・獲得済みバッジ・ComicBurst瞬間
// 使い方: node scripts/verify-zoom.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5173';
mkdirSync('shots', { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

// 序章+第1章クリア済みのセーブ（章1のステージidは s1〜s4）
const SAVE = {
  editionId: 'claude',
  results: Object.fromEntries(
    ['c0s1', 'c0s2', 's1', 's2', 's3', 's4'].map((id) => [id, { cleared: true, score: 1, attempts: 1 }]),
  ),
  learned: ['まず言葉にして試す'],
};

for (const W of [412, 360]) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: W, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
  });
  const page = await ctx.newPage();

  // 1) StageMap 章頭オリエンテーションのズーム（clip-path文字食われ確認）
  await page.goto(`${BASE}/?ed=claude&s=map&ch=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.locator('.map__orient').screenshot({ path: `shots/${W}-zoom-orient.png` }).catch((e) => console.log('orient:', e.message));

  // 2) ChapterClear: ComicBurst の瞬間（演出の出だし）
  await page.goto(`${BASE}/?ed=claude&s=chapter-clear&ch=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `shots/${W}-zoom-burst.png` });
  // POWER GET カットインのズーム
  await page.waitForTimeout(2200);
  await page.locator('.powerget').screenshot({ path: `shots/${W}-zoom-powerget.png` }).catch((e) => console.log('powerget:', e.message));

  // 3) WorldMap: セーブを注入して「つづきから」→ 獲得済みバッジの表示
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate((save) => localStorage.setItem('vibe-guild:save', JSON.stringify(save)), SAVE);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.getByText('つづきから').click({ timeout: 4000 }).catch((e) => console.log('continue:', e.message));
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const de = document.scrollingElement || document.documentElement;
    return { iw: window.innerWidth, sw: de.scrollWidth };
  });
  console.log(`[${W}] world(earned): scrollW=${info.sw} inner=${info.iw} ${info.sw === info.iw ? 'ok' : 'HOVERFLOW'}`);
  await page.screenshot({ path: `shots/${W}-zoom-world-earned.png` });
  await page.locator('.badgecase').screenshot({ path: `shots/${W}-zoom-badgecase.png` }).catch((e) => console.log('badgecase:', e.message));
  await page.evaluate(() => localStorage.removeItem('vibe-guild:save'));

  await browser.close();
}
console.log('done');
