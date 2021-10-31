import { $gql, QueryNotationArgs, t, TagCategory } from '../../graphql';

const GET_NOTATION_GQL = $gql
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

export const useNotationApi = () => {};
