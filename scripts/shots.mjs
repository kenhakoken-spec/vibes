// 実機相当のスマホ・エミュレーションでスクショ＋はみ出し/縦スクロール検査（Playwright）
// 使い方: node scripts/shots.mjs [width]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = Number(process.argv[2] || 412); // Pixel 8 Pro ≈ 412
const H = 915;
const BASE = 'http://localhost:5173';
mkdirSync('shots', { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const shots = [
  { name: 'title', url: `${BASE}/`, taps: 0 },
  { name: 'edition', url: `${BASE}/?ed=claude&s=edition`, taps: 0 },
  { name: 'world', url: `${BASE}/?ed=cursor&s=world`, taps: 0 },
  { name: 'map', url: `${BASE}/?ed=cursor&s=map&ch=1`, taps: 0, wait: 2600 },
  { name: 'story1', url: `${BASE}/?ed=cursor&s=story-intro&ch=1`, taps: 1 },
  { name: 'story2', url: `${BASE}/?ed=claude&s=story-intro&ch=3`, taps: 2 },
  { name: 'challenge', url: `${BASE}/?ed=claude&s=challenge&ch=0`, taps: 0 },
  { name: 'result', url: `${BASE}/?ed=claude&s=result&ch=0`, taps: 0 },
  { name: 'chapclear', url: `${BASE}/?ed=claude&s=chapter-clear&ch=0`, taps: 0, wait: 2600 },
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
  for (let i = 0; i < (s.taps || 0); i++) {
    await page.locator('.story__stage').click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(1300);
  }
  const info = await page.evaluate(() => {
    const iw = window.innerWidth;
    const ih = window.innerHeight;
    const offenders = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > iw + 0.5 && r.width > 0 && r.width < iw * 2) {
        const c = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
        offenders.push(`${el.tagName.toLowerCase()}.${c}→${Math.round(r.right)}`);
      }
    });
    // 縦スクロールが要る画面か（一番内側のスクロール要素含む）
    const de = document.scrollingElement || document.documentElement;
    return {
      iw,
      ih,
      docScrollW: de.scrollWidth,
      vScroll: de.scrollHeight - ih,
      offenders: offenders.slice(0, 5),
    };
  });
  const flags = [];
  if (info.docScrollW > info.iw + 1) flags.push(`HOVERFLOW(${info.docScrollW})`);
  if (info.offenders.length) flags.push(`RIGHT: ${info.offenders.join(',')}`);
  if (info.vScroll > 2) flags.push(`VSCROLL+${info.vScroll}`);
  console.log(`[${W}] ${s.name}: ${flags.length ? flags.join(' | ') : 'ok'}`);
  await page.screenshot({ path: `shots/${W}-${s.name}.png` });
}

await browser.close();
