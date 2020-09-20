import { randStr, EntityBuilder } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { isPlainObject, sortBy, take } from 'lodash';
import { UserSequelizeRepo } from './UserSequelizeRepo';
import * as uuid from 'uuid';

const container = useTestContainer();

let userRepo: UserSequelizeRepo;

beforeEach(() => {
  userRepo = container.get<UserSequelizeRepo>(TYPES.UserSequelizeRepo);
});

describe('count', () => {
  it('counts the number of users', async () => {
    await userRepo.bulkCreate([
      EntityBuilder.buildRandUser(),
      EntityBuilder.buildRandUser(),
      EntityBuilder.buildRandUser(),
    ]);

    const count = await userRepo.count();

    expect(count).toBe(3);
  });
});

describe('create', () => {
  it('creates a user record', async () => {
    const countBefore = await userRepo.count();
    await userRepo.create(EntityBuilder.buildRandUser());
    const countAfter = await userRepo.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  it('creates a findable user record', async () => {
    const { id } = await userRepo.create(EntityBuilder.buildRandUser());
    const user = await userRepo.find(id);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });

  it('returns a plain object', async () => {
    const user = await userRepo.create(EntityBuilder.buildRandUser());

    expect(isPlainObject(user)).toBe(true);
  });

  it('disallows duplicate ids', async () => {
    const user = EntityBuilder.buildRandUser({ id: 'id' });

    await expect(userRepo.create(user)).resolves.not.toThrow();
    await expect(userRepo.create(user)).rejects.toThrow();
  });
});

describe('find', () => {
  it('returns the user matching the id', async () => {
    const id = randStr(8);
    await userRepo.create(EntityBuilder.buildRandUser({ id }));

    const user = await userRepo.find(id);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });

  it('returns a plain object', async () => {
    const { id } = await userRepo.create(EntityBuilder.buildRandUser());

    const user = await userRepo.find(id);

    expect(isPlainObject(user)).toBe(true);
  });

  it('returns null when no user found', async () => {
    const user = await userRepo.find('id');

    expect(user).toBeNull();
  });
});

describe('findAll', () => {
  it('returns all user records', async () => {
    const users = [EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()];
    await userRepo.bulkCreate(users);

    const foundUsers = await userRepo.findAll();

    expect(sortBy(foundUsers, 'id')).toStrictEqual(sortBy(users, 'id'));
  });

  it('returns plain objects', async () => {
    const users = [EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()];
    await userRepo.bulkCreate(users);

    const foundUsers = await userRepo.findAll();

    expect(foundUsers.every(isPlainObject)).toBe(true);
  });
});

describe('findByUsernameOrEmail', () => {
  it('finds by username', async () => {
    const user = EntityBuilder.buildRandUser();
    await userRepo.create(user);

    const foundUser = await userRepo.findByUsernameOrEmail(user.username);

    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });

  it('finds by email', async () => {
    const user = EntityBuilder.buildRandUser();
    await userRepo.create(user);

    const foundUser = await userRepo.findByUsernameOrEmail(user.email);

    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });

  it('returns a plain object', async () => {
    const user = EntityBuilder.buildRandUser();
    await userRepo.create(user);

    const foundUser = await userRepo.findByUsernameOrEmail(user.username);

    expect(isPlainObject(foundUser)).toBe(true);
  });
});

describe('findByEmail', () => {
  it('finds by email', async () => {
    const user = EntityBuilder.buildRandUser();
    await userRepo.create(user);

    const foundUser = await userRepo.findByEmail(user.email);

    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });

  it('returns a plain object', async () => {
    const user = EntityBuilder.buildRandUser();
    await userRepo.create(user);

    const foundUser = await userRepo.findByEmail(user.email);

    expect(isPlainObject(foundUser)).toBe(true);
  });
});

describe('findByResetPasswordToken', () => {
  it('finds by resetPasswordToken', async () => {
    const resetPasswordToken = uuid.v4();
    const user = EntityBuilder.buildRandUser({ resetPasswordToken });
    await userRepo.create(user);

    const foundUser = await userRepo.findByResetPasswordToken(resetPasswordToken);

    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });

  it('returns a plain object', async () => {
    const resetPasswordToken = uuid.v4();
    const user = EntityBuilder.buildRandUser({ resetPasswordToken });
    await userRepo.create(user);

    const foundUser = await userRepo.findByResetPasswordToken(resetPasswordToken);

    expect(isPlainObject(foundUser)).toBe(true);
  });
});

describe('update', () => {
  it('updates a user', async () => {
    const user = await userRepo.create(EntityBuilder.buildRandUser());
    const username = randStr(8);

    const updatedUser = await userRepo.update(user.id, { username });

    expect(updatedUser.username).toBe(username);
  });

  it('returns plain objects', async () => {
    const user = await userRepo.create(EntityBuilder.buildRandUser());
    const username = randStr(8);

    const updatedUser = await userRepo.update(user.id, { username });

    expect(updatedUser.username).toBe(username);
  });

  it('unsets confirmationToken when updating email', async () => {
    const confirmationToken = uuid.v4();
    const user = await userRepo.create(EntityBuilder.buildRandUser({ confirmationToken }));

    const email = `${randStr(8)}@example.com`;
    const updatedUser = await userRepo.update(user.id, { email });

    expect(updatedUser.email).toBe(email);
    expect(updatedUser.confirmationToken).toBeNull();
    expect(updatedUser.confirmedAt).toBeNull();
  });

  it('unsets confirmedAt when updating email', async () => {
    const confirmedAt = new Date();
    const user = await userRepo.create(EntityBuilder.buildRandUser({ confirmedAt }));

    const email = `${randStr(8)}@example.com`;
    const updatedUser = await userRepo.update(user.id, { email });

    expect(updatedUser.email).toBe(email);
    expect(updatedUser.confirmationToken).toBeNull();
    expect(updatedUser.confirmedAt).toBeNull();
  });
});

describe('findPage', () => {
  const NUM_USERS = UserSequelizeRepo.PAGE_LIMIT + 1;

  let users: User[];

  beforeEach(async () => {
    users = new Array(NUM_USERS);
    for (let ndx = 0; ndx < NUM_USERS; ndx++) {
      users[ndx] = EntityBuilder.buildRandUser({ rank: ndx + 1 });
    }
    users = await userRepo.bulkCreate(users);
  });

  it('returns the first PAGE_LIMIT records by default', async () => {
    const userConnection = await userRepo.findPage({});

    const actualUsers = userConnection.edges.map((edge) => edge.node);
    const expectedUsers = take(sortBy(users, 'rank').reverse(), UserSequelizeRepo.PAGE_LIMIT);

    expect(actualUsers).toHaveLength(UserSequelizeRepo.PAGE_LIMIT);
    expect(sortBy(actualUsers, 'id')).toStrictEqual(sortBy(expectedUsers, 'id'));
  });

  it('returns the first N records by reverse rank', async () => {
    const userConnection = await userRepo.findPage({ first: 5 });

    const actualUsers = userConnection.edges.map((edge) => edge.node);
    const expectedUsers = take(sortBy(users, 'rank').reverse(), 5);

    expect(actualUsers).toHaveLength(5);
    expect(actualUsers).toStrictEqual(expectedUsers);
  });

  it('returns the first N records after a cursor', async () => {
    const { pageInfo } = await userRepo.findPage({ first: 1 });
    const userConnection = await userRepo.findPage({ first: 2, after: pageInfo.endCursor });

    const actualUsers = userConnection.edges.map((edge) => edge.node);
    const expectedUsers = take(
      sortBy(users, 'rank')
        .reverse()
        .slice(1),
      2
    );

    expect(actualUsers).toHaveLength(2);
    expect(actualUsers).toStrictEqual(expectedUsers);
  });

  it('returns all records when limit is greater than the records', async () => {
    const limit = NUM_USERS + 1;
    const userConnection = await userRepo.findPage({ first: limit });

    const actualUsers = userConnection.edges.map((edge) => edge.node);
    const expectedUsers = sortBy(users, 'rank').reverse();

    expect(actualUsers).toStrictEqual(expectedUsers);
  });

  it('returns all records when limit is greater than remaining records after a cursor', async () => {
    const { pageInfo } = await userRepo.findPage({ first: 1 });
    const userConnection = await userRepo.findPage({ first: NUM_USERS + 1, after: pageInfo.endCursor });

    const actualUsers = userConnection.edges.map((edge) => edge.node);
    const expectedUsers = sortBy(users)
      .reverse()
      .slice(1);

    expect(actualUsers).toHaveLength(expectedUsers.length);
    expect(actualUsers).toStrictEqual(expectedUsers);
  });

  it('does not allow backwards pagination', async () => {
    await expect(userRepo.findPage({ last: 1 })).rejects.toThrow();
  });
});
