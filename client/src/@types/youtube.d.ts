declare namespace Youtube {
  export type PlayerStates = 'UNSTARTED' | 'ENDED' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'VIDEO_CUED';

  export interface IPlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    getDuration: () => number;
    getCurrentTime: () => number;
  }

  export interface IEvent {
    data: any;
    target: IPlayer;
  }

  export interface IStateChangeEvent extends IEvent {
    data: number;
  }
}
