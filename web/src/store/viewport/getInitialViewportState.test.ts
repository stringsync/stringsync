import { getInitialViewportState } from './getInitialViewportState';

it('runs without crashing', () => {
  expect(getInitialViewportState).not.toThrow();
});
