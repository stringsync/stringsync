import { IScoreState } from '../../@types/store';

export const getDefaultState = (): IScoreState => ({
  maestro: null,
  scrolling: false,
  autoScroll: true
});
