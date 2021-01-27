import { PublicTag } from '@stringsync/domain';
import { useState } from 'react';
import { TagClient } from '../../../clients';
import { useEffectOnce } from '../../../hooks';
import { TagsState } from './types';

export const useTags: TagsState = () => {
  const [tags, setTags] = useState(new Array<PublicTag>());

  useEffectOnce(() => {
    const client = TagClient.create();
  });
};
