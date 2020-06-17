import { RootState } from '../createStore';

export const isLoggedInSelector = (state: RootState) => state.auth.user.id > 0;
