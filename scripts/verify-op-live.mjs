// OPを実機幅(412)で“無操作”通し再生し、デモ成果物の「生命感」を複数フレームで撮る
// 使い方: node scripts/verify-op-live.mjs [claude|cursor]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const ED = process.argv[2] === 'cursor' ? 'cursor' : 'claude';
const BASE = 'http://localhost:5196';
mkdirSync('shots/redesign', { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 1.5,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE[error]:', m.text().slice(0, 160));
});

await page.goto(`${BASE}/?ed=${ED}&s=opening`, { waitUntil: 'networkidle' });

const shot = (name) => page.screenshot({ path: `shots/redesign/op-live-${ED}-${name}.png` });
const probe = () =>
  page.evaluate(() => ({
    game: !!document.querySelector('.opening__artifact .artifact__game'),
    dash: !!document.querySelector('.opening__artifact .artifact__dash'),
    web: !!document.querySelector('.opening__artifact .artifact__page'),
    toast: !!document.querySelector('.opening__artifact .artifact__toast'),
    finale: !!document.querySelector('.opening__finale'),
    score: document.querySelector('.opening__artifact .artifact__game-score')?.textContent ?? '',
    kpi: document.querySelector('.opening__artifact .artifact__dash-value')?.textContent ?? '',
  }));

// 指定キーが true になるまで存在ポーリング
async function until(key, maxMs = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    const st = await probe();
    if (st[key]) return st;
    await page.waitForTimeout(250);
  }
  console.log(`TIMEOUT: ${key}`);
  return null;
}

// ① ゲームデモ
let st = await until('game');
if (st) {
  await page.waitForTimeout(500);
  const a = (await probe()).score;
  await shot('game-f1');
  await page.waitForTimeout(700);
  await shot('game-f2');
  await page.waitForTimeout(700);
  const b = (await probe()).score;
  await shot('game-f3');
  console.log(`game score tick: "${a}" -> "${b}" ${a && b && a !== b ? 'OK' : 'NG'}`);
}

// ② ダッシュボード
st = await until('dash');
if (st) {
  await page.waitForTimeout(600);
  const a = (await probe()).kpi;
  await shot('dash-f1');
  await page.waitForTimeout(1100);
  await shot('dash-f2');
  await page.waitForTimeout(1100);
  const b = (await probe()).kpi;
  await shot('dash-f3');
  console.log(`kpi tick: "${a}" -> "${b}" ${a && b && a !== b ? 'OK' : 'NG'}`);
}

// ③ web（組み上がり→トースト）
st = await until('web');
if (st) {
  await page.waitForTimeout(300);
  await shot('web-f1');
  if (await until('toast', 8000)) {
    await page.waitForTimeout(300);
    await shot('web-f2');
  }
}

// ④ フィナーレ
st = await until('finale');
if (st) {
  await page.waitForTimeout(1200);
  await shot('finale');
}

const info = await page.evaluate(() => {
  const de = document.scrollingElement || document.documentElement;
  return { iw: window.innerWidth, sw: de.scrollWidth };
});
console.log(`[${ED}] overflow: ${info.sw > info.iw + 1 ? `NG(${info.sw})` : 'ok'}`);

await browser.close();
console.log(`done: shots/redesign/op-live-${ED}-*.png`);
