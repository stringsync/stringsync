import { TagCategory, UserRole } from '../lib/graphql/graphqlTypes';

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  role: UserRole;
  resetPasswordTokenSentAt: Date | null;
  avatarUrl: string | null;
}

export type Tag = {
  id: string;
  category: TagCategory;
  name: string;
};

export type Notation = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  songName: string;
  artistName: string;
  deadTimeMs: number;
  durationMs: number;
  private: boolean;
  transcriberId: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  musicXmlUrl: string | null;
};
