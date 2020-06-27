import { randStr } from '@stringsync/common';
import { Notation } from '@stringsync/domain';

export const buildRandNotation = (attrs: Partial<Notation> = {}): Notation => {
  const now = new Date();

  return {
    id: randStr(8),
    artistName: randStr(8),
    bpm: 120,
    createdAt: now,
    updatedAt: now,
    deadTimeMs: 0,
    durationMs: 1,
    featured: true,
    songName: randStr(8),
    transcriberId: randStr(8),
    ...attrs,
  };
};
