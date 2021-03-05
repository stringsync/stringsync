import { PageInfo } from './types';

export const getInitialPageInfo = (): PageInfo => ({
  startCursor: null,
  endCursor: null,
  hasNextPage: true,
  hasPreviousPage: false,
});
