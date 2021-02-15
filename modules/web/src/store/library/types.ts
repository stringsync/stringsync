import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { PageInfo } from '@stringsync/common';
import { PublicNotation, PublicUser, Tag } from '@stringsync/domain';

export type Notation = Pick<
  PublicNotation,
  'id' | 'createdAt' | 'updatedAt' | 'songName' | 'artistName' | 'thumbnailUrl'
>;

export type Transcriber = Pick<PublicUser, 'id' | 'username' | 'role' | 'avatarUrl'>;

export type NotationPreview = Omit<Notation, 'createdAt' | 'updatedAt'> & {
  transcriber: Transcriber;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type LibraryState = {
  query: string;
  tagIds: string[];
  isPending: boolean;
  notations: NotationPreview[];
  pageInfo: PageInfo;
  errors: string[];
};

export type LibraryReducers = {
  setQuery: CaseReducer<LibraryState, PayloadAction<{ query: string }>>;
  setTagIds: CaseReducer<LibraryState, PayloadAction<{ tagIds: string[] }>>;
  clearErrors: CaseReducer<LibraryState>;
  clearPages: CaseReducer<LibraryState>;
};
