import { IBase } from "./user";

export interface INotation {
  id: number | void;
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  songName: string;
  artistName: string;
  durationMs: number;
  deadTimeMs: number;
  thumbnailUrl: string;
  bpm: number;
  vextabString: string;
  tags: string[];
  transcriber: IBase | null;
  video: any | null;
}
