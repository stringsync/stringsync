export interface Notation {
  id: string;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
  songName: string;
  artistName: string;
  deadTimeMs: number;
  durationMs: number;
  featured: boolean;
  transcriberId: string;
}

export type PublicNotation = Omit<Notation, 'rank'>;
