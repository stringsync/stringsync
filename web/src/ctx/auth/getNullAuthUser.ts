import { UserRole } from '../../lib/graphql';
import { AuthUser } from './types';

export const getNullAuthUser = (): AuthUser => ({
  id: '',
  username: '',
  email: '',
  role: UserRole.STUDENT,
  confirmedAt: null,
});
