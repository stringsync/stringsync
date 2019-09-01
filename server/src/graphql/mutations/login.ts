import { GraphQLFieldConfigMap } from 'graphql';
import { StringSync } from '@/types/string-sync';
import { User, UserInput } from '../types/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Args {
  userInput: UserInput;
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
        throw new Error('user does not exist');
      }
      const valid = await bcrypt.compare(password, user.encryptedPassword);
      if (!valid) {
        throw new Error('invalid username or password');
      }
      return {
        ...user,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
      };
    },
  },
};
