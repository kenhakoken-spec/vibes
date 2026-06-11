// 自動通しプレイ（全量回帰用）：タイトル→編選択→章→ステージを実際に操作して進行確認
// 使い方: node scripts/playthrough.mjs [width] [baseURL]
//   例) node scripts/playthrough.mjs 412 http://localhost:5190
//   - CLAUDE編 / CURSOR編 の両方で、序章〜最終章（全11章）を通しプレイ
//   - freeText 課題は「目標＋ヒント文」をそのまま入力して合格できるかを検証
//     （不合格なら problems に記録し、お手本(sampleAnswer)で続行）
//   - 進行が止まる / コンソールエラー / ページエラー を検出したら最後にまとめて報告
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const W = Number(process.argv[2] || 412); // Pixel 8 Pro ≈ 412
const H = 915;
const BASE = process.argv[3] || process.env.PLAY_BASE || 'http://localhost:5173';
mkdirSync('shots', { recursive: true });

// 章の並び（buildChapters と同順）。ステージ数は固定せず、章クリア画面の出現で判定する。
const CHAPTER_LABELS = ['ch0', 'ch1', 'interlude', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'ch8', 'chF'];

const problems = []; // { where, detail }
const cleared = { claude: 0, cursor: 0 }; // クリアできた章数
let where = 'boot';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

// コンソールエラー / 未捕捉例外 / リクエスト失敗を記録
page.on('console', (msg) => {
  if (msg.type() === 'error') problems.push({ where, detail: `console.error: ${msg.text()}` });
});
page.on('pageerror', (err) => problems.push({ where, detail: `pageerror: ${err.message}` }));
page.on('requestfailed', (req) => {
  // dev サーバ停止などのノイズは除き、アセット欠落を拾う
  const f = req.failure()?.errorText ?? '';
  if (!f.includes('ERR_ABORTED')) problems.push({ where, detail: `requestfailed: ${req.url()} (${f})` });
});
page.on('dialog', (d) => d.accept()); // ロック章の confirm 等は許可で進む

/** セレクタ出現を待つ（失敗は problems に積んで throw） */
async function expect(sel, timeout = 15000) {
  try {
    await page.waitForSelector(sel, { timeout });
  } catch {
    problems.push({ where, detail: `進行停止: ${sel} が ${timeout}ms 以内に現れない` });
    await page.screenshot({ path: `shots/stuck-${where.replace(/[^\w-]/g, '_')}.png` });
    throw new Error(`stuck at ${where}: ${sel}`);
  }
}

/** 会話パート：.story__stage をタップし続けて読み進める
 *  注意: 画面中央を押すと本文中の用語リンク（.term）に当たって用語集が開くことがあるため、
 *  端（左上）をタップする。万一シートが開いたら閉じて続行。 */
async function playStory(phase) {
  await expect('.story__stage');
  for (let i = 0; i < 240; i++) {
    // 用語集シートが開いてしまったら閉じる（本来はタップ位置の問題で開かない想定）
    if (await page.locator('.sheet__backdrop').count()) {
      await page.locator('.sheet__close').click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
    const stage = page.locator('.story__stage');
    if ((await stage.count()) === 0) return;
    await stage.click({ timeout: 1500, position: { x: 12, y: 12 } }).catch(() => {});
    await page.waitForTimeout(260);
  }
  problems.push({ where, detail: `進行停止: ${phase} の会話が終わらない（240タップ超）` });
  throw new Error(`story loop at ${where}`);
}

/** freeText の回答を組み立てる：
 *  1回目 = 画面に出ている「目標＋ヒント文」（これで通るのが合格基準）
 *  3回目以降 = 2回失敗で出現する「お手本: 「…」」を抜き出して送る（救済。記録は別途） */
async function buildFreeAnswer(attempt) {
  // ヒントが閉じていれば開く（開閉トグルなので開いている時は触らない）
  if ((await page.locator('.ch__hint').count()) === 0) {
    await page.locator('.ch__hintbtn').click().catch(() => {});
    await page.waitForTimeout(500);
  }
  const goal = (await page.locator('.ch__goal').innerText().catch(() => '')) || '';
  const hint = (await page.locator('.ch__hint').innerText().catch(() => '')) || '';
  if (attempt >= 2) {
    const sample = (await page.locator('.ch__sample').innerText().catch(() => '')) || '';
    const m = sample.match(/「(.+)」/s);
    if (m) return m[1];
  }
  // ヒント欄にお手本が混ざっていても、キーワード照合の妨げにはならない
  return `${goal} ${hint}`.replace(/\s+/g, ' ').trim();
}

/** 依頼パート：選択式は総当たり、自由記述は「目標＋ヒント文」で突破 */
async function solveChallenge() {
  await expect('.screen.challenge');
  await page.waitForTimeout(900);
  let freeTries = 0;
  for (let round = 0; round < 16; round++) {
    if (await page.locator('.ch__cleared').count()) break;
    if (await page.locator('.ch__choices').count()) {
      // 選択式：未選択（未 disabled）の先頭から順に試す
      const btn = page.locator('.ch__choices .abtn:not([disabled])').first();
      if (await btn.count()) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(1400);
        continue;
      }
    }
    if (await page.locator('.ch__compose').count()) {
      if (freeTries === 1) {
        // 目標＋ヒント文で通らなかった＝回帰NG として記録（お手本で続行は試みる）
        problems.push({ where, detail: 'freeText: 目標＋ヒント文の入力でキーワード不合致（1回で通らない）' });
      }
      const answer = await buildFreeAnswer(freeTries);
      freeTries++;
      await page.fill('.ch__textarea', answer);
      await page.locator('.ch__compose .abtn').click().catch(() => {});
      await page.waitForTimeout(1700);
      continue;
    }
    await page.waitForTimeout(500);
  }
  await expect('.ch__cleared .abtn', 10000);
  await page.locator('.ch__cleared .abtn').click(); // つづける ▶
}

/** 章マップから全ステージを通しでプレイ。最終ステージのリザルト後に章クリア画面が出るまで回す */
async function playChapter(label) {
  where = `${label}/map`;
  // 序章クリア直後だけ「次の章へ」が世界地図（創造の地図）を経由する仕様（gameStore.nextChapter）。
  // 世界地図に居たら現在章ノード（is-current）をタップして章マップへ入る。
  await expect('.screen.map, .worldnode.is-current');
  if ((await page.locator('.screen.map').count()) === 0) {
    await page.locator('.worldnode.is-current').click();
  }
  await expect('.screen.map');
  await page.waitForTimeout(2700); // ボス前口上（2.3秒で自動退場）の演出待ち
  where = `${label}/enter-stage`;
  await expect('.node:not(.node--lock)');
  await page.locator('.node:not(.node--lock):not(.node--clear)').first().click();
  for (let s = 0; s < 10; s++) {
    where = `${label}/stage${s + 1}/intro`;
    await playStory('intro');
    where = `${label}/stage${s + 1}/challenge`;
    await solveChallenge();
    where = `${label}/stage${s + 1}/outro`;
    await playStory('outro');
    where = `${label}/stage${s + 1}/result`;
    await expect('.screen.result .abtn');
    await page.waitForTimeout(900);
    await page.locator('.screen.result .abtn').click(); // 次へ ▶（最終ステージなら章クリアへ）
    await page.waitForTimeout(900);
    if (await page.locator('.screen.chapclear').count()) break;
  }
  where = `${label}/chapter-clear`;
  await expect('.screen.chapclear');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `shots/play-${label.replace(/[^\w-]/g, '_')}-clear.png` });
}

/** ムービー風オープニング：タップで早送りしつつ最後の「扉を開く」まで実際に通す
 *  （SKIPは使わない＝新方針の見せ場が壊れていないかも回帰で確認する）
 *  終了後は世界地図を経由せず序章マップへ直行する仕様。 */
async function playOpening(label) {
  where = `${label}/opening`;
  // 初見の編はオープニング。既読なら world（章選択）に居る場合もあるので両対応
  await expect('.screen.opening, .screen.map, .worldnode');
  if ((await page.locator('.screen.opening').count()) === 0) {
    if (await page.locator('.worldnode').count()) {
      await page.locator('.worldnode').first().click();
    }
    return;
  }
  for (let i = 0; i < 200; i++) {
    if ((await page.locator('.screen.opening').count()) === 0) return; // 序章マップへ遷移済み
    // 最終カット：ロゴ →「▶ 扉を開く」
    const enter = page.locator('.opening__enter .abtn');
    if (await enter.count()) {
      await enter.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(700);
      continue;
    }
    // デモカットの一文はキャプション側にクリックが付く。それ以外はカット本体をタップ
    const cap = page.locator('.opening__caption');
    if (await cap.count()) {
      await cap.click({ timeout: 1500 }).catch(() => {});
    } else {
      await page
        .locator('.opening__cut')
        .click({ timeout: 1500, position: { x: 24, y: 220 } })
        .catch(() => {});
    }
    await page.waitForTimeout(420);
  }
  problems.push({ where, detail: '進行停止: オープニングが終わらない（200タップ超）' });
  throw new Error(`opening loop at ${where}`);
}

/** タイトル → 編選択（cardIndex: 0=CLAUDE / 1=CURSOR）→ オープニング → 序章へ */
async function startEdition(label, cardIndex) {
  where = `${label}/title`;
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await expect('.screen.title');
  // 「＋ はじめから」（セーブ有無でボタン数が変わるのでテキストで特定）
  await page.locator('.title__menu .abtn', { hasText: 'はじめから' }).click();
  where = `${label}/edition`;
  await expect('.edition__card');
  await page.locator('.edition__card').nth(cardIndex).click();
  // 新方針: 編選択直後はムービー風オープニング → 序章マップへ直行（世界地図は序章クリア後）
  await playOpening(label);
}

/** 1つの編を序章〜最終章まで通しプレイ */
async function playEdition(label, cardIndex) {
  await startEdition(label, cardIndex);
  for (let c = 0; c < CHAPTER_LABELS.length; c++) {
    await playChapter(`${label}-${CHAPTER_LABELS[c]}`);
    cleared[label]++;
    if (c < CHAPTER_LABELS.length - 1) {
      // 「次の章へ ▶」
      await page.locator('.chapclear__btns .abtn').first().click();
      await page.waitForTimeout(700);
    }
  }
  // 最終章クリア画面（完）から「タイトルへ」で戻る（次の編 or 終了へ）
  where = `${label}/final-to-title`;
  await page.locator('.chapclear__btns .abtn').nth(1).click().catch(() => {});
  await page.waitForTimeout(800);
}

try {
  await playEdition('claude', 0);
  await playEdition('cursor', 1);
  console.log('PLAYTHROUGH COMPLETE');
} catch (e) {
  console.log(`PLAYTHROUGH ABORTED: ${e.message}`);
}

console.log(`CLEARED claude=${cleared.claude}/11 cursor=${cleared.cursor}/11`);
if (problems.length) {
  console.log(`PROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(`  [${p.where}] ${p.detail}`);
} else {
  console.log('PROBLEMS: none');
}

await browser.close();
process.exit(problems.length ? 1 : 0);
