import { connectToRedis } from './connectToRedis';
import { getConfig } from '../../config';

const config = getConfig(process.env);

it('runs without crashing', async () => {
  const testRedis = async () => {
    const redis = connectToRedis(config);
    await redis.ping();
    await redis.quit();
  };
  await expect(testRedis()).resolves.not.toThrow();
});
