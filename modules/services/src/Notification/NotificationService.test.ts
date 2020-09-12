import { TestFactory } from './../../../common/src/rand/TestFactory';
import { useTestContainer, TYPES } from '@stringsync/di';
import { NotificationService } from './NotificationService';
import { UserRepo } from '@stringsync/repos';
import { User } from '@stringsync/domain';

const container = useTestContainer();

let notificationService: NotificationService;
let userRepo: UserRepo;

beforeEach(() => {
  notificationService = container.get<NotificationService>(TYPES.NotificationService);
  userRepo = container.get<UserRepo>(TYPES.UserRepo);
});

describe('sendConfirmationEmail', () => {
  let user: User;

  beforeEach(async () => {
    user = await userRepo.create(TestFactory.buildRandUser());
  });

  it('runs without crashing', async () => {
    expect(() => notificationService.sendConfirmationEmail(user)).not.toThrow();
  });
});
