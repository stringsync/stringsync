import { useState } from 'react';
import { $gql, DataOf, t, TagCategory } from '../../graphql';
import { useGql } from '../../hooks/useGql';

type Tags = DataOf<typeof TAGS_GQL>;
type Errors = string[];
type Loading = boolean;
type LoadTags = () => void;

const TAGS_GQL = $gql
  .query('tags')
  .setQuery([{ id: t.string, name: t.string, category: t.optional.oneOf(TagCategory)! }])
  .build();

export const useTags = (): [Tags, Loading, Errors, LoadTags] => {
  const [tags, setTags] = useState<Tags>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const { execute, loading } = useGql(TAGS_GQL, {
    onData: (data) => {
      setTags(data.tags);
    },
    onErrors: (errors) => {
      setErrors(errors);
    },
  });

  return [tags, loading, errors, execute];
};
