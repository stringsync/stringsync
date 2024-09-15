import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { RedisCache } from './RedisCache';

describe('RedisCache', () => {
  let redisCache: RedisCache;

  beforeEach(() => {
    redisCache = container.get<RedisCache>(TYPES.Cache);
  });

  it('honors the expiration time', async () => {
    // Expires in 1 ms.
    redisCache.set('foo', 'bar', 1);
    await wait(1);
    expect(redisCache.get('foo')).resolves.toBe('');
  });
});

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
