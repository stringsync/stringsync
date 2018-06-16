import * as actions from './videoActions';

export type IVideoState = StringSync.Store.IVideoState;

const getDefaultState = (): IVideoState => ({
  isActive: undefined,
  kind: 'YOUTUBE',
  player: null,
  playerState: undefined,
  src: ''
});

export const videoReducer = (state = getDefaultState(), action: actions.VideoActions): IVideoState => {
  const nextState = {...state};

  switch (action.type) {

    case actions.RESET_VIDEO:
      return getDefaultState();

    case actions.SET_VIDEO:
      nextState.src = action.payload.src;
      nextState.kind = action.payload.kind;
      return nextState;

    case actions.SET_PLAYER:
      nextState.player = action.payload.player;
      return nextState;

    case actions.SET_PLAYER_STATE:
      nextState.playerState = action.payload.playerState;
      return nextState;

    default:
      return nextState;
  }
}
