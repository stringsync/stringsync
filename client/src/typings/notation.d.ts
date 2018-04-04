declare interface Notation {
  songName: string;
  artistName: string;
  durationMs: number;
  deadTimeMs: number;
  bpm: number;
  vextabString: string;
  tags: Tag[];
  transcriber?: User;
}
