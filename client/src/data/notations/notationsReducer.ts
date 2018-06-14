import * as actions from './notationsActions';

export interface INotationsState {
  index: Notation.INotation[],
  show: Notation.INotation,
  edit: Notation.INotation
}

export const getInitialState = (): INotationsState => ({
  index: [],
  show: {
    id: -1,
    songName: '',
    artistName: '',
    durationMs: 1,
    deadTimeMs: 0,
    thumbnailUrl: '',
    bpm: 120,
    vextabString: ''
  },
  edit: {}
});
