export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type UserRoles = 'student' | 'teacher' | 'admin';

export const USER_ROLE_HIEARCHY: UserRoles[] = ['student', 'teacher', 'admin'];

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

export interface SignupOutput {
  user: User;
}

export interface AuthenticateOutput {
  user: User;
}

export interface LogoutOutput {
  user: User | null;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export interface LoginOutput {
  user: User;
}

export interface Notation {
  id: string;
}

export interface UserInput {
  id: string;
}

export interface ConfirmEmailInput {
  confirmationToken: string;
}

export interface ConfirmEmailOutput {
  user: User;
}

export interface ResendConfirmationEmailInput {
  email: string;
}

export interface ResendConfirmationEmailOutput {
  email: string;
}
