import { times } from 'lodash';
import { INotation } from '../../../@types/notation';
import placeholderSrc from '../../../assets/notation_thumbnail_placeholder.jpg';

export const getNullNotations = (numNotations: number): INotation[] => {
  const now = new Date();

  return times(numNotations, ndx => ({
    id: ndx,
    createdAt: now,
    updatedAt: now,
    songName: '',
    artistName: '',
    durationMs: 0,
    deadTimeMs: 0,
    thumbnailUrl: placeholderSrc,
    bpm: 120,
    vextabString: '',
    tags: [],
    transcriber: null,
    video: null
  }));
};
