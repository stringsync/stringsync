import { SessionUser } from './types';

export const getNullSessionUser = (): SessionUser => ({
  id: '',
  role: 'student',
  isLoggedIn: false,
});
