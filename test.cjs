const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  await page.goto('http://localhost:5173/admin');
  await page.waitForTimeout(3000);
  const html = await page.content();
  console.log("HTML length:", html.length);
  await browser.close();
})();
