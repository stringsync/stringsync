import { AuthState } from './types';
import { UserRole } from '@stringsync/domain';

export const getNullAuthState = (): AuthState => ({
  isPending: false,
  user: {
    id: 0,
    username: '',
    email: '',
    role: UserRole.STUDENT,
    confirmedAt: null,
  },
  isLoggedIn: false,
  errors: [],
});
