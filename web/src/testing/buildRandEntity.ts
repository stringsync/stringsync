import { Notation, Tag, User, UserRole } from '../domain';
import { randStr } from '../util/randStr';

export const buildRandUser = (attrs: Partial<User> = {}): User => {
  const now = new Date();

  return {
    id: randStr(8),
    username: randStr(8),
    email: `${randStr(8)}@${randStr(5)}.com`,
    createdAt: now,
    updatedAt: now,
    role: UserRole.STUDENT,
    avatarUrl: null,
    resetPasswordTokenSentAt: null,
    ...attrs,
  };
};

export const buildRandNotation = (attrs: Partial<Notation> = {}): Notation => {
  const now = new Date();

  return {
    id: randStr(8),
    artistName: randStr(8),
    createdAt: now,
    updatedAt: now,
    deadTimeMs: 0,
    durationMs: 1,
    private: true,
    songName: randStr(8),
    transcriberId: randStr(8),
    thumbnailUrl: null,
    videoUrl: null,
    musicXmlUrl: null,
    ...attrs,
  };
};

export const buildRandTag = (attrs: Partial<Tag> = {}): Tag => {
  return {
    id: randStr(8),
    name: randStr(8),
    ...attrs,
  };
};
