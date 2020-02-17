import { encryptCsrfToken } from './encryptCsrfToken';

const SECRET = 'SECRET';

it('runs without crashing', () => {
  expect(() =>
    encryptCsrfToken({ session: '', iat: new Date() }, SECRET)
  ).not.toThrow();
});
