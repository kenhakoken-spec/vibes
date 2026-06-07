// 実機エミュで全画面を監査：横はみ出し / 画面内スクロール / 文字の見切れ
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const W = Number(process.argv[2] || 412);
mkdirSync('shots', { recursive: true });
const BASE = 'http://localhost:5173';

const targets = [
  ['title', `${BASE}/`, 0],
  ['edition', `${BASE}/?ed=claude&s=edition`, 0],
  ['world', `${BASE}/?ed=cursor&s=world`, 0],
  ['map-interlude', `${BASE}/?ed=cursor&s=map&ch=2`, 0],
  ['story-i2b', `${BASE}/?ed=cursor&s=story-intro&ch=2&st=2`, 2],
  ['ch-models', `${BASE}/?ed=claude&s=challenge&ch=2&st=3`, 0],
  ['ch-setup', `${BASE}/?ed=claude&s=challenge&ch=0&st=1`, 0],
  ['ch-cloud', `${BASE}/?ed=claude&s=challenge&ch=7&st=1`, 0],
  ['result', `${BASE}/?ed=claude&s=result&ch=1`, 0],
  ['chapclear', `${BASE}/?ed=claude&s=chapter-clear&ch=1`, 0],
];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();

for (const [name, url, taps] of targets) {
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(name.startsWith('map') ? 2600 : 1600);
  for (let i = 0; i < taps; i++) {
    await p.locator('.story__stage').click({ timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(1200);
  }
  const info = await p.evaluate(() => {
    const iw = innerWidth;
    const de = document.scrollingElement || document.documentElement;
    const screen = document.querySelector('.screen');
    const log = document.querySelector('.ch__log');
    const clipSel = ['.chip', '.story__name', '.dgm__title', '.abtn__label', '.node__title', '.worldnode__sub', '.bossbar__name', '.map__title', '.map__recap'];
    const clipped = [];
    clipSel.forEach((s) =>
      document.querySelectorAll(s).forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 2) clipped.push(`${s}(${el.scrollWidth}>${el.clientWidth})`);
      }),
    );
    return {
      iw,
      hover: de.scrollWidth - iw,
      screenV: screen ? screen.scrollHeight - screen.clientHeight : 0,
      logV: log ? log.scrollHeight - log.clientHeight : 0,
      clipped: [...new Set(clipped)],
    };
  });
  const f = [];
  if (info.hover > 1) f.push(`HOVERFLOW+${info.hover}`);
  if (info.screenV > 4) f.push(`screenScroll+${info.screenV}`);
  if (info.logV > 4) f.push(`logScroll+${info.logV}`);
  if (info.clipped.length) f.push(`CLIP: ${info.clipped.join(',')}`);
  console.log(`[${W}] ${name}: ${f.length ? f.join(' | ') : 'ok'}`);
  await p.screenshot({ path: `shots/${W}-${name}.png` });
}
await b.close();
console.log('audit done');
