// Export Threads carousel cards from card-templates.html to real 1080x1350 PNGs.
// Run:  NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node export.js
const { chromium } = require('playwright');
const path = require('path');

const HTML = 'file://' + path.resolve(__dirname, '../card-templates.html');
const OUT = __dirname;

const W = 1080, H = 1350;

// Each target: filename + a predicate (runs in browser) to pick the .card element.
const TARGETS = [
  {
    file: 'cover.png',
    pick: () => document.querySelector('.card.cover'),
  },
  {
    file: '01-revolist.png',
    pick: () => [...document.querySelectorAll('.card')].find(
      c => !c.classList.contains('cover') &&
           c.textContent.includes('レボリスト') && c.textContent.includes('#01')),
  },
  {
    file: 'common-traits.png',
    pick: () => [...document.querySelectorAll('.card')].find(
      c => c.textContent.includes('動いちゃう人')),
  },
];

// The 10 remaining type cards (#02-#11). Picked by the .num text so the
// order in card-templates.html doesn't matter.
const TYPE_FILES = {
  '#02': '02-maxdesigner.png',
  '#03': '03-imagemaister.png',
  '#04': '04-communicator.png',
  '#05': '05-inforader.png',
  '#06': '06-movmentor.png',
  '#07': '07-premiercrafter.png',
  '#08': '08-logicalmaister.png',
  '#09': '09-arranger.png',
  '#10': '10-soulowner.png',
  '#11': '11-crazist.png',
};
for (const [num, file] of Object.entries(TYPE_FILES)) {
  // pick is a *source string* (its own .toString()) so the number literal is
  // baked in and survives the toString()->eval hop into the browser.
  TARGETS.push({
    file,
    pick: `() => [...document.querySelectorAll('.card')].find(c => {` +
          `  const n = c.querySelector('.num');` +
          `  return n && n.textContent.trim() === ${JSON.stringify(num)};` +
          `})`,
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });

  await page.goto(HTML, { waitUntil: 'networkidle' });

  // Force IPAGothic explicitly so Hiragino falls back cleanly (no tofu).
  await page.addStyleTag({ content: `
    body, .card, .card * {
      font-family: "IPAGothic","IPAPGothic","Noto Sans CJK JP","Hiragino Sans",sans-serif !important;
    }
  ` });

  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  for (const t of TARGETS) {
    // Isolate the target card: unscale it, pin it to the top-left of the body,
    // and hide every sibling so nothing else can bleed into the clip region.
    const ok = await page.evaluate((pickSrc) => {
      const pick = eval('(' + pickSrc + ')');
      const card = pick();
      if (!card) return false;
      // hide page chrome
      const head = document.querySelector('.page-head');
      if (head) head.style.display = 'none';
      // detach card and place it directly under body at 0,0, unscaled
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.background = '#ffffff';
      const grid = document.getElementById('grid');
      if (grid) grid.style.display = 'none';
      document.body.appendChild(card);
      card.style.transform = 'none';
      card.style.position = 'fixed';
      card.style.top = '0';
      card.style.left = '0';
      card.style.margin = '0';
      card.style.borderRadius = '0';
      card.style.boxShadow = 'none';
      return true;
    }, t.pick.toString());

    if (!ok) {
      console.error('NOT FOUND:', t.file);
      continue;
    }

    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(OUT, t.file),
      clip: { x: 0, y: 0, width: W, height: H },
    });
    console.log('wrote', t.file);

    // Reload for a clean DOM before the next target.
    await page.goto(HTML, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: `
      body, .card, .card * {
        font-family: "IPAGothic","IPAPGothic","Noto Sans CJK JP","Hiragino Sans",sans-serif !important;
      }
    ` });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
  }

  await browser.close();
})();
