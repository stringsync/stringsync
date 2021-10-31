import { useAsyncAbortable } from 'react-async-hook';
import { UNKNOWN_ERROR_MSG } from '../errors';
import { $gql, DataOf, QueryNotationArgs, t, TagCategory } from '../graphql';

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
    transcriber: { id: t.string, username: t.string },
    tags: [{ id: t.string, category: t.optional.oneOf(TagCategory)!, name: t.string }],
  })
  .setVariables<QueryNotationArgs>({ id: t.string })
  .build();

export const useNotation = (id: string): [Notation | null, string[], boolean] => {
  const { result, error, loading, status } = useAsyncAbortable(async (signal) => NOTATION_GQL.fetch({ id }, signal), [
    id,
  ]);

  const notation = result?.data?.notation || null;
  let errors = new Array<string>();
  switch (status) {
    case 'success':
      // request was successful, but found nothing
      if (!notation) {
        errors = ['notation not found'];
      }
      break;
    case 'error':
      errors = [error?.message || UNKNOWN_ERROR_MSG];
      break;
    default:
      errors = [UNKNOWN_ERROR_MSG];
  }

  return [notation, errors, loading];
};
