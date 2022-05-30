import { Notation, Tag, User } from '../../domain';
import { QueryNotationsArgs } from '../../graphql';
import { PageInfo } from '../../util/pager';

export enum LibraryStatus {
  READY,
  LOADING,
  LOADED,
}
export type Transcriber = Pick<User, 'id' | 'username' | 'role' | 'avatarUrl'>;

export type NotationPreview = Omit<Notation, 'createdAt' | 'updatedAt'> & {
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
  isInitialized: boolean;
  errors: Error[];
  loadMoreNotations: (args: QueryNotationsArgs) => void;
  resetLibrary: () => void;
  clearErrors: () => void;
  ready: () => void;
};
