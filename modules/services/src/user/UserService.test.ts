import { UserRepo } from '@stringsync/repos';
import { TYPES, useTestContainer } from '@stringsync/container';
import { UserService } from './UserService';
import { buildRandUser } from '@stringsync/common';
import { sortBy } from 'lodash';

const container = useTestContainer();

let userService: UserService;
let userRepo: UserRepo;

beforeEach(() => {
  userService = container.get<UserService>(TYPES.UserService);
  userRepo = userService.userRepo;
});

describe('find', () => {
  it('finds an entity', async () => {
    const user = await userRepo.create(buildRandUser());

    const foundUser = await userService.find(user.id);

    expect(foundUser).toStrictEqual(user);
  });
});

describe('findAll', () => {
  it('finds all entities', async () => {
    const users = await userRepo.bulkCreate([buildRandUser(), buildRandUser()]);
    const foundUsers = await userService.findAll();

    expect(users).toHaveLength(2);
    expect(sortBy(foundUsers, 'id')).toStrictEqual(sortBy(users, 'id'));
  });
});
