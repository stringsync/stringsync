import { TestGraphqlClient, gql } from '../../../testing';
import { Query, QueryNotationsArgs } from '../../../testing/graphqlTypes';

export class TestNotationClient {
  graphqlClient: TestGraphqlClient;

  constructor(graphqlClient: TestGraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async notations(args: QueryNotationsArgs) {
    return await this.graphqlClient.call<Query['notations'], 'notations', QueryNotationsArgs>(
      gql`
        query getNotations($before: String, $after: String, $first: Float, $last: Float) {
          notations(before: $before, after: $after, first: $first, last: $last) {
            pageInfo {
              startCursor
            }
            edges {
              cursor
            }
          }
        }
      `,
      args
    );
  }
}
