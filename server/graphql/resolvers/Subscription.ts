import { ResolverObject } from '../utils';

export const Subscription: ResolverObject = {
  feedSubscription: {
    subscribe: async (parent, args, ctx) => {
      return ctx.prisma.$subscribe
        .post({
          mutation_in: ['CREATED', 'UPDATED'],
        })
        .node();
    },
    resolve: payload => {
      return payload;
    },
  },
};
