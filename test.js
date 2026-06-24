const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/admin');
  const html = await page.content();
  console.log(html);
  await browser.close();
})();
