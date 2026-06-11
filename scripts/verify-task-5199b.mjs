// 追検証: (a) OPを連続サンプリングして3デモの出現/生命感をタイムラインで確認
//         (b) Result画面のsvgオーバーフローの正体（背景の意図的ブリードか、実害スクロールか）
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5199';
const OUT = 'shots/verify-5199';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

/* ---- (a) OPタイムライン（両編 / 412） ---- */
for (const ED of ['claude', 'cursor']) {
  const ctx = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 1.5,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto(`${BASE}/?ed=${ED}&s=opening`, { waitUntil: 'networkidle' });

  const t0 = Date.now();
  const seen = { game: [], dash: [], web: [], toast: false, finale: false, stackMax: 0 };
  const shotsTaken = new Set();
  while (Date.now() - t0 < 120000) {
    const st = await page.evaluate(() => ({
      game: document.querySelector('.opening__artifact .artifact__game-score')?.textContent ?? null,
      dash: document.querySelector('.opening__artifact .artifact__dash-value')?.textContent ?? null,
      web: !!document.querySelector('.opening__artifact .artifact__page'),
      toast: !!document.querySelector('.opening__artifact .artifact__toast'),
      finale: !!document.querySelector('.opening__finale'),
      stack: document.querySelectorAll('.opening__stack-item').length,
    }));
    const t = ((Date.now() - t0) / 1000).toFixed(1);
    if (st.game !== null) seen.game.push(`${t}s:${st.game}`);
    if (st.dash !== null) seen.dash.push(`${t}s:${st.dash}`);
    if (st.web) seen.web.push(`${t}s`);
    if (st.toast) seen.toast = true;
    seen.stackMax = Math.max(seen.stackMax, st.stack);
    for (const k of ['game', 'dash', 'web']) {
      const present = k === 'web' ? st.web : st[k] !== null;
      if (present && !shotsTaken.has(k)) {
        shotsTaken.add(k);
        await page.screenshot({ path: `${OUT}/op-tl-${ED}-${k}.png` });
      }
    }
    if (st.finale) {
      seen.finale = true;
      await page.screenshot({ path: `${OUT}/op-tl-${ED}-finale.png` });
      break;
    }
    await page.waitForTimeout(180);
  }
  const dur = ((Date.now() - t0) / 1000).toFixed(1);
  const uniq = (arr) => [...new Set(arr.map((s) => s.split(':').slice(1).join(':')))];
  console.log(`[OPtl/${ED}] 総尺=${dur}s finale=${seen.finale} stackMax=${seen.stackMax} toast=${seen.toast}`);
  console.log(`  game: ${seen.game.length}f 値の種類=${uniq(seen.game).length} (${uniq(seen.game).slice(0, 4).join(' | ')})`);
  console.log(`  dash: ${seen.dash.length}f 値の種類=${uniq(seen.dash).length} (${uniq(seen.dash).slice(0, 4).join(' | ')})`);
  console.log(`  web : ${seen.web.length}f 出現=${seen.web[0] ?? 'なし'}`);
  await ctx.close();
}

/* ---- (b) Resultのオーバーフロー正体 ---- */
{
  const ctx = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?ed=claude&s=result&ch=0&st=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2400);
  const info = await page.evaluate(() => {
    const de = document.scrollingElement || document.documentElement;
    const iw = window.innerWidth;
    const out = [];
    document.querySelectorAll('svg').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > iw + 0.5) {
        // どの祖先に属し、overflowで刈られているか
        let p = el.parentElement;
        let clipped = false;
        const chain = [];
        while (p && p !== document.body) {
          const s = getComputedStyle(p);
          chain.push(p.className?.toString().split(' ')[0] || p.tagName);
          if (s.overflow !== 'visible' || s.overflowX !== 'visible') clipped = true;
          p = p.parentElement;
        }
        out.push({ cls: el.getAttribute('class') ?? el.parentElement?.className?.toString().slice(0, 40), right: Math.round(r.right), clipped, chain: chain.slice(0, 3).join('>') });
      }
    });
    return { sw: de.scrollWidth, iw, bodyOverflowX: getComputedStyle(document.body).overflowX, htmlOverflowX: getComputedStyle(document.documentElement).overflowX, out: out.slice(0, 6) };
  });
  console.log(`[result-overflow] scrollW=${info.sw}/${info.iw} body.overflowX=${info.bodyOverflowX} html.overflowX=${info.htmlOverflowX}`);
  info.out.forEach((o) => console.log(`  svg(${o.cls}) right=${o.right} clipped=${o.clipped} 祖先=${o.chain}`));
  // 実スクロール可否
  const canScroll = await page.evaluate(() => {
    window.scrollTo(50, 0);
    return window.scrollX;
  });
  console.log(`[result-overflow] 横スクロール実害: ${canScroll > 0 ? `NG(scrollX=${canScroll})` : 'なし(OK)'}`);
  await ctx.close();
}

await browser.close();
console.log('done-b');
