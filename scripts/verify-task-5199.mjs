// 一括検証 (dev: http://localhost:5199)
// ① OP通し再生(両編)で成果物3連発の生命感 ② 序章クリア→World→第1章 導線
// ③ Result/ChapterClear の数値・ランク残骸 ④ WorldMapノード組版 ⑤ reduced-motion
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5199';
const OUT = 'shots/verify-5199';
mkdirSync(OUT, { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const browser = await chromium.launch();

async function newPage(width, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: 915 },
    deviceScaleFactor: width === 412 ? 2.625 : 3,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
    ...opts,
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('CONSOLE[error]:', m.text().slice(0, 160));
  });
  return { ctx, page };
}

const overflowCheck = (page) =>
  page.evaluate(() => {
    const de = document.scrollingElement || document.documentElement;
    return { iw: window.innerWidth, sw: de.scrollWidth };
  });

/* ========== ① OP通し再生（両編 / 412） ========== */
for (const ED of ['claude', 'cursor']) {
  const { ctx, page } = await newPage(412);
  await page.goto(`${BASE}/?ed=${ED}&s=opening`, { waitUntil: 'networkidle' });

  const shot = (name) => page.screenshot({ path: `${OUT}/op-${ED}-${name}.png` });
  const probe = () =>
    page.evaluate(() => ({
      game: !!document.querySelector('.opening__artifact .artifact__game'),
      dash: !!document.querySelector('.opening__artifact .artifact__dash'),
      web: !!document.querySelector('.opening__artifact .artifact__page'),
      toast: !!document.querySelector('.opening__artifact .artifact__toast'),
      finale: !!document.querySelector('.opening__finale'),
      stack: document.querySelectorAll('.opening__stack-item').length,
      score: document.querySelector('.opening__artifact .artifact__game-score')?.textContent ?? '',
      kpi: document.querySelector('.opening__artifact .artifact__dash-value')?.textContent ?? '',
      cmd: document.querySelector('.opening__cmd-text')?.textContent ?? '',
    }));
  async function until(key, maxMs = 90000) {
    const t0 = Date.now();
    while (Date.now() - t0 < maxMs) {
      const st = await probe();
      if (st[key]) return st;
      await page.waitForTimeout(250);
    }
    console.log(`[op/${ED}] TIMEOUT waiting: ${key}`);
    return null;
  }

  // デモ1: ゲーム（スコアが動くか）
  let st = await until('game');
  if (st) {
    await page.waitForTimeout(500);
    const a = (await probe()).score;
    await shot('game-f1');
    await page.waitForTimeout(900);
    const b = (await probe()).score;
    await shot('game-f2');
    console.log(`[op/${ED}] game score tick: "${a}" -> "${b}" ${a !== b ? 'ALIVE' : 'STATIC'}`);
  }
  // デモ2: ダッシュボード（KPIが動くか + スタック積み上げ）
  st = await until('dash');
  if (st) {
    await page.waitForTimeout(600);
    const a = (await probe()).kpi;
    await shot('dash-f1');
    await page.waitForTimeout(1300);
    const p2 = await probe();
    await shot('dash-f2');
    console.log(`[op/${ED}] kpi tick: "${a}" -> "${p2.kpi}" ${a !== p2.kpi ? 'ALIVE' : 'STATIC'} stack=${p2.stack}`);
  }
  // デモ3: Webページ（組み上がり→トースト）
  st = await until('web');
  if (st) {
    await page.waitForTimeout(400);
    const p3 = await probe();
    await shot('web-f1');
    const t = await until('toast', 9000);
    if (t) {
      await page.waitForTimeout(300);
      await shot('web-toast');
    }
    console.log(`[op/${ED}] web reveal: ok, toast=${t ? 'OK' : 'NG'} stack=${p3.stack}`);
  }
  // フィナーレ（ロゴ + 扉を開く）
  st = await until('finale');
  if (st) {
    await page.waitForTimeout(1300);
    await shot('finale');
    const hasEnter = await page.getByText('扉を開く').isVisible().catch(() => false);
    console.log(`[op/${ED}] finale: OK enterBtn=${hasEnter ? 'OK' : 'NG'}`);
  } else {
    console.log(`[op/${ED}] finale: NG (未到達)`);
  }
  const ov = await overflowCheck(page);
  console.log(`[op/${ED}] overflow: ${ov.sw > ov.iw + 1 ? `NG(${ov.sw}/${ov.iw})` : 'ok'}`);
  await ctx.close();
}

/* ========== ②④ 序章クリア→World→第1章 + WorldMapノード組版 (412/360) ========== */
for (const W of [412, 360]) {
  const { ctx, page } = await newPage(W);

  await page.goto(`${BASE}/?ed=claude&s=chapter-clear&ch=0`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3400);
  await page.screenshot({ path: `${OUT}/${W}-flow-1-chapclear0.png` });

  await page.getByText('次の章へ').click({ timeout: 5000 }).catch(() => console.log(`[${W}] NG: 「次の章へ」が見つからない`));
  await page.waitForTimeout(1600);
  const onWorld = await page.locator('.world__title').isVisible().catch(() => false);
  console.log(`[${W}] 序章クリア→次の章へ→WorldMap: ${onWorld ? 'OK' : 'NG'}`);
  await page.screenshot({ path: `${OUT}/${W}-flow-2-world.png` });

  page.once('dialog', (d) => d.accept());
  await page.locator('.worldnode', { hasText: '第1章' }).first().click({ timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1600);
  const onMap = await page.locator('.map').first().isVisible().catch(() => false);
  const ch1 = await page.evaluate(() => /第1章/.test(document.body.innerText));
  console.log(`[${W}] WorldMap→第1章ステージマップ: ${onMap && ch1 ? 'OK' : `NG (map=${onMap} ch1=${ch1})`}`);
  await page.screenshot({ path: `${OUT}/${W}-flow-3-ch1map.png` });

  // ④ WorldMapノード組版
  for (const ed of ['claude', 'cursor']) {
    await page.goto(`${BASE}/?ed=${ed}&s=world`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800);
    const info = await page.evaluate(() => {
      const broken = [];
      document.querySelectorAll('.worldnode .nobr').forEach((el) => {
        if (el.getClientRects().length > 1) broken.push(el.textContent);
      });
      const de = document.scrollingElement || document.documentElement;
      const iw = window.innerWidth;
      const offenders = [];
      document.querySelectorAll('.worldnode, .worldnode *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > iw + 0.5 && r.width > 0) {
          const c = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
          offenders.push(`${el.tagName.toLowerCase()}.${c}→${Math.round(r.right)}`);
        }
      });
      return { broken, offenders: offenders.slice(0, 5), nobr: document.querySelectorAll('.worldnode .nobr').length, sw: de.scrollWidth, iw };
    });
    console.log(
      `[${W}/${ed}] worldノード: nobr=${info.nobr} 語中折返し=${info.broken.length ? info.broken.join(',') : 'なし'} overflow=${info.offenders.join(',') || 'none'} sw=${info.sw}/${info.iw}`,
    );
    await page.screenshot({ path: `${OUT}/${W}-world-${ed}.png`, fullPage: true });
  }
  await ctx.close();
}

/* ========== ③ Result/ChapterClear 残骸検査（両編 / 412） ========== */
{
  const { ctx, page } = await newPage(412);
  const targets = [
    { name: 'result-claude-ch0', url: `${BASE}/?ed=claude&s=result&ch=0&st=1`, wait: 2400 },
    { name: 'result-cursor-ch0', url: `${BASE}/?ed=cursor&s=result&ch=0&st=1`, wait: 2400 },
    { name: 'result-claude-ch3', url: `${BASE}/?ed=claude&s=result&ch=3&st=0`, wait: 2400 },
    { name: 'chapclear-claude-ch1', url: `${BASE}/?ed=claude&s=chapter-clear&ch=1`, wait: 3400 },
    { name: 'chapclear-cursor-ch1', url: `${BASE}/?ed=cursor&s=chapter-clear&ch=1`, wait: 3400 },
  ];
  for (const t of targets) {
    await page.goto(t.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(t.wait);
    const info = await page.evaluate(() => {
      const text = document.body.innerText;
      const iw = window.innerWidth;
      const offenders = [];
      document.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > iw + 0.5 && r.width > 0 && r.width < iw * 2) {
          const c = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
          offenders.push(`${el.tagName.toLowerCase()}.${c}→${Math.round(r.right)}`);
        }
      });
      return {
        overflow: offenders.slice(0, 5),
        percent: (text.match(/\d+\s*%/g) ?? []).join(','),
        rank: (text.match(/ランク|総合評価|品質スコア|RANK|SCORE|POWER\s*GET|称号|バッジ|Lv\.?\s*\d|レベル\s*\d|EXP|経験値|pt\b|ポイント/gi) ?? []).join(','),
        bubble: document.querySelector('.afterword__bubble')?.innerText?.slice(0, 100) ?? '',
      };
    });
    console.log(
      `[③ ${t.name}] 残骸: percent=${info.percent || 'なし'} rank系=${info.rank || 'なし'} overflow=${info.overflow.join(',') || 'none'}`,
    );
    if (info.bubble) console.log(`  bubble: ${info.bubble.replace(/\n/g, ' / ')}`);
    await page.screenshot({ path: `${OUT}/412-${t.name}.png` });
  }
  await ctx.close();
}

/* ========== ⑤ reduced-motion で1画面（OPデモ+Result）破綻チェック ========== */
{
  const { ctx, page } = await newPage(412, { reducedMotion: 'reduce' });
  await page.goto(`${BASE}/?ed=claude&s=result&ch=0&st=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const ov = await overflowCheck(page);
  const visible = await page.evaluate(() => {
    const els = document.querySelectorAll('.screen *');
    let shown = 0;
    els.forEach((el) => {
      const s = getComputedStyle(el);
      if (s.opacity !== '0' && s.visibility !== 'hidden') shown += 1;
    });
    return { total: els.length, shown, text: document.body.innerText.length };
  });
  console.log(
    `[⑤ reduced-motion result] overflow=${ov.sw > ov.iw + 1 ? `NG(${ov.sw})` : 'ok'} 可視要素=${visible.shown}/${visible.total} textLen=${visible.text}`,
  );
  await page.screenshot({ path: `${OUT}/412-reduced-motion-result.png` });
  await ctx.close();
}

await browser.close();
console.log(`done: ${OUT}/`);
