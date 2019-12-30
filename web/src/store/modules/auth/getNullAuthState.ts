import { AuthState } from './types';

export const getNullAuthState = (): AuthState => ({
  isPending: false,
  user: {
    id: '',
    username: '',
    email: '',
    role: 'student',
  },
  isLoggedIn: false,
  errors: [],
});
