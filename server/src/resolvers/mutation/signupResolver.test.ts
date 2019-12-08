import { signupResolver } from './signupResolver';
import { useTestCtx } from '../../testing';
import { SignupInput } from 'common/types';
import { UserInputError } from 'apollo-server';
import { isPassword } from '../../password';

it(
  'returns the newly created user',
  useTestCtx({}, {}, async (ctx) => {
    const email = 'foo@gmail.com';
    const password = 'password';
    const username = 'foo';

    const input: SignupInput = {
      email,
      password,
      username,
    };

    const { user } = await signupResolver(undefined, { input }, ctx);
    expect(user.email).toBe(email);
    expect(user.username).toBe(username);
  })
);

it(
  'creates user in the db',
  useTestCtx({}, {}, async (ctx) => {
    const email = 'foo@gmail.com';
    const password = 'password';
    const username = 'foo';

    const input: SignupInput = {
      email,
      password,
      username,
    };

    const { user } = await signupResolver(undefined, { input }, ctx);

    const userModel = await ctx.db.models.User.findByPk(user.id);
    expect(userModel).not.toBeNull();
    const isExpectedPassword = await isPassword(
      password,
      userModel!.encryptedPassword
    );
    expect(isExpectedPassword).toBe(true);
    expect(userModel!.email).toBe(email);
    expect(userModel!.username).toBe(username);
  })
);

it(
  'transforms validation errors to UserInputErrors',
  useTestCtx({}, {}, async (ctx) => {
    const input: SignupInput = {
      email: '',
      password: '',
      username: '',
    };
    await expect(
      signupResolver(undefined, { input }, ctx)
    ).rejects.toThrowError(UserInputError);
  })
);
