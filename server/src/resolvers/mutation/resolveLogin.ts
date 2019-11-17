import { ForbiddenError } from 'apollo-server';
import { LoginInput } from 'common/types';
import { setUserSessionTokenCookie } from '../../user-session';
import { isPassword } from '../../encrypted-password';
import {
  getUserByEmailOrUsername,
  createUserSession,
  toUserPojo,
} from '../../db';
import { RequestContext } from '../../request-context';

interface Args {
  input: LoginInput;
}

export const WRONG_CREDENTIALS_MSG = 'wrong username, email, or password';

export const resolveLogin = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  const rawUser = await getUserByEmailOrUsername(
    ctx.db,
    args.input.emailOrUsername
  );

  if (!rawUser) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  if (!(await isPassword(args.input.password, rawUser.encryptedPassword))) {
    throw new ForbiddenError(WRONG_CREDENTIALS_MSG);
  }

  const rawUserSession = await createUserSession(
    ctx.db,
    rawUser.id,
    ctx.requestedAt
  );

  setUserSessionTokenCookie(rawUserSession, ctx.res);

  return { user: toUserPojo(rawUser) };
};
