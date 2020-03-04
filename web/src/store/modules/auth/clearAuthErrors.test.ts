import { clearAuthErrors } from './clearAuthErrors';
import { CLEAR_AUTH_ERRORS } from './constants';

it('creates CLEAR_AUTH_ERRORS actions', () => {
  const action = clearAuthErrors();
  expect(action.type).toBe(CLEAR_AUTH_ERRORS);
});
