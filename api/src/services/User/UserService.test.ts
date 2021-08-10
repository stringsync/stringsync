import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import { createRandUser, createRandUsers } from '../../testing';
import { UserService } from './UserService';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: UserRepo;

  beforeEach(() => {
    userService = container.get<UserService>(TYPES.UserService);
    userRepo = userService.userRepo;
  });

  describe('find', () => {
    it('finds an entity', async () => {
      const user = await createRandUser();

      const foundUser = await userService.find(user.id);

      expect(foundUser).toStrictEqual(user);
    });
  });

  describe('findAll', () => {
    it('finds all entities', async () => {
      const users = await createRandUsers(2);
      const foundUsers = await userService.findAll();

      expect(users).toHaveLength(2);
      expect(foundUsers).toIncludeAllMembers(users);
    });
  });
});
