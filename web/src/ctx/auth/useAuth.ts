import { Dispatch, useContext } from 'react';
import { AuthDispatchCtx, AuthStateCtx } from './AuthCtx';
import { AuthState } from './types';

export const useAuth = (): [AuthState, Dispatch<any>] => {
  const state = useContext(AuthStateCtx);
  const dispatch = useContext(AuthDispatchCtx);
  return [state, dispatch];
};
