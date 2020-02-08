import { createWorkers } from './createWorkers';
import { getConfig } from '../config';
import { connectToRedis } from '../redis';
import { getLogger } from '../util';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  const redis = connectToRedis(config);
  const logger = getLogger();
  expect(() => createWorkers(redis, logger)).not.toThrow();
});
