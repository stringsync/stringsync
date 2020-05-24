import { createGlobalCtx } from './createGlobalCtx';
import { getConfig } from '../../config';

it('runs without crashing', async () => {
  const config = getConfig(process.env);
  expect(async () => {
    const gctx = createGlobalCtx(config);

    // teardown
    await gctx.db.sequelize.close();

    const queues = Object.values(gctx.queues);
    await Promise.all(queues.map((queue) => queue.close()));

    await gctx.redis.quit();
  }).not.toThrow();
});
