import { getTransporter } from './getTransporter';
import { useTestGlobalCtx } from '../../../testing';

it.each(['test', 'development'])('runs without crashing', (nodeEnv) => {
  useTestGlobalCtx({ config: { NODE_ENV: nodeEnv } }, async (ctx) => {
    await expect(() => getTransporter(ctx)).not.toThrow();
  });
});
