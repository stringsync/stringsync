import { Browser, Page } from 'puppeteer';
import { getBrowser, getConfig, CHROME_USER_AGENT } from '../util';

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

it.each([
  { width: 414, height: 896 }, // iPhone XR
  { width: 375, height: 812 }, // iPhone XS
  { width: 1024, height: 1366 }, // iPad Pro
  { width: 412, height: 732 }, // Nexus 6P
])('loads the landing page', async (viewport) => {
  page.emulate({ viewport, userAgent });
  await page.goto(config.WEB_URI);
  const el = await page.waitForSelector('[data-testid="landing"]');
  expect(el).not.toBeNull();
});
