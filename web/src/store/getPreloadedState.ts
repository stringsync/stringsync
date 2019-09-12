import getInitialScreenState from './screen/getInitialState';
import { RootState } from '.';

export const getPreloadedState = (): RootState => ({
  screen: getInitialScreenState(),
});
