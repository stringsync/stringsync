import { GlobalCtx, createGlobalCtx } from '../util/ctx';
import { getConfig } from '../config';

export const setup = (): GlobalCtx => {
  const config = getConfig(process.env);
  return createGlobalCtx(config);
};
