export interface INotation {
  id: number | void;
  createdAt: Date;
  updatedAt: Date;
  songName: string;
  artistName: string;
  durationMs: number;
  deadTimeMs: number;
  thumbnailUrl: string;
  bpm: number;
  vextabString: string;
  tags: string[];
  transcriber: User.IBase | null;
  video: any | null;
}
