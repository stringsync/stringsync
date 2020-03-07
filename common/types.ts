export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type InputOf<T> = { input: T };

export type UserRoles = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  role: UserRoles;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface SignupPayload {
  user: User;
}

export interface AuthenticatePayload {
  user: User;
}

export interface LogoutPayload {
  user: User | null;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayload {
  user: User;
}

export interface Notation {
  id: string;
}

export interface GetUserInput {
  id: string;
}

export interface ConfirmEmailInput {
  confirmationToken: string;
}

export interface ConfirmEmailPayload {
  user: User;
}

export interface ResendConfirmationInput {
  email: string;
}

export interface ResendConfirmationPayload {
  email: string;
}
