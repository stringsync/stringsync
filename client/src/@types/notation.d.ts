declare namespace Notation {
  export interface INotation {
    id: number | void;
    songName: string;
    artistName: string;
    durationMs: number;
    deadTimeMs: number;
    thumbnailUrl: string;
    bpm: number;
    vextabString: string;
    tags: string[];
    transcriber: User.IBaseUser | {};
    video: Video.IVideo | void;
  }
}
