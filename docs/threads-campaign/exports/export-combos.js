// Export combo / team cards from combo-templates.html to real 1080x1350 PNGs.
// Run:  NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node export-combos.js
//
// Each .card in combo-templates.html carries a data-file attribute. This script
// reads that attribute so you never have to touch this file when adding a combo:
// just append an entry to the COMBOS array in combo-templates.html and re-run.
const { chromium } = require('playwright');
const path = require('path');

const HTML = 'file://' + path.resolve(__dirname, '../combo-templates.html');
const OUT = __dirname;
const W = 1080, H = 1350;

const FONT = `
  body, .card, .card * {
    font-family: "IPAGothic","IPAPGothic","Noto Sans CJK JP","Hiragino Sans",sans-serif !important;
  }`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });

  await page.goto(HTML, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: FONT });
  await page.evaluate(() => document.fonts.ready);

  // Collect the list of data-file targets present in the DOM.
  const files = await page.evaluate(() =>
    [...document.querySelectorAll('.card[data-file]')].map(c => c.dataset.file));

  for (const file of files) {
    const ok = await page.evaluate((f) => {
      const card = [...document.querySelectorAll('.card[data-file]')]
        .find(c => c.dataset.file === f);
      if (!card) return false;
      const head = document.querySelector('.page-head');
      if (head) head.style.display = 'none';
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
    }, file);

    if (!ok) { console.error('NOT FOUND:', file); continue; }

    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(OUT, file),
      clip: { x: 0, y: 0, width: W, height: H },
    });
    console.log('wrote', file);

    // Reload for a clean DOM before the next target.
    await page.goto(HTML, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: FONT });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
  }

  await browser.close();
})();
