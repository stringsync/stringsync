import { User } from '../data';

export type Input<T> = {
  input: T;
};

export type Output<T> = T;

export type SignupInput = Input<{
  username: string;
  email: string;
  password: string;
}>;

export type SignupOutput = Output<{
  user: User;
}>;

export type LogoutOutput = Output<{
  user: User | null;
}>;

export type LoginInput = Input<{
  emailOrUsername: string;
  password: string;
}>;

export type LoginOutput = Output<{
  user: User;
}>;

export type UserInput = Input<{
  id: string;
}>;

export type UsersInput = Input<{
  ids: string[] | null;
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
