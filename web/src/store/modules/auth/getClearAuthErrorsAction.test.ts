import { getClearAuthErrorsAction } from './getClearAuthErrorsAction';
import { CLEAR_AUTH_ERRORS } from './constants';

it('creates CLEAR_AUTH_ERRORS actions', () => {
  const action = getClearAuthErrorsAction();
  expect(action.type).toBe(CLEAR_AUTH_ERRORS);
});
