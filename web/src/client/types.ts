import { DocumentNode } from 'graphql';

export interface StringSyncClient {
  call<T, V = undefined>(doc: DocumentNode, variables?: V): Promise<T>;
}

export type ObjectOf<T> = { [key: string]: T };
