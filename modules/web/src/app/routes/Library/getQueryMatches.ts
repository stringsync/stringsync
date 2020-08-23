import { QueryMatch } from './types';

export const getQueryMatches = (query: string, str: string): QueryMatch[] => {
  const ndx = str.indexOf(query);
  if (ndx < 0) {
    return [{ str, matches: false }];
  }

  const firstNonMatch = str.slice(0, ndx);
  const firstMatch = str.slice(ndx, ndx + query.length);
  const restNonMatch = str.slice(ndx + query.length);

  return [
    { str: firstNonMatch, matches: false },
    { str: firstMatch, matches: true },
    { str: restNonMatch, matches: false },
  ];
};
