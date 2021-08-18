import { FileUpload } from 'graphql-upload';

export type CreateArgs = {
  songName: string;
  artistName: string;
  transcriberId: string;
  tagIds: string[];
  thumbnail: FileUpload;
  video: FileUpload;
};
