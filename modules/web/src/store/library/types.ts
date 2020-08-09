import { PageInfo } from '@stringsync/common';
import { PublicNotation, PublicUser, Tag } from '@stringsync/domain';

export type Notation = Pick<
  PublicNotation,
  'id' | 'createdAt' | 'updatedAt' | 'songName' | 'artistName' | 'thumbnailUrl'
>;

export type Transcriber = Pick<PublicUser, 'id' | 'username' | 'role' | 'avatarUrl'>;

export type NotationPreview = Notation & { transcriber: Transcriber; tags: Tag[] };

export type LibraryState = {
  isPending: boolean;
  notations: NotationPreview[];
  pageInfo: PageInfo;
  errors: string[];
};

export type LibraryReducers = {};
