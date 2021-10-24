export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export enum TagCategory {
  Genre = 'genre',
  Difficulty = 'difficulty',
}

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
