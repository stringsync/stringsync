import createStore from './createStore';
import * as Viewport from './modules/viewport/types';

export type Store = ReturnType<typeof createStore>;

export type Actions = Viewport.ViewportActionTypes;

export interface RootState {
  viewport: Viewport.ViewportState;
}
