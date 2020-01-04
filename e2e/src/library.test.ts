import { Browser, Page } from 'puppeteer';
import { getBrowser, getConfig, CHROME_USER_AGENT } from './util';

const config = getConfig(process.env);
const userAgent = CHROME_USER_AGENT;

let browser: Browser;
let page: Page;

beforeAll(async () => {
  browser = await getBrowser();
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

it('loads the library page', async () => {
  page.emulate({
    viewport: {
      width: 800,
      height: 800,
    },
    userAgent,
  });

  const url = new URL(config.WEB_URI);
  url.pathname = '/library';

  page.goto(url.href);
  const el = await page.waitForSelector('[data-testid=library]');

  expect(el).not.toBeNull();
});
