import { createQueues } from './createQueues';
import { getConfig } from '../config';
import { connectToRedis } from '../redis';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  const redis = connectToRedis(config);
  expect(() => createQueues(redis)).not.toThrow();
});
