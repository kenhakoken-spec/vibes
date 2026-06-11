// 検証: 1) 序章クリア→「次の章へ」→WorldMap経由→第1章へ の導線
//       2) WorldMapノードのカタカナ複合語が語中で折り返されない（.nobr が1行に収まる）
// 使い方: node scripts/verify-world-flow.mjs  (dev server: http://localhost:5197)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5197';
mkdirSync('shots', { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

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

  // ---- 1) 序章クリア → 次の章へ → WorldMap → 第1章へ ----
  await page.goto(`${BASE}/?ed=claude&s=chapter-clear&ch=0`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `shots/${W}-flow-1-chapclear0.png` });

  await page.getByText('次の章へ').click({ timeout: 4000 });
  await page.waitForTimeout(1500);
  const onWorld = await page.locator('.world__title').isVisible().catch(() => false);
  console.log(`[${W}] 次の章へ → world map: ${onWorld ? 'OK' : 'NG (WorldMapに遷移していない)'}`);
  await page.screenshot({ path: `shots/${W}-flow-2-world.png` });

  // デバッグ起動では results が空なので第1章は施錠中 → confirm を承諾して進む
  // （実プレイでは序章クリア済みのため施錠されずダイアログは出ない）
  page.once('dialog', (d) => d.accept());
  await page.locator('.worldnode', { hasText: '第1章' }).first().click({ timeout: 4000 });
  await page.waitForTimeout(1500);
  const onMap = await page.locator('.map').first().isVisible().catch(() => false);
  const ch1 = await page.evaluate(() => /第1章/.test(document.body.innerText));
  console.log(`[${W}] world → 第1章 stage map: ${onMap && ch1 ? 'OK' : `NG (map=${onMap} ch1=${ch1})`}`);
  await page.screenshot({ path: `shots/${W}-flow-3-ch1map.png` });

  // ---- 2) WorldMapノードの組版（語中折返し検査） ----
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
      const nobrCount = document.querySelectorAll('.worldnode .nobr').length;
      return { broken, offenders: offenders.slice(0, 5), nobrCount, sw: de.scrollWidth, iw };
    });
    console.log(
      `[${W}/${ed}] world nodes: nobr=${info.nobrCount} 語中折返し=${info.broken.length ? info.broken.join(',') : 'なし'} ` +
        `overflow=${info.offenders.join(',') || 'none'} scrollW=${info.sw}/${info.iw}`,
    );
    await page.screenshot({ path: `shots/${W}-flow-4-worldnodes-${ed}.png`, fullPage: true });
  }

  await browser.close();
}
console.log('done');
