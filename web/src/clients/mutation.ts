import { getGraphqlUri } from './getGraphqlUri';
import { graphql } from './graphql';
import { Mutation } from './graphqlTypes';

export const mutation = async <
  N extends Exclude<keyof Mutation, '__typename'>,
  V extends Record<string, any> | void = void
>(
  query: string,
  variables?: V
) => {
  const uri = getGraphqlUri();
  return graphql<Mutation, N, V>(uri, query, variables);
};
