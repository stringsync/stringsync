import getInitialScreenState from './screen/getInitialState';
import { State } from '.';

export const getPreloadedState = (): State => ({
  screen: getInitialScreenState(),
});
