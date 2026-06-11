// 改行修正後の主要画面スクショ → shots/linebreak/after/
// 使い方: PORT=5204 node scripts/shots-after.mjs [width]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = Number(process.argv[2] || 412);
const H = 915;
const PORT = process.env.PORT || 5204;
const BASE = `http://localhost:${PORT}`;
const OUT = 'shots/linebreak/after';
mkdirSync(OUT, { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const SAVE_3 = {
  editionId: 'claude',
  results: Object.fromEntries(
    ['c0s1', 'c0s2', 's1', 's2', 's3', 's4', 'ims1', 'ims2', 'ims2b', 'ims3', 'ims4', 'c2s1', 'c2s2', 'c2s3', 'c2s4', 'c3s1', 'c3s2', 'c3s3', 'c3s4'].map(
      (id) => [id, { cleared: true, score: 1, attempts: 1 }],
    ),
  ),
  learned: ['完璧じゃなくていい。まず言葉にして、試して、直す。', '相棒の喚び出し方'],
};

const SCREENS = [
  { name: 'title', url: '/' },
  { name: 'edition', url: '/?ed=claude&s=edition' },
  { name: 'opening-claude', url: '/?ed=claude&s=opening', taps: 6, sel: '.opening' },
  { name: 'story-ch0s1', url: '/?ed=claude&s=story-intro&ch=0&st=1', taps: 4, sel: '.story__stage' },
  { name: 'story-ch1s0-cursor', url: '/?ed=cursor&s=story-intro&ch=1&st=0', taps: 3, sel: '.story__stage' },
  { name: 'challenge-ch1st0', url: '/?ed=claude&s=challenge&ch=1&st=0', hint: true },
  { name: 'result-ch1', url: '/?ed=claude&s=result&ch=1&st=0' },
  { name: 'world-progress', url: '/', save: SAVE_3, click: 'text=つづきから', wait: 2400 },
  { name: 'codex-sheet', url: '/', save: SAVE_3, click: 'text=つづきから', wait: 2400, click2: 'text=📖 学びの記録' },
  { name: 'glossary-term', url: '/?ed=claude&s=world', click: '[aria-label="用語集をひらく"]', click2: '.sheet__row' },
  { name: 'stagemap-ch1', url: '/?ed=claude&s=map&ch=1', wait: 3400 },
  { name: 'clear-ch1', url: '/?ed=claude&s=chapter-clear&ch=1', wait: 3400 },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent: UA,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();

for (const s of SCREENS) {
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((d) => {
      localStorage.clear();
      if (d) localStorage.setItem('vibe-guild:save', JSON.stringify(d));
    }, s.save ?? null);
    await page.goto(`${BASE}${s.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(s.wait ?? 1400);
    if (s.click) {
      await page.locator(s.click).first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(900);
    }
    if (s.click2) {
      await page.locator(s.click2).first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(900);
    }
    if (s.taps) {
      for (let i = 0; i < s.taps; i++) {
        await page.locator(s.sel).first().click({ force: true, timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(420);
      }
    }
    if (s.hint) {
      await page.locator('.ch__hintbtn').first().click({ timeout: 2500 }).catch(() => {});
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: `${OUT}/${s.name}-w${W}.png` });
    console.log(`ok ${s.name}-w${W}`);
  } catch (e) {
    console.error(`[skip] ${s.name}: ${e.message}`);
  }
}
await browser.close();
