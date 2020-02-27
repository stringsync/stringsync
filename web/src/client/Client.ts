import { ObjectOf, StringSyncClient } from './types';
import { DocNodeAnalyzer } from './DocNodeAnalyzer';
import {
  ApolloClient,
  NormalizedCacheObject,
  DocumentNode,
  ApolloQueryResult,
  FetchResult,
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';

export class Client implements StringSyncClient {
  private readonly apollo: ApolloClient<NormalizedCacheObject>;

  public static create(uri: string): Client {
    const httpLink = new HttpLink({
      uri,
      credentials: 'include',
    });
    const cache = new InMemoryCache();
    const apollo = new ApolloClient({ link: httpLink, cache });
    return new Client(apollo);
  }

  private static extractData<T>(
    doc: DocumentNode,
    res: ApolloQueryResult<ObjectOf<T>> | FetchResult<ObjectOf<T>>
  ) {
    if (!res.data) {
      throw new Error(`no data returned for ${JSON.stringify(doc)}`);
    }
    const resolverName = DocNodeAnalyzer.getResolverName(doc);
    return res.data[resolverName];
  }

  private constructor(apollo: ApolloClient<NormalizedCacheObject>) {
    this.apollo = apollo;
  }

  public async call<T, V>(doc: DocumentNode, variables: V): Promise<T> {
    const operationType = DocNodeAnalyzer.getOperationType(doc);
    switch (operationType) {
      case 'query':
        return this.query(doc, variables);
      case 'mutation':
        return this.mutate(doc, variables);
      default:
        throw new TypeError(`unsupported operationType: ${operationType}`);
    }
  }

  private async query<T, V>(doc: DocumentNode, variables: V): Promise<T> {
    const res = await this.apollo.query<ObjectOf<T>, V>({
      query: doc,
      variables,
    });
    return Client.extractData(doc, res);
  }

  private async mutate<T, V>(doc: DocumentNode, variables: V): Promise<T> {
    const res = await this.apollo.mutate<ObjectOf<T>, V>({
      mutation: doc,
      variables,
    });
    return Client.extractData(doc, res);
  }
}
