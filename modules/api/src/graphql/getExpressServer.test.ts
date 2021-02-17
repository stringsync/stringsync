import { getServerConfig } from '../config';
import { getExpressServer } from './getExpressServer';

describe('getExpressServer', () => {
  it('runs without crashing', () => {
    const config = getServerConfig();
    expect(() => getExpressServer(config)).not.toThrow();
  });
});
