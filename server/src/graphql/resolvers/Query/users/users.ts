import { toUser } from '../../../../data/db';
import {
  UsersInput,
  compose,
  AuthRequirements,
  UsersOutput,
} from '../../../../common';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../../util/ctx';
import { withAuthRequirement } from '../../../middlewares';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN_AS_ADMIN)
);

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  UsersInput
> = async (src, args, ctx): Promise<UsersOutput> => {
  const users = await ctx.db.models.User.findAll();
  return users.map(toUser);
};

export const users = middleware(resolver);
