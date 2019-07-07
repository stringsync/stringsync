import { ResolverObject } from '../utils';

export const Post: ResolverObject = {
  author: ({ id }, args, ctx) => {
    return ctx.prisma.post({ id }).author();
  },
};
