import { createGlobalCtx } from './createGlobalCtx';
import { getConfig } from '../../config';
import { teardown } from '../../testing';

it('runs without crashing', async () => {
  const config = getConfig(process.env);
  expect(async () => {
    const ctx = createGlobalCtx(config);
    await teardown(ctx);
  }).not.toThrow();
});
