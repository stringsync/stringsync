import { PagingType } from '@stringsync/common';
import {
  findNotationPageMaxQuery,
  findNotationPageMinQuery,
  findNotationPageQuery,
  FindNotationPageQueryArgs,
} from './findNotationPageQuery';

describe('findNotationPageQuery', () => {
  it.each<FindNotationPageQueryArgs>([
    { cursor: 1, pagingType: PagingType.FORWARD, limit: 10, tagIds: [], query: '%query%' },
    { cursor: 1, pagingType: PagingType.BACKWARD, limit: 10, tagIds: [], query: '%query%' },
    { cursor: 1, pagingType: PagingType.FORWARD, limit: 10, tagIds: [], query: null },
    { cursor: 1, pagingType: PagingType.BACKWARD, limit: 10, tagIds: null, query: '%query%' },
    { cursor: 1, pagingType: PagingType.FORWARD, limit: 10, tagIds: null, query: null },
  ])('runs without crashing', (args) => {
    expect(() => findNotationPageQuery(args)).not.toThrow();
    expect(() => findNotationPageMinQuery(args)).not.toThrow();
    expect(() => findNotationPageMaxQuery(args)).not.toThrow();
  });
});
