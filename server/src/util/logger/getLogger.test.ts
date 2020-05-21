import { getLogger } from './getLogger';

it('runs without crashing', () => {
  expect(getLogger).not.toThrow();
});
