import puppeteer, { Browser, Page } from 'puppeteer';
import { CHROME_USER_AGENT, WEB_URI } from './constants';

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
    ],
  });
});
beforeEach(async () => {
  page = await browser.newPage();
});
afterEach(async () => {
  await page.close();
});
afterAll(async () => {
  await browser.close();
});

it('loads the landing page', async () => {
  page.emulate({
    viewport: {
      width: 800,
      height: 800,
    },
    userAgent: CHROME_USER_AGENT,
  });

  await page.goto(WEB_URI);
  const el = await page.waitForSelector('[data-testid="landing"]');

  expect(el).not.toBeNull();
});
