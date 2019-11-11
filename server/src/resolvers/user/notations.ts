import { User } from 'common/types';
import { RequestContext } from '../../request-context';

interface Args {}

export const notations = (user: User, args: Args, ctx: RequestContext) => {
  return ctx.dataLoaders.notationsByUserId.load(user.id);
};
