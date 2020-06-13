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

export type Query = {
  __typename?: 'Query';
  user?: Maybe<UserObject>;
  users: Array<UserObject>;
  whoami?: Maybe<UserObject>;
};


export type QueryUserArgs = {
  id: Scalars['Float'];
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
};


export enum UserRoles {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export type Mutation = {
  __typename?: 'Mutation';
  login: UserObject;
  logout: Scalars['Boolean'];
  signup: UserObject;
  confirmEmail: UserObject;
  resendConfirmationEmail: Scalars['Boolean'];
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

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type SignupInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type ConfirmEmailInput = {
  confirmationToken: Scalars['String'];
};
