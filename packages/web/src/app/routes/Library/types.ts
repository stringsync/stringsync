import { PageInfo } from '@stringsync/common';
import { PublicNotation, PublicUser, Tag } from '@stringsync/domain';
import { QueryNotationsArgs } from '../../../clients';

export enum LibraryStatus {
  IDLE,
  PENDING,
  SUCCESS,
  ERROR,
}
export type Transcriber = Pick<PublicUser, 'id' | 'username' | 'role' | 'avatarUrl'>;

export type NotationPreview = Omit<PublicNotation, 'createdAt' | 'updatedAt'> & {
  transcriber: Transcriber;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
};

export type QueryMatch = {
  str: string;
  matches: boolean;
};

export type LibraryState = {
  status: LibraryStatus;
  notations: NotationPreview[];
  pageInfo: PageInfo;
  errors: Error[];
  loadMoreNotations: (args: QueryNotationsArgs) => void;
  clearNotations: () => void;
  clearErrors: () => void;
};
