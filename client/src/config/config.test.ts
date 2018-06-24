import { configure } from './';

test('successfully configures the app', () => {
  configure();

  const { ss } = window;

  expect(ss.env).toBe('test');
  expect(ss.auth).toBeDefined();
  expect(ss.message).toBeDefined();
  expect(ss.notification).toBeDefined();
  expect(ss.sessionSync).toBeDefined();
  expect(ss.store).not.toBeDefined();
});
