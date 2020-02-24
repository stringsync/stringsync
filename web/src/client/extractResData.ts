import { DocumentNode } from 'graphql';
import { ApolloQueryResult, FetchResult } from 'apollo-boost';
import { DocNodeAnalyzer } from './DocNodeAnalyzer';
import { ObjectOf } from './types';

export const extractResData = <T>(
  doc: DocumentNode,
  res: ApolloQueryResult<ObjectOf<T>> | FetchResult<ObjectOf<T>>
): T => {
  if (!res.data) {
    throw new Error(`no data returned for ${JSON.stringify(doc)}`);
  }
  const resolverName = DocNodeAnalyzer.getResolverName(doc);
  return res.data[resolverName];
};
