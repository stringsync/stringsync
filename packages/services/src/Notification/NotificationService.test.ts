import { Container, useTestContainer } from '@stringsync/di';
import { EntityBuilder, User } from '@stringsync/domain';
import { REPOS_TYPES, UserRepo } from '@stringsync/repos';
import { SERVICES } from '../SERVICES';
import { SERVICES_TYPES } from '../SERVICES_TYPES';
import { NotificationService } from './NotificationService';

const TYPES = { ...SERVICES_TYPES, ...REPOS_TYPES };

describe('NotificationService', () => {
  const ref = useTestContainer(SERVICES);

  let container: Container;

  let notificationService: NotificationService;
  let userRepo: UserRepo;

  beforeEach(() => {
    container = ref.container;
  });

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
