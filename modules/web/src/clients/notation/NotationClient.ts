import { GraphqlClient } from '../graphql';
import { Query, QueryNotationsArgs } from '../graphqlTypes';
import { gql } from '../gql';

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
    return await this.graphqlClient.call<Query['notations'], 'notations', QueryNotationsArgs>(
      gql`
        query notations($first: Float, $last: Float, $after: String, $before: String) {
          notations(first: $first, last: $last, after: $after, before: $before) {
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
