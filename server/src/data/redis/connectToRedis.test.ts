import { connectToRedis } from './connectToRedis';
import { getConfig } from '../../config';

const config = getConfig(process.env);

it('runs without crashing', () => {
  expect(() => connectToRedis(config)).not.toThrow();
});
