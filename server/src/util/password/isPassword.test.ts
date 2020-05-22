import { makeEncryptedPassword } from './makeEncryptedPassword';
import { isPassword } from './isPassword';

const PASSWORD = 'foobar1337';

it('can verify the output of makeEncryptedPassword', async () => {
  const encryptedPassword1 = await makeEncryptedPassword(PASSWORD);
  const encryptedPassword2 = await makeEncryptedPassword(PASSWORD);

  const isPassword1 = await isPassword(PASSWORD, encryptedPassword1);
  const isPassword2 = await isPassword(PASSWORD, encryptedPassword2);

  expect(isPassword1).toBe(true);
  expect(isPassword2).toBe(true);
});
