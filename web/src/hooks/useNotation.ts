import { useMemo } from 'react';
import { useAsyncAbortable } from 'react-async-hook';
import { UNKNOWN_ERROR_MSG } from '../errors';
import { $gql, DataOf, QueryNotationArgs, t, TagCategory } from '../graphql';

export type NotationData = DataOf<typeof NOTATION_GQL>;

const NOTATION_GQL = $gql
  .query('notation')
  .setQuery({
    id: t.string,
    createdAt: t.string,
    updatedAt: t.string,
    songName: t.string,
    artistName: t.string,
    deadTimeMs: t.number,
    durationMs: t.number,
    private: t.boolean,
    transcriberId: t.string,
    thumbnailUrl: t.optional.string,
    videoUrl: t.optional.string,
    musicXmlUrl: t.optional.string,
    transcriber: { id: t.string, username: t.string },
    tags: [{ id: t.string, category: t.optional.oneOf(TagCategory)!, name: t.string }],
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

export const useNotation = (id: string): [NotationData | null, string[], boolean] => {
  const { result, error, loading, status } = useAsyncAbortable(async (signal) => NOTATION_GQL.fetch({ id }, signal), [
    id,
  ]);

  const notation = result?.data?.notation || null;

  const errors = useMemo(() => {
    switch (status) {
      case 'success':
        return [];
      case 'error':
        return [error?.message || UNKNOWN_ERROR_MSG];
      default:
        return [UNKNOWN_ERROR_MSG];
    }
  }, [status, error]);

  return [notation, errors, loading];
};
