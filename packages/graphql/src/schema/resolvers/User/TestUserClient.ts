import { gql, TestGraphqlClient } from '../../../testing';
import { Mutation } from '../../../testing/graphqlTypes';
import { UpdateUserInput } from './UpdateUserInput';

export class TestUserClient {
  graphqlClient: TestGraphqlClient;

  constructor(graphqlClient: TestGraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async updateUser(input: UpdateUserInput) {
    return await this.graphqlClient.call<Mutation['updateUser'], 'updateUser', { input: UpdateUserInput }>(
      gql`
        mutation updateUser($input: UpdateUserInput!) {
          updateUser(input: $input) {
            id
            email
            username
            role
            confirmedAt
          }
        }
      `,
      { input }
    );
  }
}
