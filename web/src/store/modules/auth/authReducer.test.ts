import { authReducer } from './authReducer';
import { getInitialAuthState } from './getInitialAuthState';
import { getRequestAuthPendingAction } from './getRequestAuthPendingAction';
import { getRequestAuthSuccessAction } from './getRequestAuthSuccessAction';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';

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
  const user = {
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
