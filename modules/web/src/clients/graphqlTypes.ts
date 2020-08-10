export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type ConfirmEmailInput = {
  confirmationToken: Scalars['String'];
};

export type CreateNotationInput = {
  songName: Scalars['String'];
  artistName: Scalars['String'];
};


export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createNotation?: Maybe<NotationObject>;
  login?: Maybe<UserObject>;
  logout?: Maybe<Scalars['Boolean']>;
  signup?: Maybe<UserObject>;
  confirmEmail?: Maybe<UserObject>;
  resendConfirmationEmail?: Maybe<Scalars['Boolean']>;
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateNotationArgs = {
  input: CreateNotationInput;
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
  featured: Scalars['Boolean'];
  transcriberId: Scalars['String'];
  thumbnailUrl?: Maybe<Scalars['String']>;
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

export type Query = {
  __typename?: 'Query';
  notations: NotationConnectionObject;
  notation?: Maybe<NotationObject>;
  tags: Array<TagObject>;
  user?: Maybe<UserObject>;
  users: UserConnectionObject;
  whoami?: Maybe<UserObject>;
};


export type QueryNotationsArgs = {
  before?: Maybe<Scalars['String']>;
  after?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Float']>;
  last?: Maybe<Scalars['Float']>;
};


export type QueryNotationArgs = {
  id: Scalars['String'];
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

export type ResetPasswordInput = {
  resetPasswordToken: Scalars['String'];
  password: Scalars['String'];
};

export type SendResetPasswordEmailInput = {
  email: Scalars['String'];
};

export type SignupInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type TagObject = {
  __typename?: 'TagObject';
  id: Scalars['ID'];
  name: Scalars['String'];
  notations?: Maybe<Array<NotationObject>>;
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
  role: UserRoles;
  confirmedAt?: Maybe<Scalars['DateTime']>;
  resetPasswordTokenSentAt?: Maybe<Scalars['DateTime']>;
  notations?: Maybe<NotationObject>;
};

export enum UserRoles {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}
