declare namespace Notation {
  export interface INotation {
    id: number | void;
    createdAt: Date;
    songName: string;
    artistName: string;
    durationMs: number;
    deadTimeMs: number;
    thumbnailUrl: string;
    bpm: number;
    vextabString: string;
    tags: string[];
    transcriber: User.IBaseUser | null;
    video: Video.IVideo | null;
  }
}
