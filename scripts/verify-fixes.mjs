// 修正検証: 編選択クリップ / ChapterClearリードとFAB / 冒頭フックのカットイン / POWER GETスロット / 新ボス紋章
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5183';
mkdirSync('shots/fixcheck', { recursive: true });
const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const browser = await chromium.launch();

async function ctxPage(W, H) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
  });
  return [ctx, await ctx.newPage()];
}

const results = [];

/* 1) 編選択: CLAUDE 編見出しが可視か（360/412） */
for (const [W, H] of [[360, 800], [412, 915]]) {
  const [ctx, page] = await ctxPage(W, H);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const btn = page.getByText('はじめから', { exact: false }).first();
  await btn.tap().catch(async () => { await btn.click(); });
  await page.waitForTimeout(2200);
  const d = await page.evaluate(() => {
    const cards = document.querySelector('.edition__cards');
    const cr = cards.getBoundingClientRect();
    const labels = [...document.querySelectorAll('.edition__label, .edition__card h3, .edition__card .display')]
      .map((el) => ({ text: el.textContent.slice(0, 12), top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom }));
    return { clipTop: cr.top, alignContent: getComputedStyle(cards).alignContent, scrollTop: cards.scrollTop, labels };
  });
  await page.screenshot({ path: `shots/fixcheck/edition-${W}.png` });
  results.push({ check: `edition-${W}`, ...d });
  await ctx.close();
}

/* 2) ChapterClear(360): リード文と glossfab の重なり / 学びリスト / POWER GET スロット */
for (const [ed, h] of [['claude', 861], ['cursor', 800]]) {
  const [ctx, page] = await ctxPage(360, h);
  await page.goto(`${BASE}/?ed=${ed}&s=chapter-clear&ch=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600);
  const d = await page.evaluate(() => {
    const fab = document.querySelector('.glossfab');
    const lead = document.querySelector('.chapclear__lead');
    const fr = fab?.getBoundingClientRect();
    const range = document.createRange();
    let maxRight = 0;
    if (lead) {
      for (const node of lead.childNodes) {
        if (node.nodeType === 3) {
          range.selectNodeContents(node);
          for (const r of range.getClientRects()) maxRight = Math.max(maxRight, r.right);
        }
      }
    }
    const slots = document.querySelectorAll('.powerget__slot').length;
    const lit = document.querySelectorAll('.powerget__slot.is-lit').length;
    const learned = document.querySelectorAll('.chapclear__learned li').length;
    const count = document.querySelector('.powerget__count')?.textContent ?? '';
    return { fabLeft: fr?.left, leadTextRight: maxRight, overlap: fr ? maxRight > fr.left : null, slots, lit, learned, count };
  });
  await page.screenshot({ path: `shots/fixcheck/clear-ch1-${ed}-360.png` });
  results.push({ check: `clear-ch1-${ed}`, ...d });
  await ctx.close();
}

/* 3) 冒頭フック: 序章S1の8行目でカットインが出るか */
{
  const [ctx, page] = await ctxPage(412, 915);
  await page.goto(`${BASE}/?ed=claude&s=story-intro&ch=0&st=0`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  for (let i = 0; i < 7; i++) {
    await page.locator('.story__stage').tap().catch(() => {});
    await page.locator('.story__stage').tap().catch(() => {}); // skip typewriter + advance
    await page.waitForTimeout(350);
  }
  await page.waitForTimeout(1400);
  const hasArtifact = await page.locator('.story__artifact .artifact').count();
  const counter = await page.locator('.story__count').textContent().catch(() => '');
  await page.screenshot({ path: `shots/fixcheck/hook-cutin.png` });
  results.push({ check: 'hook-cutin', hasArtifact, counter });
  await ctx.close();
}

/* 4) 新ボス紋章: ch1(スウォーム) / 幕間(ステレオ) のステージマップ */
for (const ch of [1, 2]) {
  const [ctx, page] = await ctxPage(412, 915);
  await page.goto(`${BASE}/?ed=claude&s=map&ch=${ch}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000); // BossIntro が消えるのを待つ
  const bossName = await page.locator('.bossbar__name').textContent().catch(() => '');
  const orient = await page.locator('.map__orient').textContent().catch(() => '');
  await page.screenshot({ path: `shots/fixcheck/map-ch${ch}.png` });
  results.push({ check: `map-ch${ch}`, bossName: bossName?.slice(0, 30), orient: orient?.slice(0, 80) });
  await ctx.close();
}

console.log(JSON.stringify(results, null, 1));
await browser.close();
