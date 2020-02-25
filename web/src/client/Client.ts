import { CsrfTokenSetter, ObjectOf, StringSyncClient } from './types';
import { getApolloFactory } from './getApolloFactory';
import { DocNodeAnalyzer } from './DocNodeAnalyzer';
import { extractResData } from './extractResData';
import { GET_CSRF_TOKEN_QUERY } from './constants';
import {
  ApolloClient,
  NormalizedCacheObject,
  DocumentNode,
} from 'apollo-boost';

export class Client implements StringSyncClient {
  private readonly apollo: ApolloClient<NormalizedCacheObject>;
  private readonly setCsrfToken: CsrfTokenSetter;

  public static create(uri: string): Client {
    const createApollo = getApolloFactory();
    const { apollo, setCsrfToken } = createApollo(uri);
    return new Client(apollo, setCsrfToken);
  }

  private constructor(
    apollo: ApolloClient<NormalizedCacheObject>,
    setCsrfToken: CsrfTokenSetter
  ) {
    this.apollo = apollo;
    this.setCsrfToken = setCsrfToken;
  }

  public async call<T, V = undefined>(
    doc: DocumentNode,
    variables?: V
  ): Promise<T> {
    const csrfToken = await this.getCsrfToken();
    this.setCsrfToken(csrfToken);

    const operationType = DocNodeAnalyzer.getOperationType(doc);
    switch (operationType) {
      case 'query':
        const queryRes = await this.apollo.query<ObjectOf<T>, V>({
          query: doc,
          variables,
        });
        return extractResData(doc, queryRes);
      case 'mutation':
        const fetchRes = await this.apollo.mutate<ObjectOf<T>, V>({
          mutation: doc,
          variables,
        });
        return extractResData(doc, fetchRes);
      default:
        throw new TypeError(`unsupported operationType: ${operationType}`);
    }
  }

  private async getCsrfToken(): Promise<string> {
    const doc = GET_CSRF_TOKEN_QUERY;
    const res = await this.apollo.query({ query: doc });
    return extractResData<string>(doc, res);
  }
}
