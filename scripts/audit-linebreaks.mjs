// 実機幅DOM走査で「謎の改行」を全画面検出するスクリプト。
// 使い方: node scripts/audit-linebreaks.mjs [width]   (devサーバを PORT で起動しておく)
//   各テキストノードを Range で文字単位に矩形化し、行が変わる位置を特定して分類:
//   1) カタカナ語中の折返し  2) 英単語/数字列の途中折れ  3) 行末1〜2文字のぶら下がり
//   4) 用語チップ(.term)の分断/直前の不自然な折れ  5) 手動改行(\n,<br>)と幅の不整合
// 結果: shots/linebreak/report-{W}.json + 代表スクショ shots/linebreak/*.png
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const W = Number(process.argv[2] || 412);
const H = 915;
const PORT = process.env.PORT || 5202;
const BASE = `http://localhost:${PORT}`;
const OUT = 'shots/linebreak';
mkdirSync(OUT, { recursive: true });

const UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36';

// 進捗ありセーブ（WorldMap/Codex に学びチップを出すため）
const SAVE_3 = {
  editionId: 'claude',
  results: Object.fromEntries(
    ['c0s1', 'c0s2', 's1', 's2', 's3', 's4', 'ims1', 'ims2', 'ims2b', 'ims3', 'ims4', 'c2s1', 'c2s2', 'c2s3', 'c2s4', 'c3s1', 'c3s2', 'c3s3', 'c3s4'].map(
      (id) => [id, { cleared: true, score: 1, attempts: 1 }],
    ),
  ),
  learned: ['完璧じゃなくていい。まず言葉にして、試して、直す。', '相棒の喚び出し方'],
};

/* ---------------- ページ内スキャナ ---------------- */
// 戻り値: [{type, example, selector, blockText}]
const SCAN_FN = `(() => {
  const KAT = /[ァ-ヶー]/;
  const ALNUM = /[A-Za-z0-9]/;
  const PUNCT_ONLY = /^[。、，．,.!?！?？…」』）)\\]'"・:;：；ー〜~]+$/;
  const issues = [];

  const selOf = (el) => {
    const parts = [];
    let e = el, depth = 0;
    while (e && e !== document.body && depth < 3) {
      const cls = typeof e.className === 'string' && e.className.trim()
        ? '.' + e.className.trim().split(/\\s+/).slice(0, 2).join('.')
        : '';
      parts.unshift(e.tagName.toLowerCase() + cls);
      e = e.parentElement; depth++;
    }
    return parts.join(' > ');
  };

  const isVisible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const blockOf = (el) => {
    let e = el;
    while (e && e !== document.body) {
      const d = getComputedStyle(e).display;
      if (!d.startsWith('inline') && d !== 'contents') return e;
      e = e.parentElement;
    }
    return document.body;
  };

  // ブロックごとに「文字+矩形」を集める
  const blocks = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.textContent || !n.textContent.trim()) return NodeFilter.FILTER_REJECT;
      const el = n.parentElement;
      if (!el || !isVisible(el)) return NodeFilter.FILTER_REJECT;
      if (el.closest('script,style,svg')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent;
    const range = document.createRange();
    const b = blockOf(node.parentElement);
    if (!blocks.has(b)) blocks.set(b, { chars: [], brAfter: new Set() });
    const rec = blocks.get(b);
    for (let i = 0; i < text.length; i++) {
      let r = null;
      try {
        range.setStart(node, i); range.setEnd(node, i + 1);
        const rects = range.getClientRects();
        r = rects[rects.length - 1] || null;
      } catch { /* noop */ }
      const ch = text[i];
      if (!r || (r.width === 0 && r.height === 0)) {
        rec.chars.push({ ch, hidden: true, manual: ch === '\\n', el: node.parentElement });
        continue;
      }
      rec.chars.push({ ch, top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: r.bottom - r.top, manual: ch === '\\n', el: node.parentElement });
    }
  }
  // <br> の位置も手動改行として記録
  document.querySelectorAll('br').forEach((br) => {
    const b = blockOf(br.parentElement);
    if (blocks.has(b)) blocks.get(b).brHit = true;
  });

  for (const [block, rec] of blocks) {
    const cs = getComputedStyle(block);
    const chars = rec.chars;
    // 行番号を割り当て
    let line = 0, prev = null;
    const lines = []; // [{text, left, right, top, manualEnd}]
    for (const c of chars) {
      if (c.hidden) { if (c.manual && lines[line]) lines[line].manualEnd = true; c.line = -1; continue; }
      if (prev) {
        const newLine = c.top > prev.top + prev.h * 0.6 || (c.left < prev.left - 4 && c.top > prev.top + 2);
        if (newLine) line++;
      }
      c.line = line;
      if (!lines[line]) lines[line] = { text: '', left: c.left, right: c.right, top: c.top };
      lines[line].text += c.ch;
      lines[line].right = Math.max(lines[line].right, c.right);
      lines[line].left = Math.min(lines[line].left, c.left);
      prev = c;
    }
    if (lines.length < 2) {
      // 1行でも用語チップ分断チェックは別途行うので continue しない
    }
    const blockRect = block.getBoundingClientRect();
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const contentW = blockRect.width - (isNaN(pad) ? 0 : pad);
    const blockText = chars.map((c) => c.ch).join('');
    const mark = (i) => {
      // 折れ位置 i(直後で改行) を「…ab/cd…」表記に
      const s = Math.max(0, i - 11), e = Math.min(chars.length, i + 13);
      return (s > 0 ? '…' : '') + blockText.slice(s, i + 1) + '/' + blockText.slice(i + 1, e) + (e < chars.length ? '…' : '');
    };

    // 1,2) 語中折返し
    const vis = chars.map((c, i) => ({ ...c, idx: i })).filter((c) => !c.hidden);
    for (let k = 0; k + 1 < vis.length; k++) {
      const a = vis[k], b = vis[k + 1];
      if (a.line < 0 || b.line !== a.line + 1) continue;
      // 間に空白/手動改行があるなら自然
      let sep = false;
      for (let j = a.idx + 1; j < b.idx; j++) if (/\\s/.test(chars[j].ch)) sep = true;
      if (/\\s/.test(a.ch) || /\\s/.test(b.ch) || sep) continue;
      if (KAT.test(a.ch) && KAT.test(b.ch)) {
        issues.push({ type: 'katakana-split', example: mark(a.idx), selector: selOf(a.el), blockText: blockText.slice(0, 80) });
      } else if (ALNUM.test(a.ch) && ALNUM.test(b.ch)) {
        issues.push({ type: 'word-split', example: mark(a.idx), selector: selOf(a.el), blockText: blockText.slice(0, 80) });
      }
    }

    // 3) ぶら下がり（最終行が1〜2文字 or 句読点のみの行）
    if (lines.length >= 2) {
      const last = lines[lines.length - 1];
      const lastTrim = (last.text || '').trim();
      if (lastTrim && (lastTrim.length <= 2 || PUNCT_ONLY.test(lastTrim)) && blockText.trim().length > 12) {
        issues.push({ type: 'orphan-tail', example: '…' + lines[lines.length - 2].text.slice(-14) + '/' + lastTrim, selector: selOf(block), blockText: blockText.slice(0, 80) });
      }
      for (let li = 0; li < lines.length; li++) {
        const t = (lines[li].text || '').trim();
        if (t && PUNCT_ONLY.test(t) && li > 0) {
          issues.push({ type: 'punct-line', example: '…' + (lines[li - 1].text || '').slice(-14) + '/' + t, selector: selOf(block), blockText: blockText.slice(0, 80) });
        }
      }
    }

    // 5) 手動改行と幅の不整合（手動改行で終わる行が短すぎて段差）
    if (lines.length >= 2) {
      const maxRight = Math.max(...lines.map((l) => l.right));
      lines.forEach((l, li) => {
        if (!l.manualEnd || li === lines.length - 1) return;
        const fill = (l.right - l.left) / Math.max(1, contentW);
        if (fill < 0.55 && (l.text || '').trim().length > 0 && lines.length > 2) {
          issues.push({ type: 'manual-break-gap', example: (l.text || '').trim() + '/(手動改行)' + (lines[li + 1].text || '').trim().slice(0, 10), selector: selOf(block), blockText: blockText.slice(0, 80) });
        }
      });
    }
  }

  // 4) 用語チップの分断/不自然な折れ
  document.querySelectorAll('.term, .codex__termchip').forEach((chip) => {
    if (!isVisible(chip)) return;
    const rects = [...chip.getClientRects()].filter((r) => r.width > 1);
    const tops = [...new Set(rects.map((r) => Math.round(r.top)))];
    if (tops.length > 1) {
      issues.push({ type: 'chip-split', example: (chip.textContent || '').trim(), selector: selOf(chip), blockText: (chip.closest('p,div,li,span')?.textContent || '').slice(0, 80) });
    }
  });

  return issues;
})()`;

/* ---------------- 巡回定義 ---------------- */
const tap = (sel) => ({ tapThrough: sel });
const SCREENS = [
  { name: 'title', url: '/' },
  { name: 'settings', url: '/', click: 'text=⚙ 設定', wait: 900 },
  { name: 'edition', url: '/?ed=claude&s=edition' },
  { name: 'opening-claude', url: '/?ed=claude&s=opening', ...tap('.opening'), maxTaps: 34 },
  { name: 'opening-cursor', url: '/?ed=cursor&s=opening', ...tap('.opening'), maxTaps: 34 },
  // 序章
  { name: 'story-ch0s0', url: '/?ed=claude&s=story-intro&ch=0&st=0', ...tap('.story__stage'), maxTaps: 30 },
  { name: 'story-ch0s1', url: '/?ed=claude&s=story-intro&ch=0&st=1', ...tap('.story__stage'), maxTaps: 30 },
  { name: 'challenge-ch0', url: '/?ed=claude&s=challenge&ch=0&st=0', hint: true, choice: true },
  { name: 'challenge-ch0-cursor', url: '/?ed=cursor&s=challenge&ch=0&st=0', hint: true },
  { name: 'result-ch0', url: '/?ed=claude&s=result&ch=0&st=0' },
  // WorldMap（初期/進捗）+ Codex
  { name: 'world-fresh', url: '/?ed=claude&s=world' },
  { name: 'world-progress', url: '/', save: SAVE_3, click: 'text=つづきから', wait: 2400 },
  { name: 'codex-sheet', url: '/', save: SAVE_3, click: 'text=つづきから', wait: 2400, click2: 'text=📖 学びの記録', wait2: 900 },
  // 用語集（一覧+詳細）
  { name: 'glossary-index', url: '/?ed=claude&s=world', click: '[aria-label="用語集をひらく"]', wait: 900 },
  { name: 'glossary-term', url: '/?ed=claude&s=world', click: '[aria-label="用語集をひらく"]', wait: 900, click2: '.sheet__row', wait2: 700 },
  // BossIntro / StageMap（複数章）
  { name: 'bossintro-ch1', url: '/?ed=claude&s=map&ch=1', wait: 700 },
  { name: 'stagemap-ch1', url: '/?ed=claude&s=map&ch=1', wait: 3400 },
  { name: 'stagemap-interlude', url: '/?ed=claude&s=map&ch=2', wait: 3400 },
  { name: 'stagemap-ch5', url: '/?ed=claude&s=map&ch=6', wait: 3400 },
  { name: 'stagemap-final', url: '/?ed=cursor&s=map&ch=10', wait: 3400 },
  // StoryScene（両編・複数章 + outro）
  { name: 'story-ch1s0-claude', url: '/?ed=claude&s=story-intro&ch=1&st=0', ...tap('.story__stage'), maxTaps: 30 },
  { name: 'story-ch1s0-cursor', url: '/?ed=cursor&s=story-intro&ch=1&st=0', ...tap('.story__stage'), maxTaps: 30 },
  { name: 'story-ch5s0-claude', url: '/?ed=claude&s=story-intro&ch=6&st=0', ...tap('.story__stage'), maxTaps: 30 },
  { name: 'story-chFs0-cursor', url: '/?ed=cursor&s=story-intro&ch=10&st=0', ...tap('.story__stage'), maxTaps: 30 },
  { name: 'story-outro-ch1', url: '/?ed=claude&s=story-outro&ch=1&st=0', ...tap('.story__stage'), maxTaps: 30 },
  // Challenge（choice / freeText 両方; freeText位置は実行時判定）
  { name: 'challenge-ch1st0', url: '/?ed=claude&s=challenge&ch=1&st=0', hint: true, choice: true },
  { name: 'challenge-ch1st2', url: '/?ed=claude&s=challenge&ch=1&st=2', hint: true, choice: true },
  { name: 'challenge-ch1st3', url: '/?ed=claude&s=challenge&ch=1&st=3', hint: true },
  { name: 'challenge-ch1st3-cursor', url: '/?ed=cursor&s=challenge&ch=1&st=3', hint: true },
  { name: 'challenge-ch5st3', url: '/?ed=claude&s=challenge&ch=6&st=3', hint: true },
  { name: 'challenge-chFst-last', url: '/?ed=cursor&s=challenge&ch=10&st=3', hint: true },
  // Result / ChapterClear / 幕間 / 最終
  { name: 'result-ch1', url: '/?ed=claude&s=result&ch=1&st=0' },
  { name: 'result-ch5', url: '/?ed=claude&s=result&ch=6&st=2' },
  { name: 'clear-ch1-claude', url: '/?ed=claude&s=chapter-clear&ch=1', wait: 3400 },
  { name: 'clear-ch1-cursor', url: '/?ed=cursor&s=chapter-clear&ch=1', wait: 3400 },
  { name: 'clear-interlude', url: '/?ed=claude&s=chapter-clear&ch=2', wait: 3400 },
  { name: 'clear-final', url: '/?ed=cursor&s=chapter-clear&ch=10', wait: 3400 },
];

/* ---------------- 実行 ---------------- */
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

const all = [];
const seen = new Set();

async function stabilize(maxMs = 2600) {
  let prevTxt = '';
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    const txt = await page.evaluate(() => document.body.innerText);
    if (txt === prevTxt) return;
    prevTxt = txt;
    await page.waitForTimeout(180);
  }
}

async function scanAndRecord(screenName, label) {
  const found = await page.evaluate(SCAN_FN);
  let fresh = 0;
  for (const f of found) {
    const key = `${f.type}|${f.example}|${f.selector}`;
    if (seen.has(key)) continue;
    seen.add(key);
    all.push({ ...f, screen: screenName, label, width: W, url: page.url() });
    fresh++;
  }
  if (fresh > 0) {
    const file = `${OUT}/${screenName}${label ? '-' + label : ''}-w${W}.png`;
    await page.screenshot({ path: file }).catch(() => {});
  }
  return fresh;
}

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
      await page.waitForTimeout(s.wait2 ?? 900);
    }
    if (s.click2) {
      await page.locator(s.click2).first().click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(s.wait2 ?? 900);
    }
    await stabilize();
    await scanAndRecord(s.name, '');

    if (s.hint) {
      // ヒント展開（お手本テキストも走査対象に）
      await page.locator('.ch__hintbtn').first().click({ timeout: 2500 }).catch(() => {});
      await page.waitForTimeout(500);
      await scanAndRecord(s.name, 'hint');
    }
    if (s.choice) {
      // 選択肢を1つ押して返答バブルも走査
      const kind = (await page.locator('.ch__textarea').count()) > 0 ? 'freeText' : 'choice';
      if (kind === 'choice') {
        await page.locator('.ch__choices button').first().click({ timeout: 2500 }).catch(() => {});
        await page.waitForTimeout(1800);
        await stabilize();
        await scanAndRecord(s.name, 'answered');
      }
    }
    if (s.tapThrough) {
      for (let i = 0; i < (s.maxTaps ?? 25); i++) {
        const el = page.locator(s.tapThrough).first();
        if ((await el.count()) === 0) break;
        await el.click({ force: true, timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(180);
        await stabilize(2200);
        await scanAndRecord(s.name, `tap${i + 1}`);
        // 画面が切り替わったら終了
        if ((await page.locator(s.tapThrough).count()) === 0) break;
      }
    }
  } catch (e) {
    console.error(`[skip] ${s.name}: ${e.message}`);
  }
  // 途中で落ちても結果が残るよう毎画面ごとに書き出す
  writeFileSync(`${OUT}/report-${W}.partial.json`, JSON.stringify(all, null, 2));
}

writeFileSync(`${OUT}/report-${W}.json`, JSON.stringify(all, null, 2));
const byType = {};
for (const i of all) byType[i.type] = (byType[i.type] ?? 0) + 1;
console.log(`width=${W} issues=${all.length}`, byType);
for (const i of all) console.log(`  [${i.type}] ${i.screen} :: ${i.example} :: ${i.selector}`);

await browser.close();
