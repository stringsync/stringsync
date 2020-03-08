import { setReturnToRoute } from './setReturnToRoute';
import { SET_RETURN_TO_ROUTE } from './constants';

it('creates SET_RETURN_TO_ROUTE actions', () => {
  const route = '/foo?bar=baz';
  const action = setReturnToRoute(route);

  expect(action.type).toBe(SET_RETURN_TO_ROUTE);
  expect(action.payload.returnToRoute).toBe(route);
});
