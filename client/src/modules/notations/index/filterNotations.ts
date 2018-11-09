import { INotation } from '../../../@types/notation';
import { compact } from 'lodash';

export const filterNotations = (
  queryString: string,
  queryTags: string[],
  notations: INotation[]
): INotation[] => {
  const tags: string[] = queryTags.map((tag: string) => tag.toUpperCase());
  const str: string = queryString.toUpperCase();

  const queriedNotations = notations
    // On the first pass, filter the notations that match queryTags
    .filter((notation: INotation) => {
      const notationTags = new Set(notation.tags.map(tag => tag.toUpperCase()));
      // For a notation to match, it must have _every_ queryTag (and then maybe some others)
      return tags.every(queryTag => notationTags.has(queryTag));
    })
    // On the second pass, filter the notations that match queryString
    .filter((notation: INotation) => {

      const matchers = compact([
        notation.artistName.toUpperCase(),
        notation.songName.toUpperCase(),
        notation.transcriber && notation.transcriber.name.toUpperCase()
      ]);

      return matchers.some(matcher => matcher.includes(str));
    });

  return queriedNotations;
};
