import { difference, get } from 'lodash';
import { InternalError } from '../errors';
import { ResolverCtx } from './types';

const REQUIRED_KEYS: (keyof ResolverCtx)[] = [
  'getContainer',
  'getReqAt',
  'getContainer',
  'getSessionUser',
  'setSessionUser',
];

export const validateCtx = (ctx: unknown): ctx is ResolverCtx => {
  if (typeof ctx !== 'object') {
    throw new InternalError('ctx must be an object');
  }
  if (!ctx) {
    throw new InternalError('ctx must not be null');
  }
  const missingKeys = difference(REQUIRED_KEYS, Object.keys(ctx));
  if (missingKeys.length > 0) {
    throw new InternalError(`ctx missing keys: ${missingKeys.join(', ')}`);
  }
  const wrongTypeKeys = Object.keys(ctx).filter((key) => typeof get(ctx, key) !== 'function');
  if (wrongTypeKeys.length > 0) {
    throw new InternalError(`ctx keys are not functions: ${wrongTypeKeys.join(', ')}`);
  }
  return true;
};
