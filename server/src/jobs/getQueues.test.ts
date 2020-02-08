import { getQueues } from './getQueues';
import { getConfig } from '../config';
import { connectToRedis } from '../redis';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  const redis = connectToRedis(config);
  expect(() => getQueues(redis)).not.toThrow();
});
