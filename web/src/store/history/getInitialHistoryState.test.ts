import { getInitialHistoryState } from './getInitialHistoryState';

it('runs without crashing', () => {
  expect(getInitialHistoryState).not.toThrow();
});
