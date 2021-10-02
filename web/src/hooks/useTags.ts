import { useState } from 'react';
import { UnknownError } from '../errors';
import { $gql, DataOf, t } from '../graphql';
import { useGql } from './useGql';

type Tags = DataOf<typeof TAGS_GQL>;

export const TAGS_GQL = $gql
  .query('tags')
  .setQuery([{ id: t.string, name: t.string }])
  .build();

export const useTags = () => {
  const [tags, setTags] = useState<Tags>([]);
  const [errors, setErrors] = useState(new Array<string>());

  const { loading } = useGql(TAGS_GQL, {
    onSuccess: (res) => {
      const tags = res.data?.tags;
      if (Array.isArray(tags)) {
        setTags(tags);
      } else {
        const errors = (res.errors || [new UnknownError()]).map((error) => error.message);
        setErrors(errors);
      }
    },
    onError: (error) => {
      setErrors([error.message]);
    },
  });

  return [tags, errors, loading] as const;
};
