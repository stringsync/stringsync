import { getWebConfig } from '@stringsync/config';
import { RequestType, Response } from './types';

export class GraphqlClient {
  readonly uri: string;

  static create() {
    const uri = GraphqlClient.getGraphqlUri();
    return new GraphqlClient(uri);
  }

  static getGraphqlUri(env = process.env): string {
    const config = getWebConfig(env);
    return config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT;
  }

  constructor(uri: string) {
    this.uri = uri;
  }

  call = async <
    T extends RequestType,
    N extends Exclude<keyof T, '__typename'>,
    V extends Record<string, any> | void = void
  >(
    query: string,
    variables?: V
  ): Promise<Response<T, N>> => {
    const res = await fetch(this.uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
      credentials: 'include',
      mode: 'cors',
    });
    return await res.json();
  };
}
