import { isPassword } from '../../../../util/password';
import { toUser } from '../../../../data/db';
import { ResolverCtx } from '../../../../util/ctx';
import { ForbiddenError } from '../../../../common/errors';
import { toSessionUser } from '../../../../util/session';
import { withAuthRequirement } from '../../../middlewares';
import { or } from 'sequelize';
import {
  LoginInput,
  LoginOutput,
  compose,
  AuthRequirements,
} from '../../../../common';
import { Resolver } from '../../../types';

export const middleware = compose(
  withAuthRequirement(AuthRequirements.LOGGED_OUT)
);

export const resolver: Resolver<
  Promise<LoginOutput>,
  undefined,
  LoginInput,
  ResolverCtx
> = async (src, args, ctx) => {
  const email = args.input.emailOrUsername;
  const username = args.input.emailOrUsername;
  const user = await ctx.db.User.findOne({
    where: { ...or({ email }, { username }) },
  });

  if (!user) {
    throw new ForbiddenError('wrong username, email, or password');
  }
  if (!(await isPassword(args.input.password, user.encryptedPassword))) {
    throw new ForbiddenError('wrong username, email, or password');
  }

  ctx.req.session.user = toSessionUser(user);

  return { user: toUser(user) };
};

export const login = middleware(resolver);
