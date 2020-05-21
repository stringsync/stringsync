import { getApp } from './getApp';
import { getConfig } from '../config';
import { createGlobalCtx } from '../util/ctx';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  const ctx = createGlobalCtx(config);
  expect(() => getApp(ctx)).not.toThrow();
});
