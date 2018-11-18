import { createAction } from '../createAction';
import { IPlayer, PlayerStates } from '../../@types/youtube';
import { IVideo } from '../../@types/video';

export const SET_VIDEO = 'SET_VIDEO';
export const RESET_VIDEO = 'RESET_VIDEO';
export const SET_PLAYER = 'SET_PLAYER';
export const SET_PLAYER_STATE = 'SET_PLAYER_STATE';

export const VideoActions = {
  resetVideo: () => createAction(RESET_VIDEO),
  setPlayer: (player: IPlayer) => createAction(SET_PLAYER, { player }),
  setPlayerState: (playerState: PlayerStates) => createAction(SET_PLAYER_STATE, { playerState }),
  setVideo: (video: IVideo) => createAction(SET_VIDEO, { video })
};

export type VideoActions = ActionsUnion<typeof VideoActions>;
