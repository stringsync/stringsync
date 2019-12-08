import { signupResolver } from './signupResolver';
import { useTestCtx } from '../../testing';
import { SignupInput } from 'common/types';
import { UserInputError } from 'apollo-server';

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
