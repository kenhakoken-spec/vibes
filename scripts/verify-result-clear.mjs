// 検証: ResultScreen(相棒の反応+feedback) / ChapterClear(労いフォールバック) を実機幅412で目視確認
// 使い方: node scripts/verify-result-clear.mjs  (dev server: http://localhost:5197)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = 412;
const H = 915;
const BASE = 'http://localhost:5197';
mkdirSync('shots', { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const shots = [
  { name: 'verify-result-claude', url: `${BASE}/?ed=claude&s=result&ch=0&st=1`, wait: 2200 },
  { name: 'verify-result-cursor', url: `${BASE}/?ed=cursor&s=result&ch=0&st=1`, wait: 2200 },
  { name: 'verify-chapclear-claude', url: `${BASE}/?ed=claude&s=chapter-clear&ch=0`, wait: 3200 },
  { name: 'verify-chapclear-cursor', url: `${BASE}/?ed=cursor&s=chapter-clear&ch=0`, wait: 3200 },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent: UA,
});
const page = await ctx.newPage();

for (const s of shots) {
  await page.goto(s.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(s.wait ?? 1600);
  const info = await page.evaluate(() => {
    const iw = window.innerWidth;
    const offenders = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > iw + 0.5 && r.width > 0 && r.width < iw * 2) {
        const c = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
        offenders.push(`${el.tagName.toLowerCase()}.${c}→${Math.round(r.right)}`);
      }
    });
    const text = document.body.innerText;
    return {
      overflow: offenders.slice(0, 5),
      hasPercent: /\d+\s*%/.test(text),
      hasRank: /ランク|総合評価|品質/.test(text),
      bubble: document.querySelector('.afterword__bubble')?.innerText?.slice(0, 120) ?? '(no bubble)',
    };
  });
  console.log(`[${s.name}] overflow=${info.overflow.join(',') || 'none'} percent=${info.hasPercent} rankWord=${info.hasRank}`);
  console.log(`  bubble: ${info.bubble.replace(/\n/g, ' / ')}`);
  await page.screenshot({ path: `shots/412-${s.name}.png`, fullPage: false });
}

await browser.close();
