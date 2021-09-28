import { $gql, DataOf, QueryNotationArgs, t } from '../graphql';
import { GqlStatus, useGql } from './useGql';

type Notation = DataOf<typeof notationGql>;

const notationGql = $gql
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
    transcriber: { username: t.string },
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

export const useNotation = (id: string): [Notation | null, string[], boolean] => {
  const [res, status] = useGql(notationGql, { id });

  const notation = res?.data?.notation ?? null;
  const errors = res?.errors?.map((error) => error.message) || [];
  const isLoading = status === GqlStatus.Pending;

  return [notation, errors, isLoading];
};
