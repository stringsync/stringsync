const notationsDefaultState = Object.freeze({
  index: {
    fetchedAt: new Date(1970, 1, 1).getTime(),
    notations: []
  },
  show: {
    songName: '',
    artistName: '',
    durationMs: 1,
    deadTimeMs: 0,
    thumbnailUrl: '',
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
    thumbnailUrl: '',
    bpm: 120,
    vextabString: '',
    tags: [],
    transcriber: null
  }
});

export default notationsDefaultState;
