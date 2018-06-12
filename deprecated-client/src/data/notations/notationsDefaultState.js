import { BEGINNING_OF_EPOCH } from 'constants';

const notationsDefaultState = Object.freeze({
  index: {
    fetchedAt: BEGINNING_OF_EPOCH,
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
