// ビジュアル品質スイープ：実機相当エミュレーション(412/360)で主要画面を巡回しスクショ
// 使い方: node scripts/sweep.mjs [width]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = Number(process.argv[2] || 412);
const H = 915;
const BASE = 'http://localhost:5184';
mkdirSync('shots/sweep', { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

// 「数個獲得」状態のセーブ（claude編・序章+1章+幕間+2章+3章クリア=力3つ）
const SAVE_3 = {
  editionId: 'claude',
  results: Object.fromEntries(
    ['c0s1', 'c0s2', 's1', 's2', 's3', 's4', 'ims1', 'ims2', 'ims2b', 'ims3', 'ims4', 'c2s1', 'c2s2', 'c2s3', 'c2s4', 'c3s1', 'c3s2', 'c3s3', 'c3s4'].map(
      (id) => [id, { cleared: true, score: 1, attempts: 1 }]
    )
  ),
  learned: ['完璧じゃなくていい。まず言葉にして、試して、直す。', '相棒の喚び出し方'],
};

const shots = [
  { name: 'title', url: `${BASE}/` },
  { name: 'edition', url: `${BASE}/?ed=claude&s=edition` },
  // 序章フック（地の文の演出ライン）
  { name: 'prologue-hook-a', url: `${BASE}/?ed=claude&s=story-intro&ch=0`, taps: 4 },
  { name: 'prologue-hook-b', url: `${BASE}/?ed=claude&s=story-intro&ch=0`, taps: 6 },
  // 序章ジャーニー図（challenge内のdiagram:journey）
  { name: 'prologue-journey-claude', url: `${BASE}/?ed=claude&s=challenge&ch=0&st=0` },
  { name: 'prologue-journey-cursor', url: `${BASE}/?ed=cursor&s=challenge&ch=0&st=0` },
  // WorldMap：0/8
  { name: 'world-0of8', url: `${BASE}/?ed=claude&s=world` },
  // WorldMap：3個獲得（セーブ注入→タイトル→つづきから）
  { name: 'world-3of8', url: `${BASE}/`, save: SAVE_3, clickText: 'つづきから', wait: 2200 },
  // StageMap 第1章（章頭チップ）— BossIntroが先に出るので待つ
  { name: 'bossintro-ch1', url: `${BASE}/?ed=claude&s=map&ch=1`, wait: 900 },
  { name: 'stagemap-ch1', url: `${BASE}/?ed=claude&s=map&ch=1`, wait: 3000 },
  { name: 'stagemap-ch1-cursor', url: `${BASE}/?ed=cursor&s=map&ch=1`, wait: 3000 },
  // StoryScene 立ち絵（両編）
  { name: 'story-mentor-claude', url: `${BASE}/?ed=claude&s=story-intro&ch=1`, taps: 1 },
  { name: 'story-partner-claude', url: `${BASE}/?ed=claude&s=story-intro&ch=1&st=1`, taps: 1 },
  { name: 'story-mentor-cursor', url: `${BASE}/?ed=cursor&s=story-intro&ch=1`, taps: 1 },
  { name: 'story-partner-cursor', url: `${BASE}/?ed=cursor&s=story-intro&ch=1&st=1`, taps: 1 },
  // Challenge / Result
  { name: 'challenge-ch1', url: `${BASE}/?ed=claude&s=challenge&ch=1&st=0` },
  { name: 'challenge-ch1-cursor', url: `${BASE}/?ed=cursor&s=challenge&ch=1&st=0` },
  { name: 'result-ch1', url: `${BASE}/?ed=claude&s=result&ch=1&st=0` },
  // ChapterClear：power章（両編）・幕間（非power）・最終章
  { name: 'clear-ch1-claude', url: `${BASE}/?ed=claude&s=chapter-clear&ch=1`, wait: 3000 },
  { name: 'clear-ch1-cursor', url: `${BASE}/?ed=cursor&s=chapter-clear&ch=1`, wait: 3000 },
  { name: 'clear-interlude', url: `${BASE}/?ed=claude&s=chapter-clear&ch=2`, wait: 3000 },
  { name: 'clear-final', url: `${BASE}/?ed=cursor&s=chapter-clear&ch=10`, wait: 3000 },
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
  if (s.save) {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((d) => localStorage.setItem('vibe-guild:save', JSON.stringify(d)), s.save);
  } else {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.removeItem('vibe-guild:save'));
  }
  await page.goto(s.url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(s.wait ?? 1600);
  if (s.clickText) {
    await page.getByText(s.clickText).first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(s.wait ?? 1600);
  }
  for (let i = 0; i < (s.taps || 0); i++) {
    await page.locator('.story__stage').click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(1200);
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
    // 用語集FABとテキストの重なり検査
    const fab = document.querySelector('.glossfab');
    const overlaps = [];
    if (fab) {
      const fr = fab.getBoundingClientRect();
      document.querySelectorAll('p, span, li, b, h1, h2').forEach((el) => {
        if (fab.contains(el) || el.contains(fab)) return;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const ox = Math.min(r.right, fr.right) - Math.max(r.left, fr.left);
        const oy = Math.min(r.bottom, fr.bottom) - Math.max(r.top, fr.top);
        if (ox > 4 && oy > 4 && el.textContent && el.textContent.trim().length > 2 && el.children.length === 0) {
          const c = (el.className || '').toString().split(' ')[0];
          overlaps.push(`${el.tagName.toLowerCase()}.${c}(${Math.round(ox)}x${Math.round(oy)})`);
        }
      });
    }
    const de = document.scrollingElement || document.documentElement;
    return { iw, docScrollW: de.scrollWidth, vScroll: de.scrollHeight - ih, offenders: offenders.slice(0, 5), overlaps: overlaps.slice(0, 5) };
  });
  const flags = [];
  if (info.docScrollW > info.iw + 1) flags.push(`HOVERFLOW(${info.docScrollW})`);
  if (info.offenders.length) flags.push(`RIGHT: ${info.offenders.join(',')}`);
  if (info.vScroll > 2) flags.push(`VSCROLL+${info.vScroll}`);
  if (info.overlaps.length) flags.push(`FAB-OVERLAP: ${info.overlaps.join(',')}`);
  console.log(`[${W}] ${s.name}: ${flags.length ? flags.join(' | ') : 'ok'}`);
  await page.screenshot({ path: `shots/sweep/${W}-${s.name}.png` });
}

await browser.close();
