import { getGraphqlUri } from './getGraphqlUri';
import { graphql } from './graphql';
import { Query } from './graphqlTypes';

export const query = async <N extends Exclude<keyof Query, '__typename'>, V extends Record<string, any> | void = void>(
  query: string,
  variables?: V
) => {
  const uri = getGraphqlUri();
  return graphql<Query, N, V>(uri, query, variables);
};
