import { AuthUser } from './types';
import { UserRole } from '@stringsync/domain';

export const getNullAuthUser = (): AuthUser => ({
  id: 0,
  username: '',
  email: '',
  role: UserRole.STUDENT,
  confirmedAt: null,
});
