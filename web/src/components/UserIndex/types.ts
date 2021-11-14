import { UserObject } from '../../graphql';

export type UserPreview = Pick<
  UserObject,
  'id' | 'username' | 'email' | 'role' | 'avatarUrl' | 'confirmedAt' | 'createdAt'
>;
