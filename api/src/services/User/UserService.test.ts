import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import { rand } from '../../util';
import { UserService } from './UserService';

describe('UserService', () => {
  let userService: UserService;
  let userRepo: UserRepo;

  beforeEach(() => {
    userService = container.get<UserService>(TYPES.UserService);
    userRepo = container.get<UserRepo>(TYPES.UserRepo);
  });

  describe('find', () => {
    it('finds an entity', async () => {
      const user = await userRepo.create(rand.user({ cursor: 1 }));
      const foundUser = await userService.find(user.id);
      expect(foundUser).toStrictEqual(user);
    });
  });

  describe('findAll', () => {
    it('finds all entities', async () => {
      const users = await userRepo.bulkCreate([rand.user({ cursor: 1 }), rand.user({ cursor: 2 })]);
      const foundUsers = await userService.findAll();
      expect(foundUsers).toIncludeAllMembers(users);
    });
  });
});
