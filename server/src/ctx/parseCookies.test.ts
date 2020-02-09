import { parseCookies } from './parseCookies';

const EXPECTED_COOKIE = 'USER_SESSION_TOKEN=foo; ';
const UNEXPECTED_COOKIE = 'UNEXPECTED_COOKIE=bar; ';

it('parses expected cookies', () => {
  const cookies = parseCookies(EXPECTED_COOKIE);
  expect(cookies.USER_SESSION_TOKEN).toBe('foo');
});

it('parses unexpected cookies', () => {
  const cookies = parseCookies(UNEXPECTED_COOKIE);
  expect(cookies['UNEXPECTED_COOKIE']).toBe('bar');
});

it('parses expected and unexpected cookies', () => {
  const cookies = parseCookies(EXPECTED_COOKIE + UNEXPECTED_COOKIE);
  expect(cookies.USER_SESSION_TOKEN).toBe('foo');
  expect(cookies['UNEXPECTED_COOKIE']).toBe('bar');
});

it('sets defaults for expected cookies', () => {
  const cookies = parseCookies('');
  expect(cookies.USER_SESSION_TOKEN).toBe('');
  expect(cookies).not.toHaveProperty('UNEXPECTED_COOKIE');
});
