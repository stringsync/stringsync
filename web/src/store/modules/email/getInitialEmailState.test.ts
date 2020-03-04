import { getInitialEmailState } from './getInitialEmailState';

it('runs without crashing', () => {
  expect(getInitialEmailState).not.toThrow();
});
