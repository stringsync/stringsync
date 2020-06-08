import { UserService } from './UserService';
import { UserRepo, UserMemoryRepo } from '@stringsync/repos';
import { buildUser } from '@stringsync/domain';

let userService: UserService;
let userRepo: UserRepo;

beforeEach(async () => {
  userRepo = new UserMemoryRepo();
  userService = new UserService(userRepo);
});

describe('find', () => {
  it('finds an entity', async () => {
    const user = await userRepo.create(buildUser());

    const foundUser = await userService.find(user.id);

    expect(foundUser).toStrictEqual(user);
  });
});

describe('findAll', () => {
  it('finds all entities', async () => {
    const user1 = await userRepo.create(buildUser());
    const user2 = await userRepo.create(buildUser());

    const users = await userService.findAll();

    expect(users).toHaveLength(2);
    const byId = (a: any, b: any) => (a.id > b.id ? 1 : -1);
    expect(users.sort()).toStrictEqual([user1, user2].sort());
  });
});
