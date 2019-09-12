import createStore from './createStore';
import * as Screen from './screen/types';

export type Store = ReturnType<typeof createStore>;

export type Actions = Screen.ScreenActionTypes;

export interface RootState {
  screen: Screen.ScreenState;
}
