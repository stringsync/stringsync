import { getEncryptedPassword } from './getEncryptedPassword';

const PASSWORD = 'qwerty123456';

test('getEncryptedPassword is not idempotent', async (done) => {
  const encryptedPassword1 = await getEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await getEncryptedPassword(PASSWORD);

  expect(encryptedPassword1).not.toBe(encryptedPassword2);
  done();
});
