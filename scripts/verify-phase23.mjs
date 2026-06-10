// Phase2/3 + 立ち絵の実機幅検証（412/360）。横はみ出し・要素はみ出しを検査しスクショ保存。
// 使い方: node scripts/verify-phase23.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5173';
mkdirSync('shots', { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

// taps: ストーリーの送り回数（フック演出の行まで進める）
const shots = [
  // 1) 序章の新フック演出（「論より証拠」→緋色の瞬き→ヒーロー驚き）
  { name: 'p2-hook-line6', url: `${BASE}/?ed=claude&s=story-intro&ch=0&st=0`, taps: 6 },
  { name: 'p2-hook-line7', url: `${BASE}/?ed=claude&s=story-intro&ch=0&st=0`, taps: 7 },
  { name: 'p2-hook-line8', url: `${BASE}/?ed=claude&s=story-intro&ch=0&st=0`, taps: 8 },
  // 旅の全体像セリフ（地図の案内）
  { name: 'p2-hook-line10', url: `${BASE}/?ed=cursor&s=story-intro&ch=0&st=0`, taps: 10 },
  // 2) 序章ジャーニー図（challenge の diagram 'journey'）
  { name: 'p2-journey-claude', url: `${BASE}/?ed=claude&s=challenge&ch=0&st=0`, wait: 2200 },
  { name: 'p2-journey-cursor', url: `${BASE}/?ed=cursor&s=challenge&ch=0&st=0`, wait: 2200 },
  // 3) StageMap 章頭オリエンテーション（第1章: 得る力 / あと○章）
  { name: 'p3-stagemap-ch1', url: `${BASE}/?ed=claude&s=map&ch=1`, wait: 3000 },
  // 4) ChapterClear バッジ獲得演出（POWER GET は power を持つ章のみ → 第1章）
  { name: 'p3-clear-ch1', url: `${BASE}/?ed=claude&s=chapter-clear&ch=1`, wait: 3200 },
  { name: 'p3-clear-ch1-cursor', url: `${BASE}/?ed=cursor&s=chapter-clear&ch=1`, wait: 3200 },
  // 5) WorldMap バッジケース
  { name: 'p3-world-badges', url: `${BASE}/?ed=claude&s=world`, wait: 2000 },
];

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
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });

  for (const s of shots) {
    await page.goto(s.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(s.wait ?? 1600);
    for (let i = 0; i < (s.taps || 0); i++) {
      await page.locator('.story__stage').click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(900);
    }
    if (s.taps) await page.waitForTimeout(1200); // タイプライタ完了待ち
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
      const de = document.scrollingElement || document.documentElement;
      return { iw, docScrollW: de.scrollWidth, equal: de.scrollWidth === iw, offenders: offenders.slice(0, 6) };
    });
    const flags = [];
    if (!info.equal) flags.push(`HOVERFLOW(scrollW=${info.docScrollW} inner=${info.iw})`);
    if (info.offenders.length) flags.push(`RIGHT: ${info.offenders.join(',')}`);
    console.log(`[${W}] ${s.name}: ${flags.length ? flags.join(' | ') : 'ok'}`);
    await page.screenshot({ path: `shots/${W}-${s.name}.png` });
  }
  if (errors.length) console.log(`[${W}] PAGE ERRORS:`, errors.slice(0, 5).join(' / '));
  await browser.close();
}
console.log('done');
