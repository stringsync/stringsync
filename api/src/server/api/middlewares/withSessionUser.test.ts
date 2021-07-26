import { container } from '../../../inversify.config';
import { TYPES } from '../../../inversify.constants';
import { AuthService } from '../../../services';
import { withSessionUser } from './withSessionUser';

describe('withSessionUser', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = container.get<AuthService>(TYPES.AuthService);
  });

  it('runs without crashing', () => {
    expect(() => withSessionUser(authService)).not.toThrow();
  });
});
