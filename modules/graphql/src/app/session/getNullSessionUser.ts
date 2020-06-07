import { SessionUser } from './types';
import { UserRole } from '@stringsync/domain';

export const getNullSessionUser = (): SessionUser => ({
  id: '',
  role: UserRole.STUDENT,
  isLoggedIn: false,
});
