import { toCanonicalUser } from '../../../data/db';
import { User, UsersInput, compose, AuthRequirements } from '../../../common';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../util/ctx';
import { withAuthRequirement } from '../../middlewares';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_IN_AS_ADMIN)
);

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  { input: UsersInput }
> = async (src, args, ctx): Promise<User[]> => {
  const users = await ctx.db.models.User.findAll();
  return users.map(toCanonicalUser);
};

export const users = middleware(resolver);
