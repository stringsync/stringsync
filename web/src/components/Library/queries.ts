import { $gql, QueryNotationsArgs, t, UserRoles } from '../../graphql';

export const NOTATIONS_GQL = $gql
  .query('notations')
  .setQuery({
    edges: [
      {
        cursor: t.string,
        node: {
          id: t.string,
          createdAt: t.string,
          updatedAt: t.string,
          songName: t.string,
          artistName: t.string,
          thumbnailUrl: t.optional.string,
          transcriber: {
            id: t.string,
            username: t.string,
            role: t.optional.oneOf(UserRoles)!,
            avatarUrl: t.optional.string,
          },
          tags: [{ id: t.string, name: t.string }],
        },
      },
    ],
    pageInfo: {
      hasNextPage: t.boolean,
      hasPreviousPage: t.boolean,
      startCursor: t.optional.string,
      endCursor: t.optional.string,
    },
  })
  .setVariables<QueryNotationsArgs>({
    first: t.optional.number,
    last: t.optional.number,
    after: t.optional.string,
    before: t.optional.string,
    query: t.optional.string,
    tagIds: [t.string],
  })
  .build();
