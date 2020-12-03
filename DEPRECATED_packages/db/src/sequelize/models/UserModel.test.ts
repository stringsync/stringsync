import { UserModel } from './UserModel';
import { useTestContainer, TYPES } from '@stringsync/di';
import { EntityBuilder, randStr } from '@stringsync/common';
import * as uuid from 'uuid';
import { NotationRepo, UserRepo } from '@stringsync/repos';
import { sortBy } from 'lodash';

const container = useTestContainer();

let userRepo: UserRepo;
let notationRepo: NotationRepo;

beforeEach(() => {
  userRepo = container.get<UserRepo>(TYPES.UserRepo);
  notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
});

it('permits valid users', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser());
  await expect(user.validate()).resolves.not.toThrow();
});

it.each(['valid@email.com', 'validemail@123.com'])('permits valid emails', async (email) => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ email }));
  await expect(user.validate()).resolves.not.toThrow();
});

it.each(['invalid_email', 'email@domain'])('disallows invalid emails', async (email) => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ email }));
  await expect(user.validate()).rejects.toThrow();
});

it.each(['username123', '_username_', '-_-Username-_-', 'valid.username', '---', '-___-'])(
  'permits valid usernames',
  async (username) => {
    const user = UserModel.build(EntityBuilder.buildRandUser({ username }));
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
  const user = UserModel.build(EntityBuilder.buildRandUser({ username }));
  await expect(user.validate()).rejects.toThrow();
});

it('permits valid confirmation tokens', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ confirmationToken: uuid.v4() }));
  await expect(user.validate()).resolves.not.toThrow();
});

it('disallows invalid confirmation tokens', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ confirmationToken: 'not-a-v4-uuid' }));
  await expect(user.validate()).rejects.toThrow();
});

it('permits valid reset password tokens', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ resetPasswordToken: uuid.v4() }));
  await expect(user.validate()).resolves.not.toThrow();
});

it('disallows invalid reset password tokens', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ resetPasswordToken: 'not-a-v4-uuid' }));
  await expect(user.validate()).rejects.toThrow();
});

it('permits valid avatar urls', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ avatarUrl: 'http://avatars.com/rasdfsdfdf' }));
  await expect(user.validate()).resolves.not.toThrow();
});

it('disallows invalid avatar urls', async () => {
  const user = UserModel.build(EntityBuilder.buildRandUser({ avatarUrl: 'notagoodurl/asdfasd' }));
  await expect(user.validate()).rejects.toThrow();
});

it('returns all notations', async () => {
  const [transcriber1, transcriber2] = await userRepo.bulkCreate([
    EntityBuilder.buildRandUser(),
    EntityBuilder.buildRandUser(),
  ]);
  const [notation1, notation2, notation3] = await notationRepo.bulkCreate([
    EntityBuilder.buildRandNotation({ transcriberId: transcriber1.id }),
    EntityBuilder.buildRandNotation({ transcriberId: transcriber1.id }),
    EntityBuilder.buildRandNotation({ transcriberId: transcriber2.id }),
  ]);

  const userEntity = await UserModel.findByPk(transcriber1.id, { include: 'notations' });

  expect(userEntity).not.toBeNull();
  expect(userEntity!.notations).toHaveLength(2);
  expect(userEntity!.notations?.map((notation) => notation.id).sort()).toStrictEqual(
    [notation1.id, notation2.id].sort()
  );
});

it('does not clear confirmationToken when setting email on a new entity', () => {
  const confirmationToken = uuid.v4();
  const userEntity = new UserModel(EntityBuilder.buildRandUser({ confirmationToken }));

  const email = `${randStr(8)}@example.com`;
  userEntity.email = email;

  expect(userEntity.email).toBe(email);
  expect(userEntity.confirmationToken).toBe(confirmationToken);
});

it('clears confirmationToken when setting email on a saved entity', async () => {
  const confirmationToken = uuid.v4();
  const userEntity = await UserModel.create(EntityBuilder.buildRandUser({ confirmationToken }));

  const email = `${randStr(8)}@example.com`;
  userEntity.email = email;

  expect(userEntity.email).toBe(email);
  expect(userEntity.confirmationToken).toBeNull();
});

it('clears confirmedAt when setting email on a saved entity', async () => {
  const confirmedAt = new Date();
  const userModel = await UserModel.create(EntityBuilder.buildRandUser({ confirmedAt }));

  const email = `${randStr(8)}@example.com`;
  userModel.email = email;

  expect(userModel.email).toBe(email);
  expect(userModel.confirmedAt).toBeNull();
});