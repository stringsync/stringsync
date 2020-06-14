import { User } from '@stringsync/domain';

export type AuthUser = Pick<User, 'id' | 'email' | 'username' | 'role' | 'confirmedAt'>;
