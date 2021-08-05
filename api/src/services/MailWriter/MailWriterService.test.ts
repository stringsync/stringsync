import { User } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { createRandUser } from '../../testing';
import { MailWriterService } from './MailWriterService';

describe('NotificationService', () => {
  let mailWriterService: MailWriterService;

  beforeEach(() => {
    mailWriterService = container.get<MailWriterService>(TYPES.MailWriterService);
  });

  describe('sendConfirmationEmail', () => {
    let user: User;

    beforeEach(async () => {
      user = await createRandUser();
    });

    it('runs without crashing', async () => {
      expect(() => mailWriterService.writeConfirmationEmail(user)).not.toThrow();
    });
  });
});
