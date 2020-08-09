import { GraphqlClient } from '../graphql';
import { Query } from '../graphqlTypes';
import { gql } from '../gql';

export class TagClient {
  graphqlClient: GraphqlClient;

  static create() {
    const graphqlClient = GraphqlClient.create();
    return new TagClient(graphqlClient);
  }

  constructor(graphqlClient: GraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async tags() {
    return await this.graphqlClient.call<Query['tags'], 'tags'>(
      gql`
        query {
          tags {
            id
            name
          }
        }
      `
    );
  }
}
