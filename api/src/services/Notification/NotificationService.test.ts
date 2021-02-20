import { User } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import { EntityBuilder } from '../../testing';
import { NotificationService } from './NotificationService';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let userRepo: UserRepo;

  beforeEach(() => {
    notificationService = container.get<NotificationService>(TYPES.NotificationService);
    userRepo = container.get<UserRepo>(TYPES.UserRepo);
  });

  describe('sendConfirmationEmail', () => {
    let user: User;

    beforeEach(async () => {
      user = await userRepo.create(EntityBuilder.buildRandUser());
    });

    it('runs without crashing', async () => {
      expect(() => notificationService.sendConfirmationEmail(user)).not.toThrow();
    });
  });
});
