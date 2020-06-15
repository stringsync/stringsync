import { Fetch } from './types';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';

@injectable()
export class GraphqlClient {
  public readonly uri: string;
  public readonly fetch: Fetch;

  constructor(@inject(TYPES.GraphqlServerUri) uri: string, @inject(TYPES.Fetch) fetch: Fetch) {
    this.uri = uri;
    this.fetch = fetch;
  }

  async call<T, V extends Record<string, any>>(query: string, variables: V): Promise<T> {
    const res = await this.fetch(this.uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    return await res.json();
  }
}
