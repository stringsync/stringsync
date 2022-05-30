import { useAsyncAbortable } from 'react-async-hook';
import { $gql, QuerySuggestedNotationsArgs, t, UserRole } from '../graphql';

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
  const { result, loading } = useAsyncAbortable(
    async (signal) => SUGGESTED_NOTATIONS_GQL.fetch({ id: srcNotationId, limit }, signal),
    [srcNotationId, limit]
  );

  const errors = result?.errors?.map((error) => error.message) || [];

  return [result?.data?.suggestedNotations || [], errors, loading] as const;
};
