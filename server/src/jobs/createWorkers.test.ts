import { createWorkers } from './createWorkers';
import { useTestGlobalCtx } from '../testing';

it(
  'runs without crashing',
  useTestGlobalCtx({}, async (ctx) => {
    expect(() => createWorkers(ctx)).not.toThrow();
  })
);
