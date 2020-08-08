import { randInt } from './randInt';
import { randStr } from './randStr';
import { User, UserRole, Notation, Tag, Tagging } from '@stringsync/domain';

export class TestFactory {
  static buildRandUser(attrs: Partial<User> = {}): User {
    const now = new Date();

    return {
      id: randStr(8),
      username: randStr(8),
      email: `${randStr(8)}@${randStr(5)}.com`,
      createdAt: now,
      updatedAt: now,
      role: UserRole.STUDENT,
      avatarUrl: null,
      confirmationToken: null,
      confirmedAt: null,
      encryptedPassword: '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe', // password = 'password',
      resetPasswordToken: null,
      resetPasswordTokenSentAt: null,
      rank: randInt(0, 100000),
      ...attrs,
    };
  }

  static buildRandNotation(attrs: Partial<Notation> = {}): Notation {
    const now = new Date();

    return {
      id: randStr(8),
      artistName: randStr(8),
      createdAt: now,
      updatedAt: now,
      deadTimeMs: 0,
      durationMs: 1,
      featured: true,
      songName: randStr(8),
      transcriberId: randStr(8),
      rank: randInt(0, 100000),
      ...attrs,
    };
  }

  static buildRandTag(attrs: Partial<Tag> = {}): Tag {
    return {
      id: randStr(8),
      name: randStr(8),
      ...attrs,
    };
  }

  static buildRandTagging(attrs: Partial<Tagging> = {}): Tagging {
    return {
      id: randStr(8),
      notationId: randStr(8),
      tagId: randStr(8),
      ...attrs,
    };
  }
}
