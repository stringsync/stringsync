import {
  UserInput,
  compose,
  AuthRequirements,
  UserOutput,
} from '../../../../common';
import { ResolverCtx } from '../../../../util/ctx';
import { withAuthRequirement } from '../../../middlewares';
import { Resolver } from '../../../types';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: Resolver<
  Promise<UserOutput>,
  undefined,
  UserInput,
  ResolverCtx
> = async (src, args, rctx) => {
  return await rctx.dataLoaders.usersById.load(args.input.id);
};

export const user = middleware(resolver);
