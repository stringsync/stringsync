import { getPreloadedState } from './getPreloadedState';

it('runs without crashing', () => {
  expect(getPreloadedState).not.toThrow();
});
