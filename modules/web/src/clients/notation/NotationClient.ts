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
        query {
          notations {
            edges {
              cursor
              node {
                id
                createdAt
                updatedAt
                songName
                artistName
                transcriber {
                  id
                  username
                  role
                  avatarUrl
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
