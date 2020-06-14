export class GraphqlClient {
  public readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async call<T, V extends Record<string, any>>(query: string, variables: V): Promise<T> {
    const res = await fetch(this.uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    return await res.json();
  }
}
