import { StringSyncClient } from './types';

export class Client implements StringSyncClient {
  public uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  hello() {
    return fetch(this.uri, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{ hello }` }),
    })
      .then((res) => res.json())
      .then((json) => json.data.hello);
  }
}
