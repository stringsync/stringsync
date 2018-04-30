import { Note } from 'services';
import { Scale, ScaleDegree, scales } from './';
import { times, forOwn, sample, flatMap } from 'lodash';

const KEYS = Note.ALL_LITERALS;

const randomDegreeLiterals = () => {
  const scaleName = sample(Object.keys(scales));
  return scales[scaleName];
};

test('Scale.for', () => {
  KEYS.forEach(key => {
    forOwn(scales, (degreeLiterals, scaleName) => {
      const scale = Scale.for(key, scaleName);
      expect(scale.degrees).toHaveLength(degreeLiterals.length);
    });
  });
});

test('Scale.for with invalid scale names throws an error', () => {
  ['foo', 'bar', 'major', 'minor'].forEach(scaleName => {
    expect(() => Scale.for('A', scaleName)).toThrow();
  });
});

test('Scale.constructor sets the ScaleDegree scales to +this+', () => {
  const scale = Scale.for('A', 'chromatic');
  expect(scale.degrees).toHaveLength(12);

  scale.degrees.forEach(degree => {
    expect(degree.scale).toBe(scale);
  });
});

test('Scale.constructor creates a Note object from the key with an octave of 4', () => {
  Note.ALL_LITERALS.forEach(key => {
    const scale = new Scale(key, randomDegreeLiterals());
    expect(scale.key).toBeInstanceOf(Note);
    expect(scale.key.octave).toBe(4);
  });
});

test('Scale.prototype.notes', () => {
  // Arrays of Scale.for args, expectedNoteLiterals
  const cases = [
    ['C', 'chromatic', ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']],
    ['C', 'chromatic', ['C', 'Db', 'D', 'D#', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'A#', 'B']],
    ['C', 'ionian',    ['C', 'D', 'E', 'F', 'G', 'A', 'B']]
  ]

  cases.forEach(testCase => {
    const [key, scaleName, expectedNoteLiterals] = testCase;
    const scale = Scale.for(key, scaleName);

    const expectedNotes = expectedNoteLiterals.map(literal => new Note(literal, 1));
    const computedNotes = scale.notes();

    const expectedLiterals = expectedNotes.map(note => note.toSharp().literal);
    const computedLiterals = computedNotes.map(note => note.toSharp().literal);
    expect(computedLiterals).toEqual(expectedLiterals);
  });
});

test('Scale.prototype.notes accepts an array of octaves', () => {
  // Arrays of Scale.for args, note args, expectedNotes
  const cases = [
    [['C', 'chromatic'], [1, 2], ['C/1', 'C#/1', 'D/1', 'D#/1', 'E/1', 'F/1', 'F#/1', 'G/1', 'G#/1', 'A/2', 'A#/2', 'B/2', 'C/2', 'C#/2', 'D/2', 'D#/2', 'E/2', 'F/2', 'F#/2', 'G/2', 'G#/2', 'A/3', 'A#/3', 'B/3']],
    [['C', 'chromatic'], [1, 3], ['C/1', 'C#/1', 'D/1', 'D#/1', 'E/1', 'F/1', 'F#/1', 'G/1', 'G#/1', 'A/2', 'A#/2', 'B/2', 'C/3', 'C#/3', 'D/3', 'D#/3', 'E/3', 'F/3', 'F#/3', 'G/3', 'G#/3', 'A/4', 'A#/4', 'B/4']],
    [['C', 'ionian'], [1, 4, 6], ['C/1', 'D/1', 'E/1', 'F/1', 'G/1', 'A/2', 'B/2', 'C/4', 'D/4', 'E/4', 'F/4', 'G/4', 'A/5', 'B/5', 'C/6', 'D/6', 'E/6', 'F/6', 'G/6', 'A/7', 'B/7']]
  ];

  cases.forEach(testCase => {
    const [scaleForArgs, octaves, expectedNoteStrings] = testCase;
    const scale = Scale.for(...scaleForArgs);
    const noteStrings = scale.notes(octaves).map(note => note.toString());

    expect(noteStrings).toEqual(expectedNoteStrings);
  });
});
