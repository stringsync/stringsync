import { User } from '../../domain';

export type AuthUser = Pick<User, 'id' | 'email' | 'username' | 'role'> & {
  confirmedAt: null | string;
};

export type AuthState = {
  isPending: boolean;
  user: AuthUser;
  errors: string[];
};
