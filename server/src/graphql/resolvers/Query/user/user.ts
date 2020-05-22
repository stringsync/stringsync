import {
  UserInput,
  User,
  compose,
  AuthRequirements,
  UserOutput,
} from '../../../../common';
import { ResolverCtx } from '../../../../util/ctx';
import { IFieldResolver } from 'graphql-tools';
import { withAuthRequirement } from '../../../middlewares';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  UserInput
> = async (src, args, ctx): Promise<UserOutput> => {
  return await ctx.dataLoaders.usersById.load(args.input.id);
};

export const user = middleware(resolver);
