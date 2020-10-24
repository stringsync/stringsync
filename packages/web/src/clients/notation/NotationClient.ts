import { gql } from '../gql';
import { GraphqlClient } from '../graphql';
import { Query, QueryNotationsArgs } from '../graphqlTypes';

export class NotationClient {
  graphqlClient: GraphqlClient;

  static create() {
    const graphqlClient = GraphqlClient.create();
    return new NotationClient(graphqlClient);
  }

  constructor(graphqlClient: GraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async notations(args: QueryNotationsArgs) {
    return await this.graphqlClient.call<Query, 'notations', QueryNotationsArgs>(
      gql`
        query notations(
          $first: Float
          $last: Float
          $after: String
          $before: String
          $query: String
          $tagIds: [String!]
        ) {
          notations(first: $first, last: $last, after: $after, before: $before, query: $query, tagIds: $tagIds) {
            edges {
              cursor
              node {
                id
                createdAt
                updatedAt
                songName
                artistName
                thumbnailUrl
                transcriber {
                  id
                  username
                  role
                  avatarUrl
                }
                tags {
                  id
                  name
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `,
      args
    );
  }
}
