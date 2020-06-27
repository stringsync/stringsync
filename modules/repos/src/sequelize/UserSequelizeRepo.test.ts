import { randStr, buildRandUser } from '@stringsync/common';
import { UserModel } from '@stringsync/sequelize';
import { UserRepo } from './../types';
import { UserSequelizeRepo } from './UserSequelizeRepo';
import { useTestContainer, TYPES } from '@stringsync/container';
import { sortBy } from 'lodash';

const container = useTestContainer();

let userModel: typeof UserModel;
let userRepo: UserRepo;

beforeEach(() => {
  userModel = container.get<typeof UserModel>(TYPES.UserModel);
  userRepo = new UserSequelizeRepo(userModel);
});

describe('count', () => {
  it('counts the number of users', async () => {
    await userRepo.bulkCreate([buildRandUser(), buildRandUser(), buildRandUser()]);
    const count = await userRepo.count();
    expect(count).toBe(3);
  });
});

describe('create', () => {
  it('creates a user record', async () => {
    const countBefore = await userRepo.count();
    await userRepo.create(buildRandUser());
    const countAfter = await userRepo.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  it('creates a findable user record', async () => {
    const { id } = await userRepo.create(buildRandUser());
    const user = await userRepo.find(id);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });

  it('disallows duplicate ids', async () => {
    const user = buildRandUser({ id: 'id' });

    await expect(userRepo.create(user)).resolves.not.toThrow();
    await expect(userRepo.create(user)).rejects.toThrow();
  });
});

describe('find', () => {
  it('returns the user matching the id', async () => {
    const id = 'id';
    await userRepo.create(buildRandUser({ id }));
    const user = await userRepo.find(id);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });

  it('returns null when no user found', async () => {
    const user = await userRepo.find('id');
    expect(user).toBeNull();
  });
});

describe('findAll', () => {
  it('returns all user records', async () => {
    const users = [buildRandUser(), buildRandUser(), buildRandUser()];
    await userRepo.bulkCreate(users);
    const foundUsers = await userRepo.findAll();
    expect(sortBy(foundUsers, 'id')).toStrictEqual(sortBy(users, 'id'));
  });
});

describe('findByUsernameOrEmail', () => {
  it('finds by username', async () => {
    const user = buildRandUser();
    await userRepo.create(user);
    const foundUser = await userRepo.findByUsernameOrEmail(user.username);
    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });

  it('finds by email', async () => {
    const user = buildRandUser();
    await userRepo.create(user);
    const foundUser = await userRepo.findByUsernameOrEmail(user.email);
    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });
});

describe('update', () => {
  it('updates a user', async () => {
    const user = buildRandUser();
    await userRepo.create(user);
    const username = randStr(8);

    const updatedUser = { ...user, username };
    await userRepo.update(user.id, updatedUser);

    const foundUser = await userRepo.find(user.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser!.username).toBe(username);
  });
});
