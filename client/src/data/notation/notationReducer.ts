import * as actions from './notationActions';

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

const getDefaultState = (): Notation.INotation => getDefaultNotation();

export const notationReducer = (state = getDefaultState(), action: actions.NotationActions): Notation.INotation => {
  let nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.RESET_NOTATION:
      nextState = getDefaultState();
      return nextState;
    
    case actions.SET_NOTATION:
      nextState = Object.assign({}, action.payload.notation);
      return nextState;

    default:
      return nextState;
  }
};
