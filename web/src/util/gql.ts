import axios, { AxiosResponse } from 'axios';

type Response<T> = {
  errors?: string[];
  data: T;
};

/**
 * Issues a GraphQL query
 * @param query GraphQL query
 * @param variables an object mapping of the variables for the graphql query
 */
export const gql = async <T>(
  query: string,
  variables: any = {}
): Promise<T> => {
  const response = await axios.post<Response<T>>(
    'graphql',
    {
      query,
      variables,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const { data } = response;
  if ('errors' in data) {
    throw data.errors;
  }
  return data.data;
};

/**
 * Returns a convenience function that makes calling a
 * graphql query easy
 */
export const query = <T, V = undefined>(gqlStr: string) => (vars: V) =>
  gql<T>(gqlStr, vars);
