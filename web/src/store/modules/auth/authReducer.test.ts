import { authReducer } from './authReducer';
import { getRequestAuthFailureAction } from './getRequestAuthFailureAction';

it('handles request auth failure actions', () => {
  const errors = ['foo', 'bar', 'baz'];
  const action = getRequestAuthFailureAction(errors);

  const state = authReducer(undefined, action);

  expect(state.errors).toEqual(errors);
});
