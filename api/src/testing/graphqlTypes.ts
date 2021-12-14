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

export type ConfirmEmailOutput = EmailConfirmation | NotFoundError | ValidationError | ForbiddenError | UnknownError;

export type CreateNotationInput = {
  songName: Scalars['String'];
  artistName: Scalars['String'];
  thumbnail: Scalars['Upload'];
  video: Scalars['Upload'];
  tagIds: Array<Scalars['String']>;
};

export type CreateTagInput = {
  name: Scalars['String'];
  category: TagCategory;
};


export type EmailConfirmation = {
  __typename?: 'EmailConfirmation';
  confirmedAt: Scalars['DateTime'];
};

export type ForbiddenError = {
  __typename?: 'ForbiddenError';
  message: Scalars['String'];
};

export type HealthOutput = {
  __typename?: 'HealthOutput';
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
  updateUser?: Maybe<UserObject>;
  createNotation?: Maybe<NotationObject>;
  updateNotation?: Maybe<NotationObject>;
  updateTag: TagObject;
  createTag: TagObject;
  deleteTag: Scalars['Boolean'];
  login: LoginOutput;
  logout: LogoutOutput;
  signup: SignupOutput;
  confirmEmail: ConfirmEmailOutput;
  resendConfirmationEmail: ResendConfirmationEmailOutput;
  sendResetPasswordEmail: SendResetPasswordEmailOutput;
  resetPassword?: Maybe<ResetPasswordOutput>;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
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
  transcriber?: Maybe<User>;
  tags: Array<TagObject>;
};

export type NotationConnectionObject = {
  __typename?: 'NotationConnectionObject';
  pageInfo: PageInfoObject;
  edges: Array<NotationEdgeObject>;
};

export type NotationEdgeObject = {
  __typename?: 'NotationEdgeObject';
  node: NotationObject;
  /** Used in `before` and `after` args */
  cursor: Scalars['String'];
};

export type NotationObject = {
  __typename?: 'NotationObject';
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
  transcriber: UserObject;
  tags: Array<TagObject>;
};

export type PageInfoObject = {
  __typename?: 'PageInfoObject';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
};

export type Processed = {
  __typename?: 'Processed';
  at: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<UserObject>;
  users: UserConnectionObject;
  userCount: Scalars['Float'];
  notations: NotationConnectionObject;
  notation?: Maybe<NotationObject>;
  suggestedNotations: Array<NotationObject>;
  tags: Array<TagObject>;
  whoami?: Maybe<User>;
  health: HealthOutput;
  version: Scalars['String'];
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

export type SendResetPasswordEmailOutput = Processed | NotFoundError | UnknownError;

export type SignupInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignupOutput = User | ForbiddenError | ValidationError | UnknownError;

export enum TagCategory {
  GENRE = 'GENRE',
  DIFFICULTY = 'DIFFICULTY'
}

export type TagObject = {
  __typename?: 'TagObject';
  id: Scalars['ID'];
  category: TagCategory;
  name: Scalars['String'];
  notations?: Maybe<Array<NotationObject>>;
};

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

export type UpdateTagInput = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  category?: Maybe<TagCategory>;
};

export type UpdateUserInput = {
  id: Scalars['String'];
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
};


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

export type UserConnectionObject = {
  __typename?: 'UserConnectionObject';
  pageInfo: PageInfoObject;
  edges: Array<UserEdgeObject>;
};

export type UserEdgeObject = {
  __typename?: 'UserEdgeObject';
  node: UserObject;
  cursor: Scalars['String'];
};

export type UserObject = {
  __typename?: 'UserObject';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  email: Scalars['String'];
  username: Scalars['String'];
  avatarUrl?: Maybe<Scalars['String']>;
  role: UserRole;
  confirmedAt?: Maybe<Scalars['DateTime']>;
  resetPasswordTokenSentAt?: Maybe<Scalars['DateTime']>;
  notations?: Maybe<NotationObject>;
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
