import { createKeyValue } from './createKeyValue';

test('creates a key value object', (done) => {
  const key = 'key';
  const value = Symbol('value');
  const keyValue = createKeyValue(key, value);
  expect(keyValue.key).toBe(key);
  expect(keyValue.value).toBe(value);
  done();
});
