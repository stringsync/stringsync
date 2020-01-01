import puppeteer from 'puppeteer';
import { CHROME_USER_AGENT } from './constants';

it('loads the landing page', async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  page.emulate({
    viewport: {
      width: 800,
      height: 800,
    },
    userAgent: CHROME_USER_AGENT,
  });

  await page.goto('http://localhost:8080/');
  const el = await page.waitForSelector('[data-testid="landing"]');

  expect(el).not.toBeNull();

  browser.close();
}, 10000);
