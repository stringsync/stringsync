import { signupResolver } from './signupResolver';
import { useTestReqCtx, getFixtures } from '../../../testing';
import { SignupInput } from 'common/types';
import { ForbiddenError, UserInputError } from 'apollo-server';
import { isPassword } from '../../../password';
import { ValidationError } from 'sequelize';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;
const USER_SESSION_TOKEN = USER_SESSION.token;
const PASSWORD = 'password';

it(
  'creates user in the db',
  useTestReqCtx({}, async (ctx) => {
    const input: SignupInput = {
      email: USER.email,
      password: PASSWORD,
      username: USER.username,
    };

    const { user } = await signupResolver(undefined, { input }, ctx);

    const userModel = await ctx.db.models.User.findByPk(user.id);
    expect(userModel).not.toBeNull();
    const isExpectedPassword = await isPassword(
      PASSWORD,
      userModel!.encryptedPassword
    );
    expect(isExpectedPassword).toBe(true);
    expect(userModel!.email).toBe(input.email);
    expect(userModel!.username).toBe(input.username);
  })
);

it(
  'returns the newly created user',
  useTestReqCtx({}, async (ctx) => {
    const input: SignupInput = {
      email: USER.email,
      password: PASSWORD,
      username: USER.username,
    };

    const { user } = await signupResolver(undefined, { input }, ctx);

    expect(user.email).toBe(input.email);
    expect(user.username).toBe(input.username);
  })
);

it(
  'logs in the newly created user',
  useTestReqCtx({}, async (ctx) => {
    const input: SignupInput = {
      email: USER.email,
      password: PASSWORD,
      username: USER.username,
    };

    const { user } = await signupResolver(undefined, { input }, ctx);

    const cookie = ctx.res.cookies['USER_SESSION_TOKEN'];
    expect(cookie).not.toBeNull();
    const token = cookie.value;
    expect(token).not.toBeNull();
    const userSessionModel = await ctx.db.models.UserSession.findOne({
      where: { token },
    });
    expect(userSessionModel).not.toBeNull();
    expect(userSessionModel!.userId).toBe(user.id);
  })
);

it(
  'throws a forbidden error when already logged in',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      const input: SignupInput = {
        email: 'foo272@gmail.com',
        password: 'password',
        username: 'foo272',
      };

      await expect(
        signupResolver(undefined, { input }, ctx)
      ).rejects.toThrowError(new ForbiddenError('already logged in'));
    }
  )
);

it(
  'throws a validation error when the user is already created',
  useTestReqCtx({ fixtures: { User: [USER] } }, async (ctx) => {
    const input: SignupInput = {
      email: USER.email,
      password: PASSWORD,
      username: USER.username,
    };

    await expect(
      signupResolver(undefined, { input }, ctx)
    ).rejects.toThrowError(ValidationError);
  })
);

it(
  'throws a user input error when password is < 6 chars',
  useTestReqCtx({}, async (ctx) => {
    const input: SignupInput = {
      email: USER.email,
      password: 'short',
      username: USER.username,
    };

    await expect(
      signupResolver(undefined, { input }, ctx)
    ).rejects.toThrowError(
      new UserInputError('password must be at least 6 characters')
    );
  })
);

it(
  'throws a user input error when password is > 256 chars',
  useTestReqCtx({}, async (ctx) => {
    const chars = new Array<string>(257);
    for (let i = 0; i < 257; i++) {
      chars[i] = 'a';
    }
    const password = chars.join('');

    const input: SignupInput = {
      email: USER.email,
      password,
      username: USER.username,
    };

    await expect(
      signupResolver(undefined, { input }, ctx)
    ).rejects.toThrowError(
      new UserInputError('password must be at most 256 characters')
    );
  })
);
