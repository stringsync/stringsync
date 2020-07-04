import { randStr } from '@stringsync/common';
import { Tagging } from '@stringsync/domain';

export const buildRandTagging = (attrs: Partial<Tagging> = {}): Tagging => {
  return {
    id: randStr(8),
    notationId: randStr(8),
    tagId: randStr(8),
    ...attrs,
  };
};
