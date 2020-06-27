import { randStr } from './randStr';
import { Notation, Tag } from '@stringsync/domain';

export const buildRandTag = (attrs: Partial<Tag> = {}): Tag => {
  return {
    id: randStr(8),
    name: randStr(8),
    ...attrs,
  };
};
