import { getWebConfig } from './getWebConfig';

it('runs without crashing', () => {
  const env = {
    REACT_APP_SERVER_URI: 'REACT_APP_SERVER_URI',
  };

  expect(() => getWebConfig(env)).not.toThrow();
});
