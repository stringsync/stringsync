import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { PublicNotation, PublicUser, Tag } from '@stringsync/domain';
import { PageInfo } from '@stringsync/common';

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

export type LibraryReducers = {
  addNotations: CaseReducer<LibraryState, PayloadAction<{ notations: NotationPreview[] }>>;
};
