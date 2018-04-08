import { handleActions, combineActions } from 'redux-actions';
import { videoActions as actions, videoDefaultState as defaultState } from './';

const videoReducer = handleActions({
  [combineActions(actions.video.set)]: (state, action) => ({
    ...state,
    kind: action.payload.kind,
    src: action.payload.src
  }),
  [combineActions(actions.player.set)]: (state, action) => ({
    ...state,
    player: action.payload.player
  }),
  [combineActions(actions.playerState.set)]: (state, action) => ({
    ...state,
    playerState: action.payload.playerState
  })
}, defaultState);

export default videoReducer;
