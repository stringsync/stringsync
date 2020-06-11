import { HistoryState } from './types';

export const getInitialHistoryState = (): HistoryState => ({
  returnToRoute: '/library',
});
