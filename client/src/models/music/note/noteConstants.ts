export const ALL_LITERALS = Object.freeze(['Ab', 'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#']);

export const ALL_LITERALS_SET = Object.freeze(new Set(ALL_LITERALS));

export const SHARP_LITERALS = Object.freeze(['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']);

export const FLAT_LITERALS = Object.freeze(['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']);

export const NOTE_ALIASES = Object.freeze({
  'A': 'A',
  'A#': 'Bb',
  'Ab': 'G#',
  'B': 'B',
  'Bb': 'A#',
  'C': 'C',
  'C#': 'Db',
  'D': 'D',
  'D#': 'Eb',
  'Db': 'C#',
  'E': 'E',
  'Eb': 'D#',
  'F': 'F',
  'F#': 'Gb',
  'G': 'G',
  'G#': 'Ab',
  'Gb': 'F#'
});

export const VALUES_BY_LITERAL = Object.freeze({
  'A': 0,
  'A#': 1,
  'Ab': 11,
  'B': 2,
  'Bb': 1,
  'C': 3,
  'C#': 4,
  'D': 5,
  'D#': 6,
  'Db': 4,
  'E': 7,
  'Eb': 6,
  'F': 8,
  'F#': 9,
  'G': 10,
  'G#': 11,
  'Gb': 9
});
