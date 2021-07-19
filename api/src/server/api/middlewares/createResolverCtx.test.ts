import { validateCtx } from '../../../resolvers';
import { createResolverCtx } from './createResolverCtx';
import { Ctx } from './Ctx';

describe('createResolverCtx', () => {
  let req: any;

  beforeEach(() => {
    req = {};
    Ctx.bind(req);
  });

  it('returns a valid resolver context', () => {
    const resolverCtx = createResolverCtx(req);
    const isValidResolverCtx = validateCtx(resolverCtx);
    expect(isValidResolverCtx).toBe(true);
  });
});
