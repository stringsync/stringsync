import { handleActions, combineActions } from 'redux-actions';
import { merge } from 'lodash';
import { videoActions as actions, videoDefaultState as defaultState } from './';

const videoReducer = handleActions({
  [combineActions(actions.player.set)]: (state, action) => ({
    ...state
  }),
  [combineActions(actions.playerState.set)]: (state, action) => ({
    ...state
  })
}, defaultState);

export default videoReducer;
