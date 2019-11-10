import { getCookies } from './getCookies';

const EXPECTED_COOKIE = 'USER_SESSION_TOKEN=foo; ';
const UNEXPECTED_COOKIE = 'UNEXPECTED_COOKIE=bar; ';

it('parses expected cookies', (done) => {
  const cookies = getCookies(EXPECTED_COOKIE);
  expect(cookies.USER_SESSION_TOKEN).toBe('foo');
  done();
});

it('parses unexpected cookies', (done) => {
  const cookies = getCookies(UNEXPECTED_COOKIE);
  expect(cookies['UNEXPECTED_COOKIE']).toBe('bar');
  done();
});

it('parses expected and unexpected cookies', (done) => {
  const cookies = getCookies(EXPECTED_COOKIE + UNEXPECTED_COOKIE);
  expect(cookies.USER_SESSION_TOKEN).toBe('foo');
  expect(cookies['UNEXPECTED_COOKIE']).toBe('bar');
  done();
});

it('sets defaults for expected cookies', (done) => {
  const cookies = getCookies('');
  expect(cookies.USER_SESSION_TOKEN).toBe('');
  expect(cookies).not.toHaveProperty('UNEXPECTED_COOKIE');
  done();
});
