import { CallResponse } from './types';

export class GraphqlClient {
  readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  call = async <T, N extends string, V extends Record<string, any> | void = void>(
    query: string,
    variables?: V
  ): Promise<CallResponse<T, N>> => {
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
