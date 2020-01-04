const puppeteer = require('puppeteer');

const CHROME_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.151 Safari/535.19';

module.exports = async () => {
  console.log('\n\n🦑  opening browser');
  const browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  page.emulate({
    viewport: { width: 800, height: 800 },
    userAgent: CHROME_USER_AGENT,
  });

  try {
    console.log('🦑  waiting for landing page');
    await page.goto(process.env.WEB_URI);
    await page.waitForSelector('html', { timeout: 60000 });
    console.log('🦑  got landing page\n');
  } finally {
    await page.close();
    await browser.close();
  }
};
