import { getCookies } from './getCookies';

const EXPECTED_COOKIE = 'USER_SESSION_TOKEN=foo; ';
const UNEXPECTED_COOKIE = 'UNEXPECTED_COOKIE=bar; ';

it('parses expected cookies', () => {
  const cookies = getCookies(EXPECTED_COOKIE);
  expect(cookies.USER_SESSION_TOKEN).toBe('foo');
});

it('parses unexpected cookies', () => {
  const cookies = getCookies(UNEXPECTED_COOKIE);
  expect(cookies['UNEXPECTED_COOKIE']).toBe('bar');
});

it('parses expected and unexpected cookies', () => {
  const cookies = getCookies(EXPECTED_COOKIE + UNEXPECTED_COOKIE);
  expect(cookies.USER_SESSION_TOKEN).toBe('foo');
  expect(cookies['UNEXPECTED_COOKIE']).toBe('bar');
});

it('sets defaults for expected cookies', () => {
  const cookies = getCookies('');
  expect(cookies.USER_SESSION_TOKEN).toBe('');
  expect(cookies).not.toHaveProperty('UNEXPECTED_COOKIE');
});
