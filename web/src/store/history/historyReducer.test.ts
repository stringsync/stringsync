import { historyReducer } from './historyReducer';
import { setReturnToRoute } from './setReturnToRoute';

it('handles SET_RETURN_TO_ROUTE actions', () => {
  const route = '/foo?bar=baz';
  const action = setReturnToRoute(route);

  const state = historyReducer(undefined, action);

  expect(state.returnToRoute).toBe(route);
});
