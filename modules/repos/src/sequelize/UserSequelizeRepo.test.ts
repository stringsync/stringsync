import { buildUser } from '@stringsync/domain';
import { UserModel } from '@stringsync/sequelize';
import { UserRepo } from './../types';
import { UserSequelizeRepo } from './UserSequelizeRepo';
import { useTestContainer, TYPES } from '@stringsync/container';

const container = useTestContainer();

let userModel: typeof UserModel;
let userRepo: UserRepo;

beforeEach(() => {
  userModel = container.get<typeof UserModel>(TYPES.UserModel);
  userRepo = new UserSequelizeRepo(userModel);
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

  it('throws an error if id already exists', async () => {
    const user = buildUser({ id: 'id' });

    await expect(userRepo.create(user)).resolves.not.toThrow();
    await expect(userRepo.create(user)).rejects.toThrow();
  });
});
