// ド新人UX検証：タイトル → 新OP（ムービー）→ 序章 → 第1章クリアまでを実機幅で通しプレイ
// 使い方: node scripts/ux-redesign.mjs [width] [baseURL]
//   例) node scripts/ux-redesign.mjs 412 http://localhost:5195
//   - OPの各カットを撮影（自動送りを待たずに読了→タップで進行）
//   - 各画面で「横はみ出し」と「明示ゲーミフィケーション語の残骸」を検査
//   - スクショは shots/redesign/ に {width}-xx.png で保存
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = Number(process.argv[2] || 412);
const H = 915;
const BASE = process.argv[3] || 'http://localhost:5195';
const DIR = 'shots/redesign';
mkdirSync(DIR, { recursive: true });

const problems = [];
let where = 'boot';

// 残骸チェック対象（表示文字列に出てはいけない語）
const NG_WORDS = ['バッジ', 'POWER GET', '称号', 'レベルアップ', 'LV.', '8つの力'];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') problems.push({ where, detail: `console.error: ${m.text()}` }); });
page.on('pageerror', (e) => problems.push({ where, detail: `pageerror: ${e.message}` }));
page.on('dialog', (d) => d.accept());

/** スクショ + はみ出し検査 + NGワード検査 */
async function snap(name) {
  await page.screenshot({ path: `${DIR}/${W}-${name}.png` });
  const over = await page.evaluate(() => {
    const vw = window.innerWidth;
    const out = [];
    // 横スクロールの発生
    if (document.documentElement.scrollWidth > vw + 1) out.push(`doc.scrollWidth=${document.documentElement.scrollWidth} > ${vw}`);
    // 右端からはみ出している可視要素（fx等の装飾レイヤは除外）
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const st = getComputedStyle(el);
      if (st.position === 'fixed' && (el.className + '').includes('fx')) continue;
      if (r.right > vw + 2 && st.overflow !== 'hidden' && !el.closest('[class*="fx"],[class*="scene-layer"],[class*="particle"],[class*="slash"],[class*="burst"],[class*="wipe"]')) {
        out.push(`${el.tagName}.${(el.className + '').split(' ')[0]} right=${Math.round(r.right)}`);
        if (out.length > 4) break;
      }
    }
    return out;
  }).catch(() => []);
  if (over.length) problems.push({ where: `${where}/${name}`, detail: `横はみ出し: ${over.join(' | ')}` });
  const text = await page.evaluate(() => document.body.innerText).catch(() => '');
  for (const ng of NG_WORDS) {
    if (text.includes(ng)) problems.push({ where: `${where}/${name}`, detail: `残骸NGワード「${ng}」が画面に表示` });
  }
}

async function expect(sel, timeout = 15000) {
  try {
    await page.waitForSelector(sel, { timeout });
  } catch {
    problems.push({ where, detail: `進行停止: ${sel} が出ない` });
    await page.screenshot({ path: `${DIR}/${W}-stuck-${where.replace(/[^\w-]/g, '_')}.png` });
    throw new Error(`stuck at ${where}`);
  }
}

/* ---- OP（ムービー）を1カットずつ読み切って撮影 ---- */
async function playOpening() {
  where = 'opening';
  await expect('.screen.opening');
  let shot = 0;
  let lastText = '';
  for (let i = 0; i < 80; i++) {
    if (await page.locator('.opening__finale').count()) break;
    await page.waitForTimeout(500);
    // 文字カット：typewriter完了（▶表示）を待って撮影→タップ送り
    const adv = page.locator('.opening__advance');
    const advDone = (await adv.count()) ? (await adv.innerText().catch(() => '')).includes('▶') : false;
    const cap = page.locator('.opening__caption');
    const capCount = await cap.count();
    if (advDone) {
      const t = await page.locator('.opening__text').innerText().catch(() => '');
      if (t !== lastText) {
        shot++;
        await snap(`op-${String(shot).padStart(2, '0')}`);
        lastText = t;
      }
      await page.locator('.opening__cut').click({ position: { x: 24, y: 160 } }).catch(() => {});
      await page.waitForTimeout(300);
    } else if (capCount) {
      // デモカット：一文（caption）が出たら少し待って成果物ごと撮影→タップ送り
      await page.waitForTimeout(1800);
      shot++;
      await snap(`op-${String(shot).padStart(2, '0')}`);
      await cap.click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  where = 'opening/finale';
  await expect('.opening__finale');
  await page.waitForTimeout(1300);
  await snap('op-finale');
  await page.locator('.opening__enter .abtn').click();
}

/* ---- 会話パート：左上タップで読み進める。最初の数枚を撮影 ---- */
async function playStory(label, shots = 0) {
  await expect('.story__stage');
  let taken = 0;
  for (let i = 0; i < 240; i++) {
    if (await page.locator('.sheet__backdrop').count()) {
      await page.locator('.sheet__close').click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    const stage = page.locator('.story__stage');
    if ((await stage.count()) === 0) return;
    if (taken < shots && i > 0 && i % 3 === 0) {
      taken++;
      await snap(`${label}-${taken}`);
    }
    await stage.click({ timeout: 1500, position: { x: 12, y: 12 } }).catch(() => {});
    await page.waitForTimeout(260);
  }
  throw new Error(`story loop at ${where}`);
}

/* ---- 依頼パート：選択式は1番目→正解探し、自由記述は“ド新人の自然文”で ---- */
const FREE_ANSWERS = [
  // ch1 S3（バグ修正）: 症状+期待 を自分の言葉で
  'ボタンを押しても反応しません。押したら「入室しました」と表示されるように直してください。',
  // ch1 S4（仕上げ）: 自由な一工夫
  'あいさつの下に「一緒に創ろう」と一行追加して、ボタンを大きく目立たせてください。',
];
let freeUsed = 0;

async function solveChallenge(label) {
  await expect('.screen.challenge');
  await page.waitForTimeout(900);
  await snap(`${label}-brief`);
  for (let round = 0; round < 16; round++) {
    if (await page.locator('.ch__cleared').count()) break;
    if (await page.locator('.ch__choices').count()) {
      const btn = page.locator('.ch__choices .abtn:not([disabled])').first();
      if (await btn.count()) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(1400);
        continue;
      }
    }
    if (await page.locator('.ch__compose').count()) {
      const ans = FREE_ANSWERS[Math.min(freeUsed, FREE_ANSWERS.length - 1)];
      freeUsed++;
      await page.fill('.ch__textarea', ans);
      await snap(`${label}-typed`);
      await page.locator('.ch__compose .abtn').click().catch(() => {});
      await page.waitForTimeout(1700);
      // ド新人の自然文で一発合格できるか（できなければ記録して目標+ヒントで救済）
      if ((await page.locator('.ch__cleared').count()) === 0 && (await page.locator('.ch__compose').count())) {
        problems.push({ where, detail: `freeText: ド新人の自然文「${ans}」で不合格` });
      }
      continue;
    }
    await page.waitForTimeout(500);
  }
  await expect('.ch__cleared .abtn', 10000);
  await snap(`${label}-cleared`);
  await page.locator('.ch__cleared .abtn').click();
}

/* ---- 1章ぶん通す ---- */
async function playChapter(label, storyShots = 2) {
  where = `${label}/map`;
  await expect('.screen.map');
  await page.waitForTimeout(2700); // ボス前口上の演出待ち
  await snap(`${label}-map`);
  await expect('.node:not(.node--lock)');
  await page.locator('.node:not(.node--lock):not(.node--clear)').first().click();
  for (let s = 0; s < 10; s++) {
    where = `${label}/s${s + 1}/intro`;
    await playStory(`${label}-s${s + 1}-story`, s === 0 ? storyShots : 1);
    where = `${label}/s${s + 1}/challenge`;
    await solveChallenge(`${label}-s${s + 1}-ch`);
    where = `${label}/s${s + 1}/outro`;
    await playStory(`${label}-s${s + 1}-outro`, 0);
    where = `${label}/s${s + 1}/result`;
    await expect('.screen.result .abtn');
    await page.waitForTimeout(900);
    await snap(`${label}-s${s + 1}-result`);
    await page.locator('.screen.result .abtn').click();
    await page.waitForTimeout(900);
    if (await page.locator('.screen.chapclear').count()) break;
  }
  where = `${label}/clear`;
  await expect('.screen.chapclear');
  await page.waitForTimeout(2600); // 余韻の段階表示を待つ
  await snap(`${label}-clear-top`);
  // 下までスクロールして全容も撮る
  await page.evaluate(() => document.querySelector('.screen.chapclear')?.scrollTo(0, 99999));
  await page.waitForTimeout(700);
  await snap(`${label}-clear-bottom`);
}

try {
  /* タイトル */
  where = 'title';
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  await expect('.screen.title');
  await snap('01-title');
  await page.locator('.title__menu .abtn', { hasText: 'はじめから' }).click();

  /* 編選択（ド新人はCLAUDE編を選ぶ想定） */
  where = 'edition';
  await expect('.edition__card');
  await page.waitForTimeout(800);
  await snap('02-edition');
  await page.locator('.edition__card').first().click();

  /* 新OP（ムービー）→ そのまま序章マップへ入る */
  await playOpening();

  /* 序章（2ステージ）→ 第1章（4ステージ） */
  await playChapter('ch0', 2);
  await snap('04-after-ch0');
  await page.locator('.chapclear__btns .abtn').first().click(); // 次の章へ ▶
  await page.waitForTimeout(700);
  await playChapter('ch1', 2);

  /* クリア後のワールドマップ（成長の見え方確認） */
  where = 'world-after';
  await page.locator('.chapclear__btns .abtn').nth(1).click(); // 章選択へ
  await expect('.worldnode');
  await page.waitForTimeout(1100);
  await snap('05-world-after-ch1');

  console.log('UX PLAYTHROUGH COMPLETE');
} catch (e) {
  console.log(`UX PLAYTHROUGH ABORTED: ${e.message}`);
}

if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(`  [${p.where}] ${p.detail}`);
} else {
  console.log('PROBLEMS: none');
}
await browser.close();
process.exit(0);
