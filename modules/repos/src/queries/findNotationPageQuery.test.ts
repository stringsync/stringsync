import { findNotationPageQuery, FindNotationpageQueryArgs } from './findNotationPageQuery';
import { PagingType } from '@stringsync/common';

it.each<FindNotationpageQueryArgs>([
  { cursor: 1, pagingType: PagingType.FORWARD, limit: 10, tagIds: [], query: '%query%' },
  { cursor: 1, pagingType: PagingType.BACKWARD, limit: 10, tagIds: [], query: '%query%' },
])('runs without crashing', (args) => {
  expect(() => findNotationPageQuery(args)).not.toThrow();
});
