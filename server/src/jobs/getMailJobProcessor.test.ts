import { getMailJobProcessor } from './getMailJobProcessor';
import { useTestGlobalCtx } from '../testing';

it(
  'runs without crashing',
  useTestGlobalCtx({}, async (ctx) => {
    expect(() => getMailJobProcessor(ctx)).not.toThrow();
  })
);
