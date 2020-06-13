import { getWebConfig } from './getWebConfig';

it('runs without crashing', () => {
  const env = {
    NODE_ENV: 'NODE_ENV',
    REACT_APP_SERVER_URI: 'REACT_APP_SERVER_URI',
  };

  expect(() => getWebConfig(env)).not.toThrow();
});
