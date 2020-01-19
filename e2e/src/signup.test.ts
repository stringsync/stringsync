import { Page, Browser } from 'puppeteer';
import { getConfig, CHROME_USER_AGENT } from './util';
import faker from 'faker';

const config = getConfig(process.env);
const userAgent = CHROME_USER_AGENT;

let page: Page;

beforeEach(async () => {
  const browser: Browser = (global as any).__BROWSER__;
  const ctx = await browser.createIncognitoBrowserContext();
  page = await ctx.newPage();

  page.emulate({
    viewport: {
      width: 1280,
      height: 800,
    },
    userAgent,
  });

  const url = new URL(config.WEB_URI);
  url.pathname = '/signup';
  await page.goto(url.href);
});
afterEach(async () => {
  await page.close();
});

it('loads the signup page', async () => {
  const el = await page.waitForSelector('[data-testid=signup]');
  expect(el).not.toBeNull();
});

it('allows users to signup', async () => {
  const email = faker.internet.email();
  const username = email.split('@')[0];
  const password = faker.internet.password(10);

  await page.waitForSelector('[data-testid=signup]');
  await page.type('input[name="email"]', email);
  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForSelector('[data-testid=library]');

  const userSessionTokenCookie = (
    await page.cookies('http://test-e2e-server:3000')
  ).find((cookie) => cookie.name === 'USER_SESSION_TOKEN');
  expect(userSessionTokenCookie).not.toBeNull();
});
