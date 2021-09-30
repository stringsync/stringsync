import { AuthState } from './types';

export const isLoggedInSelector = (state: AuthState) => state.user.id !== '';
