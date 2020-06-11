import { User } from '../data';

type Input<T> = {
  input: T;
};

type NullInput = {};

type Output<T> = T;

export type UserInput = Input<{
  id: string;
}>;

export type UserOutput = Output<User | null>;

export type UsersInput = Input<{
  ids: string[] | null;
}>;

export type UsersOutput = Output<User[]>;

export type WhoamiInput = NullInput;

export type WhoamiOutput = Output<User | null>;

export type SignupInput = Input<{
  username: string;
  email: string;
  password: string;
}>;

export type SignupOutput = Output<{
  user: User;
}>;

export type LoginInput = Input<{
  emailOrUsername: string;
  password: string;
}>;

export type LoginOutput = Output<{
  user: User;
}>;

export type LogoutInput = NullInput;

export type LogoutOutput = Output<{
  user: User | null;
}>;

export type ConfirmEmailInput = Input<{
  confirmationToken: string;
}>;

export type ConfirmEmailOutput = Output<{
  user: User;
}>;

export type ResendConfirmationEmailInput = Input<{
  email: string;
}>;

export type ResendConfirmationEmailOutput = Output<{
  email: string;
}>;
