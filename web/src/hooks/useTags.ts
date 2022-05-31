import { useState } from 'react';
import { $gql, DataOf, t, TagCategory } from '../lib/graphql';
import { useEffectOnce } from './useEffectOnce';
import { useGql } from './useGql';

type Tags = DataOf<typeof TAGS_GQL>;

export const TAGS_GQL = $gql
  .query('tags')
  .setQuery([{ id: t.string, category: t.optional.oneOf(TagCategory)!, name: t.string }])
  .build();

export const useTags = () => {
  const [tags, setTags] = useState<Tags>([]);
  const [errors, setErrors] = useState(new Array<string>());

  const { execute, loading } = useGql(TAGS_GQL, {
    onData: (data) => {
      setTags(data.tags);
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });

  useEffectOnce(() => {
    execute();
  });

  return [tags, errors, loading] as const;
};
