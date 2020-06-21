import { Tag } from './../tag';
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
  transcriberId: number;
  transcriber?: User;
  tags: Tag[];
}
