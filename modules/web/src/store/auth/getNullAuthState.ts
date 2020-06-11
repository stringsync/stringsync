import { AuthState } from './types';

export const getNullAuthState = (): AuthState => ({
  isPending: false,
  user: {
    id: '',
    username: '',
    email: '',
    role: 'student',
    confirmedAt: null,
  },
  isLoggedIn: false,
  errors: [],
});
