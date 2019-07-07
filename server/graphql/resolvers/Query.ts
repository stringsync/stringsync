import { getUserId, ResolverObject, Context } from '../utils';

export const Query: ResolverObject = {
  feed(parent, args, ctx) {
    return ctx.prisma.posts({ where: { published: true } });
  },
  drafts(parent, args, ctx) {
    const id = getUserId(ctx);

    const where = {
      published: false,
      author: {
        id,
      },
    };

    return ctx.prisma.posts({ where });
  },
  post(parent, { id }, ctx) {
    return ctx.prisma.post({ id });
  },
  me(parent, args, ctx) {
    const id = getUserId(ctx);
    return ctx.prisma.user({ id });
  },
};
