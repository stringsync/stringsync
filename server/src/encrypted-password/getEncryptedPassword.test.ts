import { getEncryptedPassword } from './getEncryptedPassword';

const PASSWORD = 'password';

it('is not idempotent', async () => {
  const encryptedPassword1 = await getEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await getEncryptedPassword(PASSWORD);

  expect(encryptedPassword1).not.toBe(encryptedPassword2);
});
