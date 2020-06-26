import { AuthService } from './AuthService';
import { useTestContainer, TYPES } from '@stringsync/container';
import { UserRole, buildUser } from '@stringsync/domain';

const container = useTestContainer();

let authService: AuthService;

beforeEach(async () => {
  authService = container.get<AuthService>(TYPES.AuthService);
});

describe('getSessionUser', () => {
  it('returns a null session user when the id is empty', async () => {
    const sessionUser = await authService.getSessionUser('');

    expect(sessionUser).toStrictEqual({
      id: '',
      role: UserRole.STUDENT,
      isLoggedIn: false,
    });
  });

  it('returns a null session user when the id does not exist', async () => {
    const sessionUser = await authService.getSessionUser('');

    expect(sessionUser).toStrictEqual({
      id: '',
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
