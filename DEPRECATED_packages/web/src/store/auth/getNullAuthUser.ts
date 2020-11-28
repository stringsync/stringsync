import { AuthUser } from './types';
import { UserRole } from '@stringsync/domain';

export const getNullAuthUser = (): AuthUser => ({
  id: '',
  username: '',
  email: '',
  role: UserRole.STUDENT,
  confirmedAt: null,
});
