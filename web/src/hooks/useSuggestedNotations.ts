import { useEffect, useState } from 'react';
import { $gql, DataOf, QuerySuggestedNotationsArgs, t, UserRole } from '../lib/graphql';
import { GqlStatus, useGql } from './useGql';
import { useGqlHandler } from './useGqlHandler';

type SuggestedNotations = DataOf<typeof SUGGESTED_NOTATIONS_GQL>;

const SUGGESTED_NOTATIONS_GQL = $gql
  .query('suggestedNotations')
  .setQuery([
    {
      id: t.string,
      createdAt: t.string,
      updatedAt: t.string,
      songName: t.string,
      artistName: t.string,
      thumbnailUrl: t.optional.string,
      transcriber: {
        id: t.string,
        username: t.string,
        role: t.optional.oneOf(UserRole)!,
        avatarUrl: t.optional.string,
      },
      tags: [{ id: t.string, name: t.string }],
    },
  ])
  .setVariables<QuerySuggestedNotationsArgs>({
    id: t.string,
    limit: t.number,
  })
  .build();

export const useSuggestedNotations = (srcNotationId: string, limit: number) => {
  const [suggestedNotations, setSuggestedNotations] = useState<SuggestedNotations>([]);
  const [errors, setErrors] = useState(new Array<string>());

  const [execute, res] = useGql(SUGGESTED_NOTATIONS_GQL);
  const loading = res.status === GqlStatus.Init || res.status === GqlStatus.Pending;
  useGqlHandler.onSuccess(res, ({ data }) => {
    setSuggestedNotations(data.suggestedNotations);
  });
  useGqlHandler.onErrors(res, ({ errors }) => {
    setErrors(errors);
  });

  useEffect(() => {
    execute({ id: srcNotationId, limit });
  }, [execute, srcNotationId, limit]);

  return [suggestedNotations, errors, loading] as const;
};
