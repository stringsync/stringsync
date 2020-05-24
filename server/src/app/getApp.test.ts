import { getApp } from './getApp';
import { getConfig } from '../config';
import { createGlobalCtx } from '../util/ctx';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  const gctx = createGlobalCtx(config);
  expect(() => getApp(gctx)).not.toThrow();
});
