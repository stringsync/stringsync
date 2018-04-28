export const ALL_LITERALS = Object.freeze(['Ab', 'A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#']);

export const ALL_LITERALS_SET = Object.freeze(new Set(ALL_LITERALS));

export const SHARP_LITERALS = Object.freeze(['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']);

export const FLAT_LITERALS = Object.freeze(['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']);

export const NOTE_ALIASES = Object.freeze({
  'Ab': 'G#',
  'A': 'A',
  'A#': 'Bb',
  'Bb': 'A#',
  'B': 'B',
  'C': 'C',
  'C#': 'Db',
  'Db': 'C#',
  'D': 'D',
  'D#': 'Eb',
  'Eb': 'D#',
  'E': 'E',
  'F': 'F',
  'F#': 'Gb',
  'Gb': 'F#',
  'G': 'G',
  'G#': 'Ab'
});

export const VALUES_BY_LITERAL = Object.freeze({
  'A': 0,
  'A#': 1,
  'Bb': 1,
  'B': 2,
  'C': 3,
  'C#': 4,
  'Db': 4,
  'D': 5,
  'D#': 6,
  'Eb': 6,
  'E': 7,
  'F': 8,
  'F#': 9,
  'Gb': 9,
  'G': 10,
  'G#': 11,
  'Ab': 11,
});
