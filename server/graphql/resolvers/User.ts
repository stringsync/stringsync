import { ResolverObject } from '../utils';

export const User: ResolverObject = {
  posts: ({ id }, args, ctx) => {
    return ctx.prisma.user({ id }).posts();
  },
};
