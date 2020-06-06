import { getMigraterConfig } from './getMigraterConfig';

it('runs without crashing', () => {
  const env = {
    DB_NAME: 'DB_NAME',
    DB_USERNAME: 'DB_USERNAME',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_HOST: 'DB_HOST',
    DB_PORT: '5432',
  };

  expect(() => getMigraterConfig(env)).not.toThrow();
});
