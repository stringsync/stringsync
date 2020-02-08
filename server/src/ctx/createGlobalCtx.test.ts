import { createGlobalCtx } from './createGlobalCtx';
import { getConfig } from '../config';

it('runs without crashing', () => {
  const config = getConfig(process.env);
  expect(() => createGlobalCtx(config)).not.toThrow();
});
