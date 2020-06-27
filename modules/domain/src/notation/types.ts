export interface Notation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  songName: string;
  artistName: string;
  deadTimeMs: number;
  durationMs: number;
  bpm: number;
  featured: boolean;
  transcriberId: string;
}
