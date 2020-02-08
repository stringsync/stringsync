import { getWorkers } from './getWorkers';
import { getConfig } from '../config';
import { connectToRedis } from '../redis';
import { getLogger } from '../util';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  const redis = connectToRedis(config);
  const logger = getLogger();
  expect(() => getWorkers(redis, logger)).not.toThrow();
});
