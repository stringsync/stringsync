import { clearAuth } from './clearAuth';
import { CLEAR_AUTH } from './constants';

it('creates CLEAR_AUTH actions', () => {
  const action = clearAuth();
  expect(action.type).toBe(CLEAR_AUTH);
});
