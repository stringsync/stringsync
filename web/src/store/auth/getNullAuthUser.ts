import { UserRole } from '../../domain';
import { AuthUser } from './types';

export const getNullAuthUser = (): AuthUser => ({
  id: '',
  username: '',
  email: '',
  role: UserRole.STUDENT,
  confirmedAt: null,
});
