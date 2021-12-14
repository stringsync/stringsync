import { User } from '../../graphql';

export type UserPreview = Pick<User, 'id' | 'username' | 'email' | 'role' | 'avatarUrl' | 'confirmedAt' | 'createdAt'>;
