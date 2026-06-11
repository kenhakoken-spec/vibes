// 横はみ出し検査：nobr/term など折返し抑制を入れた要素がビューポート外に出ていないか。
// 使い方: PORT=5203 node scripts/check-overflow.mjs [width]
import { chromium } from 'playwright';

const W = Number(process.argv[2] || 412);
const H = 915;
const PORT = process.env.PORT || 5203;
const BASE = `http://localhost:${PORT}`;
const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

const SAVE_3 = {
  editionId: 'claude',
  results: Object.fromEntries(
    ['c0s1', 'c0s2', 's1', 's2', 's3', 's4', 'ims1', 'ims2', 'ims2b', 'ims3', 'ims4', 'c2s1', 'c2s2', 'c2s3', 'c2s4', 'c3s1', 'c3s2', 'c3s3', 'c3s4'].map(
      (id) => [id, { cleared: true, score: 1, attempts: 1 }],
    ),
  ),
  learned: ['完璧じゃなくていい。まず言葉にして、試して、直す。', '相棒の喚び出し方'],
};

const SCREENS = [
  { name: 'title', url: '/' },
  { name: 'edition', url: '/?ed=claude&s=edition' },
  { name: 'opening-claude', url: '/?ed=claude&s=opening', taps: 34 },
  { name: 'opening-cursor', url: '/?ed=cursor&s=opening', taps: 34 },
  { name: 'story-ch0s1', url: '/?ed=claude&s=story-intro&ch=0&st=1', taps: 30 },
  { name: 'challenge-ch0', url: '/?ed=claude&s=challenge&ch=0&st=0' },
  { name: 'challenge-ch1st2', url: '/?ed=claude&s=challenge&ch=1&st=2' },
  { name: 'result-ch1', url: '/?ed=claude&s=result&ch=1&st=0' },
  { name: 'world', url: '/', save: SAVE_3, click: 'text=つづきから', wait: 2400 },
  { name: 'codex', url: '/', save: SAVE_3, click: 'text=つづきから', wait: 2400, click2: 'text=📖 学びの記録' },
  { name: 'glossary-term', url: '/?ed=claude&s=world', click: '[aria-label="用語集をひらく"]', click2: '.sheet__row' },
  { name: 'stagemap-ch6', url: '/?ed=claude&s=map&ch=6', wait: 3400 },
  { name: 'clear-interlude', url: '/?ed=claude&s=chapter-clear&ch=2', wait: 3400 },
  { name: 'clear-final', url: '/?ed=cursor&s=chapter-clear&ch=10', wait: 3400 },
];

const CHECK = `(() => {
  const vw = window.innerWidth;
  const bad = [];
  // テキストを直接持つ要素の横はみ出し（演出で動く装飾は除外）
  document.querySelectorAll('.nobr, .term, p, span, li, h1, h2, h3, b, code, button').forEach((el) => {
    if (!el.textContent || !el.textContent.trim()) return;
    if (el.closest('.opening__stack, .particles, svg, .slashwipe, .stinger')) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.right > vw + 1.5 || r.left < -1.5) {
      bad.push({ sel: el.tagName + '.' + String(el.className).split(' ')[0], text: el.textContent.trim().slice(0, 30), right: Math.round(r.right), left: Math.round(r.left) });
    }
  });
  // スクロールコンテナ自体の横はみ出し
  document.querySelectorAll('.screen, .sheet, .slab').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 1) bad.push({ sel: 'container ' + String(el.className).split(' ')[0], text: '', sw: el.scrollWidth, cw: el.clientWidth });
  });
  return bad;
})()`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent: UA,
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();
let total = 0;
const seen = new Set();

for (const s of SCREENS) {
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((d) => {
      localStorage.clear();
      if (d) localStorage.setItem('vibe-guild:save', JSON.stringify(d));
    }, s.save ?? null);
    await page.goto(`${BASE}${s.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(s.wait ?? 1500);
    if (s.click) {
      await page.locator(s.click).first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
    if (s.click2) {
      await page.locator(s.click2).first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(900);
    }
    const report = async (label) => {
      const bad = await page.evaluate(CHECK);
      for (const b of bad) {
        const key = `${s.name}|${b.sel}|${b.text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        total++;
        console.log(`  [overflow] ${s.name}${label} :: ${JSON.stringify(b)}`);
      }
    };
    await report('');
    for (let i = 0; i < (s.taps ?? 0); i++) {
      const el = page.locator('.opening, .story__stage').first();
      if ((await el.count()) === 0) break;
      await el.click({ force: true, timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(450);
      await report(`-tap${i + 1}`);
      if ((await page.locator('.opening, .story__stage').count()) === 0) break;
    }
  } catch (e) {
    console.error(`[skip] ${s.name}: ${e.message}`);
  }
}
console.log(`width=${W} overflow issues=${total}`);
await browser.close();
