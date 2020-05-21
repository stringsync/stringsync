import { makeEncryptedPassword } from './makeEncryptedPassword';

const PASSWORD = 'password';

it('is not idempotent', async () => {
  const encryptedPassword1 = await makeEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await makeEncryptedPassword(PASSWORD);

  expect(encryptedPassword1).not.toBe(encryptedPassword2);
});
