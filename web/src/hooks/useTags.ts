import { $gql, DataOf, t } from '../graphql';
import { GqlStatus, useImmediateGql } from './useImmediateGql';

type Tags = DataOf<typeof TAGS_GQL>;

export const TAGS_GQL = $gql
  .query('tags')
  .setQuery([{ id: t.string, name: t.string }])
  .build();

export const useTags = (): [Tags, string[], boolean] => {
  const [res, status] = useImmediateGql(TAGS_GQL, undefined);

  const tags = res?.data?.tags ?? [];
  const errors = res?.errors?.map((error) => error.message) || [];
  const isLoading = status === GqlStatus.Pending;

  return [tags, errors, isLoading];
};
