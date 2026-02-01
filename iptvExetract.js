const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('request', request => {
    const url = request.url();
    if (url.includes('.m3u8')) {
      console.log('Found m3u8:', url);
    }
  });
  await page.goto('http://azrogo.com/iphone/arabic/ch5/cbcdramatv.php', {
    waitUntil: 'networkidle'
  });

  console.log('Waiting for stream...');
  await page.waitForTimeout(60000);

  await browser.close();
})();
