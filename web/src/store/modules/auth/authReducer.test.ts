import { authReducer } from './authReducer';
import { getInitialAuthState } from './getInitialAuthState';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';
import { getClearAuthAction } from './getClearAuthAction';
import { getNullAuthState } from './getNullAuthState';
import { getClearAuthErrorsAction } from './getClearAuthErrorsAction';
import { AuthUser } from './types';

it('handles REQUEST_AUTH_PENDING actions', () => {
  const action = getRequestAuthPendingAction();

  const state = authReducer(
    { ...getInitialAuthState(), errors: ['error1'] },
    action
  );

  expect(state.isPending).toBe(true);
  expect(state.errors).toHaveLength(0);
});

it('handles REQUEST_AUTH_SUCCESS actions', () => {
  const user: AuthUser = {
    email: 'email',
    id: 'id',
    role: 'teacher',
    username: 'username',
  };
  const action = getRequestAuthSuccessAction(user);

  const state = authReducer(
    { ...getInitialAuthState(), errors: ['error1'] },
    action
  );

  expect(state.isPending).toBe(false);
  expect(state.isLoggedIn).toBe(true);
  expect(state.user).toStrictEqual(user);
  expect(state.errors).toHaveLength(0);
});

it('handles REQUEST_AUTH_FAILURE actions', () => {
  const errors = ['error1', 'error2', 'error3'];
  const action = getRequestAuthFailureAction(errors);

  const state = authReducer(undefined, action);

  expect(state.errors).toEqual(errors);
});

it('handles CLEAR_AUTH actions', () => {
  const action = getClearAuthAction();

  const state = authReducer(undefined, action);

  expect(state).toStrictEqual(getNullAuthState());
});

it('handles CLEAR_AUTH_ERRORS actions', () => {
  const action = getClearAuthErrorsAction();

  const state = authReducer(
    { ...getInitialAuthState(), errors: ['error1'] },
    action
  );

  expect(state.errors).toHaveLength(0);
});
