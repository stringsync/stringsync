import { getServer } from './getServer';
import { getSchema } from '../resolvers';
import { getConfig } from '../config';
import { createGlobalCtx } from '../ctx';

it('runs without crashing', () => {
  const schema = getSchema();
  const config = getConfig(process.env);
  const ctx = createGlobalCtx(config);

  expect(() => getServer(schema, ctx)).not.toThrow();
});
