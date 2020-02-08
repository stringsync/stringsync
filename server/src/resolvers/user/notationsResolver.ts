import { User } from 'common/types';
import { ReqCtx } from '../../ctx';

interface Args {}

export const notationsResolver = (user: User, args: Args, ctx: ReqCtx) => {
  return ctx.dataLoaders.notationsByUserId.load(user.id);
};
