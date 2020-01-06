import { Page } from 'puppeteer';
import { getConfig, CHROME_USER_AGENT } from './util';

const config = getConfig(process.env);
const userAgent = CHROME_USER_AGENT;

let page: Page;

beforeEach(async () => {
  page = await (global as any).__BROWSER__.newPage();
});
afterEach(async () => {
  await page.close();
});

it('loads the page', async () => {
  page.emulate({ viewport: { width: 1024, height: 1366 }, userAgent });
  await page.goto(config.WEB_URI);
  const el = await page.waitForSelector('[data-testid="landing"]');
  expect(el).not.toBeNull();
});

it.each(['/library', '/login', '/signup'])(
  'has links to other important pages',
  async (href) => {
    page.emulate({
      viewport: {
        width: 1400,
        height: 900,
      },
      userAgent,
    });

    await page.goto(config.WEB_URI);

    const linkEl = await page.waitForSelector(`a[href="${href}"]`);
    expect(linkEl).not.toBeNull();
  }
);
