import { RedisClient } from 'redis';
import { Config } from '../../../config';
import { container } from '../../../inversify.config';
import { TYPES } from '../../../inversify.constants';
import { withSession } from './withSession';

describe('withSession', () => {
  let redis: RedisClient;
  let config: Config;

  beforeEach(() => {
    redis = container.get<RedisClient>(TYPES.Redis);
    config = container.get<Config>(TYPES.Config);
  });

  it('runs without crashing', () => {
    expect(() => withSession(redis, config)).not.toThrow();
  });
});
