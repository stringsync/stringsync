import { randStr, randInt } from '@stringsync/common';
import { Notation } from '@stringsync/domain';

export const buildRandNotation = (attrs: Partial<Notation> = {}): Notation => {
  const now = new Date();

  return {
    id: randInt(0, 1000000),
    artistName: randStr(8),
    bpm: 120,
    createdAt: now,
    updatedAt: now,
    deadTimeMs: 0,
    durationMs: 1,
    featured: true,
    songName: randStr(8),
    transcriberId: 0,
    ...attrs,
  };
};
