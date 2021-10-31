import { FileUpload } from 'graphql-upload';

export type CreateArgs = {
  songName: string;
  artistName: string;
  transcriberId: string;
  tagIds: string[];
  thumbnail: FileUpload;
  video: FileUpload;
};

export type UpdateArgs = {
  songName?: string;
  artistName?: string;
  deadTimeMs?: number;
  durationMs?: number;
  private?: boolean;
  thumbnail?: FileUpload;
  musicXml?: FileUpload;
};
