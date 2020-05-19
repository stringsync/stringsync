import { getApp } from './getApp';
import { getSchema } from '../resolvers';
import { getConfig } from '../config';
import { createGlobalCtx } from '../ctx';

it('runs without crashing', () => {
  const schema = getSchema();
  const config = getConfig(process.env);
  const ctx = createGlobalCtx(config);

  expect(() => getApp(schema, ctx)).not.toThrow();
});
