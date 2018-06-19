declare namespace Youtube {
  export type PlayerStates = 'UNSTARTED' | 'ENDED' | 'PLAYING' | 'PAUSED' | 'BUFFERING' | 'VIDEO_CUED';

  export interface IPlayer {
    getDuration: () => number;
    getCurrentTime: () => number;
  }
}
