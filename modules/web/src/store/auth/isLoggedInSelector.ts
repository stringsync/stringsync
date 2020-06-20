import { RootState } from '../types';

export const isLoggedInSelector = (state: RootState) => state.auth.user.id > 0;
