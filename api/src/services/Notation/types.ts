import { Stream } from 'stream';

export type FileUpload = {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream(): Stream;
};

export type CreateArgs = {
  songName: string;
  artistName: string;
  transcriberId: string;
  tagIds: string[];
  thumbnail: FileUpload;
  video: FileUpload;
};
