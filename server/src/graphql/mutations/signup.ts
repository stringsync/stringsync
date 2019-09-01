import { User, UserInput } from '../types/User';
import { GraphQLFieldConfigMap } from 'graphql';
import { StringSync } from '@/types/string-sync';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface Args {
  userInput: UserInput;
}

export const BCRYPT_HASH_COST = 10;

export const signup: GraphQLFieldConfigMap<
  undefined,
  StringSync.ResolverContext,
  Args
> = {
  signup: {
    type: User,
    description: 'Creates a new user',
    args: {
      userInput: { type: UserInput },
    },
    resolve: async (parent, args, ctx, info) => {
      const { username, password } = args.userInput;
      const encryptedPassword = await bcrypt.hash(password, BCRYPT_HASH_COST);
      const user = await ctx.prisma.createUser({ username, encryptedPassword });
      return {
        ...user,
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
      };
    },
  },
};
