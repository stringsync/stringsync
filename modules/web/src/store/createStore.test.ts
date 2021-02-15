import { createStore } from './createStore';

describe('createStore', () => {
  it('runs without crashing', () => {
    expect(createStore).not.toThrow();
  });
});
