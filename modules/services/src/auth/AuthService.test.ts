import { AuthService } from './AuthService';
import { Container } from 'inversify';
import { createContainer, cleanupContainer, TYPES } from '@stringsync/container';
import { UserRole, buildUser } from '@stringsync/domain';

let container: Container;
let authService: AuthService;

beforeEach(async () => {
  container = await createContainer();
  authService = container.get<AuthService>(TYPES.AuthService);
});

afterEach(async () => {
  await cleanupContainer(container);
});

describe('getSessionUser', () => {
  it('returns a null session user when the id is empty', async () => {
    const sessionUser = await authService.getSessionUser('');

    expect(sessionUser).toStrictEqual({
      id: 0,
      role: UserRole.STUDENT,
      isLoggedIn: false,
    });
  });

  it('returns a null session user when the id does not exist', async () => {
    const sessionUser = await authService.getSessionUser('');

    expect(sessionUser).toStrictEqual({
      id: 0,
      role: UserRole.STUDENT,
      isLoggedIn: false,
    });
  });

  it('returns a session user when the id exists', async () => {
    const user = await authService.userRepo.create(buildUser());

    const sessionUser = await authService.getSessionUser(user.id);

    expect(sessionUser).toStrictEqual({
      id: user.id,
      role: user.role,
      isLoggedIn: true,
    });
  });
});
