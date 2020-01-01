import { getUserAgent } from './getUserAgent';

it('gets the userAgent from the navigator', () => {
  const userAgent = getUserAgent();
  expect(userAgent).toBe(window.navigator.userAgent);
});
