import { createAction } from '../createAction';
import { IPlayer, PlayerStates } from '../../@types/youtube';
import { IVideo } from '../../@types/video';

export const SET_VIDEO = 'video/SET_VIDEO';
export const RESET_VIDEO = 'video/RESET_VIDEO';
export const SET_PLAYER = 'video/SET_PLAYER';
export const SET_PLAYER_STATE = 'video/SET_PLAYER_STATE';
export const SET_CURRENT_TIME_MS = 'video/SET_CURRENT_TIME_MS';

export const VideoActions = {
  resetVideo: () => createAction(RESET_VIDEO),
  setPlayer: (player: IPlayer) => createAction(SET_PLAYER, { player }),
  setPlayerState: (playerState: PlayerStates) => createAction(SET_PLAYER_STATE, { playerState }),
  setVideo: (video: IVideo) => createAction(SET_VIDEO, { video }),
  setCurrentTimeMs: (currentTimeMs: number) => createAction(SET_CURRENT_TIME_MS, { currentTimeMs })
};

export type VideoActions = ActionsUnion<typeof VideoActions>;
