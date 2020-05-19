import { createGlobalCtx } from './createGlobalCtx';
import { getConfig } from '../config';
import { cleanup } from '../testing';

it('runs without crashing', async () => {
  const config = getConfig(process.env);
  expect(async () => {
    const { db, redis, queues } = createGlobalCtx(config);
    await cleanup({ db, redis, queues });
  }).not.toThrow();
});
