import { UserRepo } from '@stringsync/repos';
import { TYPES, useTestContainer } from '@stringsync/container';
import { UserService } from './UserService';
import { buildUser } from '@stringsync/domain';
import { sortBy } from 'lodash';

const container = useTestContainer();

let userService: UserService;
let userRepo: UserRepo;

beforeEach(() => {
  userService = container.get<UserService>(TYPES.UserService);
  userRepo = userService.userRepo;
});

describe.skip('find', () => {
  it('finds an entity', async () => {
    const user = await userRepo.create(buildUser());

    const foundUser = await userService.find(user.id);

    expect(foundUser).toStrictEqual(user);
  });
});

describe.skip('findAll', () => {
  it('finds all entities', async () => {
    const user1 = await userRepo.create(buildUser());
    const user2 = await userRepo.create(buildUser());

    const users = await userService.findAll();

    expect(users).toHaveLength(2);
    expect(sortBy(users, 'id')).toStrictEqual(sortBy([user1, user2], 'id'));
  });
});
