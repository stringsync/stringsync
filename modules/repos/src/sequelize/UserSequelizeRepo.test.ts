import { buildUser } from '@stringsync/domain';
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
    await userRepo.bulkCreate([buildUser(), buildUser(), buildUser()]);
    const count = await userRepo.count();
    expect(count).toBe(3);
  });
});

describe('create', () => {
  it('creates a user record', async () => {
    const countBefore = await userRepo.count();
    await userRepo.create(buildUser());
    const countAfter = await userRepo.count();

    expect(countAfter).toBe(countBefore + 1);
  });

  it('creates a findable user record', async () => {
    const { id } = await userRepo.create(buildUser());
    const user = await userRepo.find(id);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(id);
  });

  it('disallows duplicate ids', async () => {
    const user = buildUser({ id: 'id' });

    await expect(userRepo.create(user)).resolves.not.toThrow();
    await expect(userRepo.create(user)).rejects.toThrow();
  });
});

describe('find', () => {
  it('returns the user matching the id', async () => {
    const id = 'id';
    await userRepo.create(buildUser({ id }));
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
    const users1 = [buildUser(), buildUser(), buildUser()];
    await userRepo.bulkCreate(users1);
    const users2 = await userRepo.findAll();
    expect(sortBy(users2, 'id')).toStrictEqual(sortBy(users1, 'id'));
  });
});
