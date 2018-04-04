import { NotationState } from 'typings';

const notationsDefaultState: NotationState = Object.freeze({
  index: {
    fetchedAt: new Date(1970, 1, 1).getTime(),
    notations: []
  },
  show: {
    songName: '',
    artistName: '',
    durationMs: 1,
    deadTimeMs: 0,
    bpm: 120,
    vextabString: '',
    tags: [],
    transcriber: undefined
  },
  edit: {
    songName: '',
    artistName: '',
    durationMs: 1,
    deadTimeMs: 0,
    bpm: 120,
    vextabString: '',
    tags: [],
    transcriber: undefined
  }
});

export default notationsDefaultState;
