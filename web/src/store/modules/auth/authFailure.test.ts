import { authFailure } from './authFailure';
import { AUTH_FAILURE } from './constants';

it('creates AUTH_FAILURE actions', () => {
  const errors = ['error1', 'error2', 'error3'];

  const action = authFailure(errors);

  expect(action.type).toBe(AUTH_FAILURE);
  expect(action.payload.errors).toEqual(errors);
});
