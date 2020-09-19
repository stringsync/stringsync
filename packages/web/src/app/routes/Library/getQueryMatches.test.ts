import { getQueryMatches } from './getQueryMatches';
import { QueryMatch } from './types';

it.each<{ query: string; str: string; expectation: QueryMatch[] }>([
  {
    query: '',
    str: 'foo',
    expectation: [
      { str: '', matches: true },
      { str: 'foo', matches: false },
    ],
  },
  {
    query: 'f',
    str: 'foo',
    expectation: [
      { str: '', matches: false },
      { str: 'f', matches: true },
      { str: 'oo', matches: false },
    ],
  },
  {
    query: 'o',
    str: 'foo',
    expectation: [
      { str: 'f', matches: false },
      { str: 'o', matches: true },
      { str: 'o', matches: false },
    ],
  },
  {
    query: 'foof',
    str: 'foo',
    expectation: [{ str: 'foo', matches: false }],
  },
])('partitions the first match in the string', (t) => {
  const queryMatches = getQueryMatches(t.query, t.str);
  expect(queryMatches).toStrictEqual(t.expectation);
});
