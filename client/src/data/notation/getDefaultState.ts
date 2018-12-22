import { INotation } from '../../@types/notation';

export const getDefaultState = (): INotation => ({
  artistName: '',
  bpm: 120,
  createdAt: new Date(1970, 1, 1),
  deadTimeMs: 0,
  durationMs: 0,
  id: -1,
  songName: '',
  tags: [],
  thumbnailUrl: '',
  transcriber: null,
  updatedAt: new Date(1970, 1, 1),
  vextabString: '',
  video: null
});
