import { GraphQLFieldConfigMap } from 'graphql';
import { StringSync } from '@/types/string-sync';
import { User, UserInput } from '../types/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Args {
  userInput: UserInput;
}

export class AuthError extends Error {
  constructor() {
    super('invalid username or password');
  }
}

export const login: GraphQLFieldConfigMap<
  undefined,
  StringSync.ResolverContext,
  Args
> = {
  login: {
    type: User,
    description: 'Fetches an existing user and creates a jwt',
    args: {
      userInput: { type: UserInput },
    },
    resolve: async (parent, args, ctx, info) => {
      const { username, password } = args.userInput;
      const user = await ctx.prisma.user({ username });
      if (!user) {
        throw new AuthError();
      }
      const valid = await bcrypt.compare(password, user.encryptedPassword);
      if (!valid) {
        throw new AuthError();
      }
      return {
        ...user,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
      };
    },
  },
};
