import createStore from './createStore';
import { configure } from 'config';

test('createStore should add the store to the ss namespace', () => {
  configure();
  expect(window.ss.store).not.toBeDefined();
  const store = createStore();
  expect(window.ss.store).toBe(store);
});