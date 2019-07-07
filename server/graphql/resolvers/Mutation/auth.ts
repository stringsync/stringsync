import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ResolverObject, getAppSecret } from '../../utils';

export const auth: ResolverObject = {
  async signup(parent, args, ctx) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.prisma.createUser({ ...args, password });
    const appSecret = getAppSecret();

    return {
      token: jwt.sign({ userId: user.id }, appSecret),
      user,
    };
  },

  async login(parent, { email, password }, ctx) {
    const user = await ctx.prisma.user({ email });
    if (!user) {
      throw new Error(`No such user found for email: ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const appSecret = getAppSecret();
    return {
      token: jwt.sign({ userId: user.id }, appSecret),
      user,
    };
  },
};
