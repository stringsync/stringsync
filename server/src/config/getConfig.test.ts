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

it('succeeds when all variables are specified', (done) => {
  const config = getConfig(MOCK_ENV);
  expect(config).toEqual(MOCK_ENV);
  done();
});

it('fails when missing a variable', (done) => {
  expect(() => getConfig({})).toThrow();
  done();
});

it('fails when it has an empty string for a variable', (done) => {
  expect(() => getConfig({ ...MOCK_ENV, NODE_ENV: '' })).toThrow();
  done();
});
