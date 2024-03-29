import { Notation, NotationTag, Tag, TagCategory, User, UserRole } from '../domain';

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
    cursor: int(0, 100000),
    username: str(8),
    email: `${str(8)}@${str(5)}.com`,
    createdAt: now,
    updatedAt: now,
    role: UserRole.STUDENT,
    avatarUrl: null,
    confirmationToken: null,
    confirmedAt: null,
    encryptedPassword: '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe', // password = 'password',
    resetPasswordToken: null,
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
    cursor: int(0, 100000),
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

export const notationTag = (attrs: Partial<NotationTag> = {}): NotationTag => {
  return {
    id: str(8),
    notationId: str(8),
    tagId: str(8),
    ...attrs,
  };
};
