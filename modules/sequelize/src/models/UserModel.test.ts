import { UserModel } from './UserModel';
import { useTestContainer, TYPES } from '@stringsync/container';
import { TestFactory } from '@stringsync/common';
import * as uuid from 'uuid';

const container = useTestContainer();

let userModel: typeof UserModel;

beforeEach(() => {
  userModel = container.get<typeof UserModel>(TYPES.UserModel);
});

it('permits valid users', async () => {
  const user = userModel.build(TestFactory.buildRandUser());
  await expect(user.validate()).resolves.not.toThrow();
});

it.each(['valid@email.com', 'validemail@123.com'])('permits valid emails', async (email) => {
  const user = userModel.build(TestFactory.buildRandUser({ email }));
  await expect(user.validate()).resolves.not.toThrow();
});

it.each(['invalid_email', 'email@domain'])('disallows invalid emails', async (email) => {
  const user = userModel.build(TestFactory.buildRandUser({ email }));
  await expect(user.validate()).rejects.toThrow();
});

it.each(['username123', '_username_', '-_-Username-_-', 'valid.username', '---', '-___-'])(
  'permits valid usernames',
  async (username) => {
    const user = userModel.build(TestFactory.buildRandUser({ username }));
    await expect(user.validate()).resolves.not.toThrow();
  }
);

it.each([
  'no',
  'super_long_username_cmon_pick_something_reasonable',
  'invalid.username!',
  '(invalidusername)',
  '; ATTEMPTED SQL INJECTION',
  '<script>ATTEMPTED XSS</script>',
])('disallows invalid usernames', async (username) => {
  const user = userModel.build(TestFactory.buildRandUser({ username }));
  await expect(user.validate()).rejects.toThrow();
});

it('permits valid confirmation tokens', async () => {
  const user = userModel.build(TestFactory.buildRandUser({ confirmationToken: uuid.v4() }));
  await expect(user.validate()).resolves.not.toThrow();
});

it('disallows invalid confirmation tokens', async () => {
  const user = userModel.build(TestFactory.buildRandUser({ confirmationToken: 'not-a-v4-uuid' }));
  await expect(user.validate()).rejects.toThrow();
});

it('permits valid reset password tokens', async () => {
  const user = userModel.build(TestFactory.buildRandUser({ resetPasswordToken: uuid.v4() }));
  await expect(user.validate()).resolves.not.toThrow();
});

it('disallows invalid reset password tokens', async () => {
  const user = userModel.build(TestFactory.buildRandUser({ resetPasswordToken: 'not-a-v4-uuid' }));
  await expect(user.validate()).rejects.toThrow();
});

it('permits valid avatar urls', async () => {
  const user = userModel.build(TestFactory.buildRandUser({ avatarUrl: 'http://avatars.com/rasdfsdfdf' }));
  await expect(user.validate()).resolves.not.toThrow();
});

it('disallows invalid avatar urls', async () => {
  const user = userModel.build(TestFactory.buildRandUser({ avatarUrl: 'notagoodurl/asdfasd' }));
  await expect(user.validate()).rejects.toThrow();
});
