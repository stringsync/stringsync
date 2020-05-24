import { createGlobalCtx } from './createGlobalCtx';
import { getConfig } from '../../config';

it('runs without crashing', async () => {
  const config = getConfig(process.env);
  expect(async () => {
    const ctx = createGlobalCtx(config);

    // teardown
    await ctx.db.sequelize.close();

    const queues = Object.values(ctx.queues);
    await Promise.all(queues.map((queue) => queue.close()));

    await ctx.redis.quit();
  }).not.toThrow();
});
