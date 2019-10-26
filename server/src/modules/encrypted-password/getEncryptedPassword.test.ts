import { getEncryptedPassword } from './getEncryptedPassword';
import bcrypt from 'bcrypt';

const PASSWORD = 'qwerty123456';

test('getEncryptedPassword is not idempotent', async (done) => {
  const encryptedPassword1 = await getEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await getEncryptedPassword(PASSWORD);

  expect(encryptedPassword1).not.toBe(encryptedPassword2);
  done();
});

test('getEncryptedPassword can be verified by bcrypt', async (done) => {
  const encryptedPassword1 = await getEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await getEncryptedPassword(PASSWORD);

  const isPassword1 = await bcrypt.compare(PASSWORD, encryptedPassword1);
  const isPassword2 = await bcrypt.compare(PASSWORD, encryptedPassword2);

  expect(isPassword1).toBe(true);
  expect(isPassword2).toBe(true);
  done();
});
