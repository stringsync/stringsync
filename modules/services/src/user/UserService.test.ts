import { UserRepo } from '@stringsync/repos';
import { TYPES } from './../../../container/src/constants';
import { cleanupContainer } from './../../../container/src/cleanupContainer';
import { createContainer } from '@stringsync/container';
import { UserService } from './UserService';
import { buildUser } from '@stringsync/domain';
import { sortBy } from 'lodash';
import { Container } from 'inversify';

let userService: UserService;
let userRepo: UserRepo;
let container: Container;

beforeEach(async () => {
  container = await createContainer();
  userService = container.get<UserService>(TYPES.UserService);
  userRepo = userService.userRepo;
});

afterEach(async () => {
  cleanupContainer(container);
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
