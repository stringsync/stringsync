import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder } from '@stringsync/domain';
import { UserRepo } from '@stringsync/repos';
import { sortBy } from 'lodash';
import { SERVICES } from '../SERVICES';
import { SERVICES_TYPES } from '../SERVICES_TYPES';
import { UserService } from './UserService';

const TYPES = { ...SERVICES_TYPES };

const ref = useTestContainer(SERVICES);

let container: Container;

let userService: UserService;
let userRepo: UserRepo;

beforeEach(() => {
  container = ref.container;
});

beforeEach(() => {
  userService = container.get<UserService>(TYPES.UserService);
  userRepo = userService.userRepo;
});

describe('find', () => {
  it('finds an entity', async () => {
    const user = await userRepo.create(EntityBuilder.buildRandUser());

    const foundUser = await userService.find(user.id);

    expect(foundUser).toStrictEqual(user);
  });
});

describe('findAll', () => {
  it('finds all entities', async () => {
    const users = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);
    const foundUsers = await userService.findAll();

    expect(users).toHaveLength(2);
    expect(sortBy(foundUsers, 'id')).toStrictEqual(sortBy(users, 'id'));
  });
});
