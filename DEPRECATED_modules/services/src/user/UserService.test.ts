import { UserService } from './UserService';
import { Container, TYPES } from '@stringsync/container';
import { UserRepo } from '@stringsync/repos';
import { buildUser } from '@stringsync/domain';

let userService: UserService;
let userRepo: UserRepo;

beforeEach(() => {
  userService = Container.instance.get<UserService>(TYPES.UserService);
  userRepo = userService.userRepo;
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

    expect(users.sort()).toStrictEqual([user1, user2].sort());
  });
});
