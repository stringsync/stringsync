import { getEncryptedPassword } from './getEncryptedPassword';
import { isPassword } from './isPassword';

const PASSWORD = 'foobar1337';

test('can verify the output of getEncryptedPassword', async (done) => {
  const encryptedPassword1 = await getEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await getEncryptedPassword(PASSWORD);

  const isPassword1 = await isPassword(PASSWORD, encryptedPassword1);
  const isPassword2 = await isPassword(PASSWORD, encryptedPassword2);

  expect(isPassword1).toBe(true);
  expect(isPassword2).toBe(true);
  done();
});
