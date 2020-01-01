import { getStore } from './getStore';

it('runs without crashing', () => {
  expect(getStore).not.toThrow();
});
