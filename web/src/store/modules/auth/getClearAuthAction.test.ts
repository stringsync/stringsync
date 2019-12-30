import { getClearAuthAction } from './getClearAuthAction';
import { CLEAR_AUTH } from './constants';

it('creates CLEAR_AUTH actions', () => {
  const action = getClearAuthAction();
  expect(action.type).toBe(CLEAR_AUTH);
});
