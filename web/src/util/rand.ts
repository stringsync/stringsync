import { Notation, Tag, User } from '../domain';
import { TagCategory, UserRole } from '../lib/graphql';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const str = (length: number): string => {
  const chars = new Array<string>(length);
  for (let ndx = 0; ndx < length; ndx++) {
    const randNdx = Math.floor(Math.random() * CHARS.length);
    chars[ndx] = CHARS[randNdx];
  }
  return chars.join('');
};

export const int = (min: number, max: number) => {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }
  return Math.floor(Math.random() * (max - min) + min);
};

export const user = (attrs: Partial<User> = {}): User => {
  const now = new Date();

  return {
    id: str(8),
    username: str(8),
    email: `${str(8)}@${str(5)}.com`,
    createdAt: now,
    updatedAt: now,
    role: UserRole.STUDENT,
    avatarUrl: null,
    resetPasswordTokenSentAt: null,
    ...attrs,
  };
};

export const notation = (attrs: Partial<Notation> = {}): Notation => {
  const now = new Date();

  return {
    id: str(8),
    artistName: str(8),
    createdAt: now,
    updatedAt: now,
    deadTimeMs: 0,
    durationMs: 1,
    private: false,
    songName: str(8),
    transcriberId: str(8),
    thumbnailUrl: null,
    videoUrl: null,
    musicXmlUrl: null,
    ...attrs,
  };
};

export const tag = (attrs: Partial<Tag> = {}): Tag => {
  return {
    id: str(8),
    category: TagCategory.GENRE,
    name: str(8),
    ...attrs,
  };
};
