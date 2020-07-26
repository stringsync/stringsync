import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { PublicNotation, PublicUser } from '@stringsync/domain';

export type Notation = Pick<PublicNotation, 'id' | 'createdAt' | 'updatedAt' | 'songName' | 'artistName'>;

export type Transcriber = Pick<PublicUser, 'id' | 'username' | 'role' | 'avatarUrl'>;

export type NotationPreview = Notation & { transcriber: Transcriber };

export type LibraryState = {
  notations: NotationPreview[];
};

export type LibraryReducers = {
  addNotations: CaseReducer<LibraryState, PayloadAction<{ notations: NotationPreview[] }>>;
};
