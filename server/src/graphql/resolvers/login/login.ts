import { isPassword } from '../../../util/password';
import { toCanonicalUser } from '../../../data/db';
import { ResolverCtx } from '../../../util/ctx';
import { IFieldResolver } from 'graphql-tools';
import { ForbiddenError } from '../../../common/errors';
import { toSessionUser } from '../../../util/session';
import { withAuthRequirement } from '../../middlewares';
import {
  LoginInput,
  LoginOutput,
  compose,
  AuthRequirements,
} from '../../../common';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT)
);

export const resolver: IFieldResolver<
  undefined,
  ResolverCtx,
  { input: LoginInput }
> = async (src, args, ctx): Promise<LoginOutput> => {
  const email = args.input.emailOrUsername;
  const username = args.input.emailOrUsername;
  const user = await ctx.db.models.User.findOne({
    where: { or: [{ email }, { username }] },
  });

  if (!user) {
    throw new ForbiddenError('wrong username, email, or password');
  }
  if (!(await isPassword(args.input.password, user.encryptedPassword))) {
    throw new ForbiddenError('wrong username, email, or password');
  }

  ctx.req.session.user = toSessionUser(user);

  return { user: toCanonicalUser(user) };
};

export const login = middleware(resolver);
