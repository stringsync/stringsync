import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';
import { REQUEST_AUTH_FAILURE } from './constants';

it('creates REQUEST_AUTH_FAILURE actions', () => {
  const errors = ['error1', 'error2', 'error3'];

  const action = getRequestAuthFailureAction(errors);

  expect(action.type).toBe(REQUEST_AUTH_FAILURE);
  expect(action.payload.errors).toEqual(errors);
});
