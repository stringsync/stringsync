import { createStore } from './createStore';

it('runs without crashing', () => {
  expect(createStore).not.toThrow();
});
