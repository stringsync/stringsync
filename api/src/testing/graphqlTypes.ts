export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type BadRequestError = {
  __typename?: 'BadRequestError';
  message: Scalars['String'];
};

export type ConfirmEmailInput = {
  confirmationToken: Scalars['String'];
};

export type ConfirmEmailOutput = EmailConfirmation | NotFoundError | BadRequestError | ForbiddenError | UnknownError;

export type CreateNotationInput = {
  songName: Scalars['String'];
  artistName: Scalars['String'];
  thumbnail: Scalars['Upload'];
  video: Scalars['Upload'];
  tagIds: Array<Scalars['String']>;
};

export type CreateNotationOutput = Notation | ForbiddenError | ValidationError | UnknownError;

export type CreateTagInput = {
  name: Scalars['String'];
  category: TagCategory;
};

export type CreateTagOutput = Tag | ForbiddenError | ValidationError | BadRequestError | UnknownError;


export type DeleteTagOutput = Processed | ForbiddenError | UnknownError;

export type EmailConfirmation = {
  __typename?: 'EmailConfirmation';
  confirmedAt: Scalars['DateTime'];
};

export type ForbiddenError = {
  __typename?: 'ForbiddenError';
  message: Scalars['String'];
};

export type Health = {
  __typename?: 'Health';
  isDbHealthy: Scalars['Boolean'];
  isCacheHealthy: Scalars['Boolean'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type LoginOutput = User | ForbiddenError;

export type LogoutOutput = Processed | ForbiddenError;

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginOutput;
  logout: LogoutOutput;
  signup: SignupOutput;
  confirmEmail: ConfirmEmailOutput;
  resendConfirmationEmail: ResendConfirmationEmailOutput;
  sendResetPasswordEmail: Processed;
  resetPassword: ResetPasswordOutput;
  createNotation: CreateNotationOutput;
  updateNotation: UpdateNotationOutput;
  updateTag: UpdateTagOutput;
  createTag: CreateTagOutput;
  deleteTag: DeleteTagOutput;
  updateUser: UpdateUserOutput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationSignupArgs = {
  input: SignupInput;
};


export type MutationConfirmEmailArgs = {
  input: ConfirmEmailInput;
};


export type MutationSendResetPasswordEmailArgs = {
  input: SendResetPasswordEmailInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationCreateNotationArgs = {
  input: CreateNotationInput;
};


export type MutationUpdateNotationArgs = {
  input: UpdateNotationInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationDeleteTagArgs = {
  id: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type NotFoundError = {
  __typename?: 'NotFoundError';
  message: Scalars['String'];
};

export type Notation = {
  __typename?: 'Notation';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  songName: Scalars['String'];
  artistName: Scalars['String'];
  deadTimeMs: Scalars['Float'];
  durationMs: Scalars['Float'];
  private: Scalars['Boolean'];
  transcriberId: Scalars['String'];
  thumbnailUrl?: Maybe<Scalars['String']>;
  videoUrl?: Maybe<Scalars['String']>;
  musicXmlUrl?: Maybe<Scalars['String']>;
  transcriber: User;
  tags: Array<Tag>;
};

export type NotationConnection = {
  __typename?: 'NotationConnection';
  pageInfo: PageInfo;
  edges: Array<NotationEdge>;
};

export type NotationEdge = {
  __typename?: 'NotationEdge';
  node: Notation;
  /** Used in `before` and `after` args */
  cursor: Scalars['String'];
};

export type NumberValue = {
  __typename?: 'NumberValue';
  value: Scalars['Float'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};

export type Processed = {
  __typename?: 'Processed';
  at: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  whoami?: Maybe<User>;
  health: Health;
  version: Scalars['String'];
  notations: NotationConnection;
  notation?: Maybe<Notation>;
  suggestedNotations: Array<Notation>;
  tags: Array<Tag>;
  user?: Maybe<User>;
  users: UserConnection;
  userCount: UserCountOutput;
};


export type QueryNotationsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Float']>;
  last?: Maybe<Scalars['Float']>;
  query?: Maybe<Scalars['String']>;
  tagIds?: Maybe<Array<Scalars['String']>>;
};


export type QueryNotationArgs = {
  id: Scalars['String'];
};


export type QuerySuggestedNotationsArgs = {
  id?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Float']>;
  last?: Maybe<Scalars['Float']>;
};

export type ResendConfirmationEmailOutput = Processed | ForbiddenError;

export type ResetPasswordInput = {
  email: Scalars['String'];
  resetPasswordToken: Scalars['String'];
  password: Scalars['String'];
};

export type ResetPasswordOutput = Processed | BadRequestError | UnknownError;

export type SendResetPasswordEmailInput = {
  email: Scalars['String'];
};

export type SignupInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignupOutput = User | ForbiddenError | ValidationError | UnknownError;

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  category: TagCategory;
  name: Scalars['String'];
  notations?: Maybe<Array<Notation>>;
};

export enum TagCategory {
  GENRE = 'GENRE',
  DIFFICULTY = 'DIFFICULTY'
}

export type UnknownError = {
  __typename?: 'UnknownError';
  message: Scalars['String'];
};

export type UpdateNotationInput = {
  id: Scalars['String'];
  songName?: Maybe<Scalars['String']>;
  artistName?: Maybe<Scalars['String']>;
  deadTimeMs?: Maybe<Scalars['Float']>;
  durationMs?: Maybe<Scalars['Float']>;
  private?: Maybe<Scalars['Boolean']>;
  thumbnail?: Maybe<Scalars['Upload']>;
  musicXml?: Maybe<Scalars['Upload']>;
};

export type UpdateNotationOutput = Notation | ForbiddenError | NotFoundError | BadRequestError | ValidationError | UnknownError;

export type UpdateTagInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  category?: Maybe<TagCategory>;
};

export type UpdateTagOutput = Tag | ForbiddenError | NotFoundError | BadRequestError | ValidationError | UnknownError;

export type UpdateUserInput = {
  id: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
};

export type UpdateUserOutput = User | ForbiddenError | NotFoundError | BadRequestError | ValidationError | UnknownError;


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  email: Scalars['String'];
  username: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  role: UserRole;
  confirmedAt?: Maybe<Scalars['DateTime']>;
  resetPasswordTokenSentAt?: Maybe<Scalars['DateTime']>;
  notations: Array<Notation>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  pageInfo: PageInfo;
  edges: Array<UserEdge>;
};

export type UserCountOutput = NumberValue | ForbiddenError | UnknownError;

export type UserEdge = {
  __typename?: 'UserEdge';
  node: User;
  cursor: Scalars['String'];
};

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export type ValidationError = {
  __typename?: 'ValidationError';
  details: Array<Scalars['String']>;
};
