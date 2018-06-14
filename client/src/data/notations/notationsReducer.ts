import * as actions from './notationsActions';
import { merge } from 'lodash';


export interface INotationsState {
  index: Notation.INotation[],
  show: Notation.INotation,
  edit: Notation.INotation
}

const getDefaultNotation = (): Notation.INotation => ({
  artistName: '',
  bpm: 120,
  deadTimeMs: 0,
  durationMs: 1,
  id: -1,
  songName: '',
  tags: [],
  thumbnailUrl: '',
  transcriber: {},
  vextabString: '',
  video: {
    kind: 'YOUTUBE',
    src: ''
  }
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
