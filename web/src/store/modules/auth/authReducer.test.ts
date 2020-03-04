import { authReducer } from './authReducer';
import { getInitialAuthState } from './getInitialAuthState';
import { authPending } from './authPending';
import { authSuccess } from './authSuccess';
import { authFailure } from './authFailure';
import { clearAuth } from './clearAuth';
import { getNullAuthState } from './getNullAuthState';
import { clearAuthErrors } from './clearAuthErrors';
import { AuthUser } from './types';

it('handles AUTH_PENDING actions', () => {
  const action = authPending();

  const state = authReducer(
    { ...getInitialAuthState(), errors: ['error1'] },
    action
  );

  expect(state.isPending).toBe(true);
  expect(state.errors).toHaveLength(0);
});

it('handles AUTH_SUCCESS actions', () => {
  const user: AuthUser = {
    email: 'email',
    id: 'id',
    role: 'teacher',
    username: 'username',
  };
  const action = authSuccess(user);

  const state = authReducer(
    { ...getInitialAuthState(), errors: ['error1'] },
    action
  );

  expect(state.isPending).toBe(false);
  expect(state.isLoggedIn).toBe(true);
  expect(state.user).toStrictEqual(user);
  expect(state.errors).toHaveLength(0);
});

it('handles AUTH_FAILURE actions', () => {
  const errors = ['error1', 'error2', 'error3'];
  const action = authFailure(errors);

  const state = authReducer(undefined, action);

  expect(state.errors).toEqual(errors);
});

it('handles CLEAR_AUTH actions', () => {
  const action = clearAuth();

  const state = authReducer(undefined, action);

  expect(state).toStrictEqual(getNullAuthState());
});

it('handles CLEAR_AUTH_ERRORS actions', () => {
  const action = clearAuthErrors();

  const state = authReducer(
    { ...getInitialAuthState(), errors: ['error1'] },
    action
  );

  expect(state.errors).toHaveLength(0);
});
