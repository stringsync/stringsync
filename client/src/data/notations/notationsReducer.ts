import * as actions from './notationsActions';
import { merge } from 'lodash';

export type INotationsState = StringSync.Store.INotationsState;

export const getDefaultNotation = (): Notation.INotation => ({
  artistName: '',
  bpm: 120,
  createdAt: new Date(1970, 1, 1),
  deadTimeMs: 0,
  durationMs: 1,
  id: -1,
  songName: '',
  tags: [],
  thumbnailUrl: '',
  transcriber: null,
  vextabString: '',
  video: null
});

const getDefaultState = (): INotationsState => ({
  edit: getDefaultNotation(),
  index: [],
  show: getDefaultNotation()
});

export const notationsReducer = (state = getDefaultState(), action: actions.NotationsActions): INotationsState => {
  const nextState = merge({}, state);

  switch(action.type) {
    
    case actions.RESET_NOTATIONS_EDIT:
      nextState.edit = getDefaultNotation();
      return nextState;

    case actions.RESET_NOTATIONS_SHOW:
      nextState.show = getDefaultNotation();
      return nextState;

    case actions.SET_NOTATIONS_EDIT:
      nextState.edit = action.payload.notation;
      return nextState;

    case actions.SET_NOTATIONS_SHOW:
      nextState.show = action.payload.notation;
      return nextState;

    case actions.SET_NOTATIONS_INDEX:
      nextState.index = action.payload.notations;
      return nextState;

    case actions.UPDATE_NOTATIONS_EDIT:
      nextState.edit = { ...nextState.edit, ...action.payload.notation };
      return nextState;

    default:
      return nextState;
  }
};
