import { getDefaultState } from './getDefaultState';
import * as actions from './videoActions';
import { IVideoState } from '../../@types/store';

const ACTIVE_PLAYER_STATES = [
  'PLAYING',
  'BUFFERING'
];

export const videoReducer = (state = getDefaultState(), action: actions.VideoActions): IVideoState => {
  const nextState = { ...state };

  switch (action.type) {
    case actions.RESET_VIDEO:
      return getDefaultState();

    case actions.SET_VIDEO:
      nextState.src = action.payload.video.src;
      nextState.kind = action.payload.video.kind;
      return nextState;

    case actions.SET_PLAYER:
      nextState.player = action.payload.player;
      return nextState;

    case actions.SET_PLAYER_STATE:
      nextState.playerState = action.payload.playerState;
      nextState.isActive = ACTIVE_PLAYER_STATES.some(activeState => {
        return action.payload.playerState === activeState;
      });
      return nextState;

    default:
      return nextState;
  }
};
