import { User } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { createRandUser } from '../../testing';
import { NotificationService } from './NotificationService';

describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = container.get<NotificationService>(TYPES.NotificationService);
  });

  describe('sendConfirmationEmail', () => {
    let user: User;

    beforeEach(async () => {
      user = await createRandUser();
    });

    it('runs without crashing', async () => {
      expect(() => notificationService.sendConfirmationEmail(user)).not.toThrow();
    });
  });
});
