const notationsDefaultState = Object.freeze({
  index: [],
  show: {
    songName: '',
    artistName: '',
    durationMs: 1,
    deadTimeMs: 0,
    bpm: 120,
    vextabString: '',
    tags: [],
    transcriber: null
  },
  edit: {
    songName: '',
    artistName: '',
    durationMs: 1,
    deadTimeMs: 0,
    bpm: 120,
    vextabString: '',
    tags: [],
    transcriber: null
  }
});

export default notationsDefaultState;
