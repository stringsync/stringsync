export type PlayerStates = 'UNSTARTED' | 'ENDED' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'VIDEO_CUED';

export interface IPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
}

export interface IYTEvent {
  data: any;
  target: IPlayer;
}

export interface IYTStateChangeEvent extends IYTEvent {
  data: number;
}
