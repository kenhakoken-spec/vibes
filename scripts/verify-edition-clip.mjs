// 反証検証: 編選択画面で CLAUDE 編見出しがクリップされて到達不能か
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5186';
mkdirSync('shots/refute', { recursive: true });
const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const browser = await chromium.launch();

async function check(W, H) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
  });
  const page = await ctx.newPage();

  // 再現手順: タイトル → 「はじめから」タップ
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  // 「はじめから」ボタンを探してタップ
  const btn = page.getByText('はじめから', { exact: false }).first();
  await btn.tap().catch(async () => { await btn.click(); });
  await page.waitForTimeout(2500); // アニメーション完了待ち

  const data = await page.evaluate(() => {
    const cards = document.querySelector('.edition__cards');
    const labels = [...document.querySelectorAll('.edition__label')];
    const cr = cards ? cards.getBoundingClientRect() : null;
    const cs = cards ? getComputedStyle(cards) : null;
    return {
      cardsRect: cr ? { top: cr.top, bottom: cr.bottom, height: cr.height } : null,
      cardsStyle: cs
        ? {
            alignContent: cs.alignContent,
            overflowY: cs.overflowY,
            scrollTop: cards.scrollTop,
            scrollHeight: cards.scrollHeight,
            clientHeight: cards.clientHeight,
          }
        : null,
      labels: labels.map((l) => {
        const r = l.getBoundingClientRect();
        return { text: l.textContent, top: r.top, bottom: r.bottom };
      }),
      screenScroll: (() => {
        const s = document.querySelector('.screen.edition');
        return s ? { scrollTop: s.scrollTop, scrollHeight: s.scrollHeight, clientHeight: s.clientHeight } : null;
      })(),
    };
  });

  // ラベル1がカードコンテナのクリップ上端より上か？
  const clipTop = data.cardsRect ? data.cardsRect.top : 0;
  const label1 = data.labels[0];
  const initiallyClipped = label1 ? label1.top < clipTop - 0.5 : null;

  // スクロールで到達できるか試す（cards を scrollTop=0 に、screen も 0 に）
  const afterScroll = await page.evaluate(() => {
    const cards = document.querySelector('.edition__cards');
    const screen = document.querySelector('.screen.edition');
    if (cards) cards.scrollTop = -9999; // 上方向に可能な限りスクロール
    if (screen) screen.scrollTop = -9999;
    const l = document.querySelector('.edition__label');
    const cr = cards.getBoundingClientRect();
    const r = l.getBoundingClientRect();
    return {
      cardsScrollTop: cards.scrollTop,
      label1Top: r.top,
      clipTop: cr.top,
      stillClipped: r.top < cr.top - 0.5,
    };
  });

  await page.screenshot({ path: `shots/refute/edition-${W}.png` });
  console.log(JSON.stringify({ W, H, data, initiallyClipped, afterScroll }, null, 2));
  await ctx.close();
}

await check(412, 915);
await check(360, 800);
await browser.close();
