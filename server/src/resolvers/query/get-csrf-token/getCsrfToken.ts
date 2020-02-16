import { ReqCtx } from '../../../ctx';

interface Args {}

export const getCsrfToken = (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): string => {
  return 'csrftoken';
};
