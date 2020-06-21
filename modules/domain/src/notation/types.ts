import { User } from './../user';

export interface Notation {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  songName: string;
  artistName: string;
  deadTimeMs: number;
  durationMs: number;
  bpm: number;
  featured: boolean;
  transcriber: User | Promise<User>;
}
