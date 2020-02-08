import { getConfig } from './getConfig';

const MOCK_ENV = Object.freeze({
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  WEB_URI: 'WEB_URI',
  DB_NAME: 'DB_NAME',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
});

it('succeeds when all variables are specified', () => {
  const config = getConfig(MOCK_ENV);
  expect(config).toEqual(MOCK_ENV);
});

it('fails when missing a variable', () => {
  expect(() => getConfig({})).toThrow();
});

it('fails when it has an empty string for a variable', () => {
  expect(() => getConfig({ ...MOCK_ENV, NODE_ENV: '' })).toThrow();
});
