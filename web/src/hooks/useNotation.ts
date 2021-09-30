import { $gql, DataOf, QueryNotationArgs, t } from '../graphql';
import { GqlStatus, useImmediateGql } from './useImmediateGql';

type Notation = DataOf<typeof NOTATION_GQL>;

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
    transcriber: { username: t.string },
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

export const useNotation = (id: string): [Notation | null, string[], boolean] => {
  const [res, status] = useImmediateGql(NOTATION_GQL, { id });

  const notation = res?.data?.notation ?? null;
  const errors = res?.errors?.map((error) => error.message) || [];
  const isLoading = status === GqlStatus.Pending;

  return [notation, errors, isLoading];
};
