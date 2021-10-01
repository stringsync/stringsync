import { useContext } from 'react';
import { AuthApi, AuthApiCtx, AuthStateCtx } from './AuthCtx';
import { AuthState } from './types';

export const useAuth = (): [AuthState, AuthApi] => {
  const state = useContext(AuthStateCtx);
  const api = useContext(AuthApiCtx);
  return [state, api];
};
