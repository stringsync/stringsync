import { gql, TestGraphqlClient } from '../../../testing';
import { Mutation, Query, QueryNotationsArgs } from '../../../testing/graphqlTypes';
import { NotationArgs } from './NotationArgs';
import { TestCreateNotationInput } from './types';

export class TestNotationClient {
  graphqlClient: TestGraphqlClient;

  constructor(graphqlClient: TestGraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async notations(args: QueryNotationsArgs) {
    return await this.graphqlClient.call<Query, 'notations', QueryNotationsArgs>(
      gql`
        query notations($before: String, $after: String, $first: Float, $last: Float) {
          notations(before: $before, after: $after, first: $first, last: $last) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
                id
                createdAt
                updatedAt
                songName
                artistName
                deadTimeMs
                durationMs
                featured
                transcriberId
              }
            }
          }
        }
      `,
      args
    );
  }

  async notation(args: NotationArgs) {
    return await this.graphqlClient.call<Query, 'notation', NotationArgs>(
      gql`
        query notation($id: String!) {
          notation(id: $id) {
            id
            createdAt
            updatedAt
            songName
            artistName
            deadTimeMs
            durationMs
            featured
            transcriberId
          }
        }
      `,
      args
    );
  }

  async createNotation(input: TestCreateNotationInput) {
    return await this.graphqlClient.call<Mutation, 'createNotation', { input: TestCreateNotationInput }>(
      gql`
        mutation createNotation($input: CreateNotationInput!) {
          createNotation(input: $input) {
            id
            createdAt
            updatedAt
            songName
            artistName
            deadTimeMs
            durationMs
            featured
            transcriberId
          }
        }
      `,
      { input }
    );
  }
}
