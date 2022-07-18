import { useState } from 'react';
import { $gql, DataOf, t, TagCategory } from '../lib/graphql';
import { GqlStatus, useGql } from './useGql';
import { useGqlHandler } from './useGqlHandler';

type Tags = DataOf<typeof TAGS_GQL>;
type Errors = string[];
type Loading = boolean;
type LoadTags = () => void;

const TAGS_GQL = $gql
  .query('tags')
  .setQuery([{ id: t.string, name: t.string, category: t.optional.oneOf(TagCategory)! }])
  .build();

export const useLoadTags = (): [Tags, Loading, Errors, LoadTags] => {
  const [tags, setTags] = useState<Tags>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [execute, res] = useGql(TAGS_GQL);
  const loading = res.status === GqlStatus.Pending;
  useGqlHandler.onSuccess(res, ({ data }) => {
    setTags(data.tags);
  });
  useGqlHandler.onErrors(res, ({ errors }) => {
    setErrors(errors);
  });

  return [tags, loading, errors, execute];
};
