const notationsDefaultState = Object.freeze({
  index: {
    fetchedAt: new Date(1970, 1, 1).getTime(),
    notations: []
  },
  show: {
    id: -1,
    attributes: {
      songName: '',
      artistName: '',
      durationMs: 1,
      deadTimeMs: 0,
      thumbnailUrl: '',
      bpm: 120,
      vextabString: '',
    },
    links: {
      self: ''
    },
    relationships: {
      tags: [],
      transcriber: null,
      video: null
    }
  },
  edit: {
    id: -1,
    attributes: {
      songName: '',
      artistName: '',
      durationMs: 1,
      deadTimeMs: 0,
      thumbnailUrl: '',
      bpm: 120,
      vextabString: '',
    },
    links: {
      self: ''
    },
    relationships: {
      tags: [],
      transcriber: null,
      video: null
    }
  },
});

export default notationsDefaultState;
