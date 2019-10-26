import { getConfig } from './getConfig';

const MOCK_ENV = Object.freeze({
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  CLIENT_URI: 'CLIENT_URI',
  DB_NAME: 'DB_NAME',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
});

test('getConfig when has all env var succeeds', (done) => {
  const config = getConfig(MOCK_ENV);
  expect(config).toEqual(MOCK_ENV);
  done();
});

test('getConfig when missing an env var fails', (done) => {
  expect(() => getConfig({})).toThrow();
  done();
});

test('getConfig when has blank env var fails', (done) => {
  expect(() => getConfig({ ...MOCK_ENV, NODE_ENV: '' })).toThrow();
  done();
});
