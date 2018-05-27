import { Note } from './';
import { forOwn, shuffle, times } from 'lodash';

const FLAT_NOTES    = Object.freeze(['Bb', 'Db', 'Eb', 'Gb', 'Ab']);
const NATURAL_NOTES = Object.freeze(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
const SHARP_NOTES   = Object.freeze(['A#', 'C#', 'D#', 'F#', 'G#']);
const ALL_NOTES = Object.freeze(['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab']);

const randomOctave = (max = 1000) => {
  const sign = Math.random() > 0.5 ? 1 : -1;
  return Math.floor(Math.random() * max) * sign;
};

test('Note.constructor allows all valid note literals', () => {
  ALL_NOTES.forEach(literal => {
    const note = new Note(literal, 1);
    expect(note.literal).toBe(literal);
  });
}); 

test('Note.constructor disallows phony note literals', () => {
  ['J#', 'AQ', 'Bbb', 'D$'].forEach(literal => {
    expect(() => new Note(literal, 1)).toThrow();
  })
});

test('Note.constructor allows integer octaves', () => {
  [-1, -1.0, 0, 1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER].forEach(octave => {
    const note = new Note('A', octave);
    expect(note.octave).toBe(octave);
  })
});

test('Note.constructor disallows non integer octaves', () => {
  [1.001, 2.3, -1.243, 23.000000000001].forEach(octave => {
    expect(() => new Note('A', octave)).toThrow();
  });
});

test('Note.prototype.isFlat', () => {
  FLAT_NOTES.forEach(literal => expect(new Note(literal, 1).isFlat).toBe(true));
  [...NATURAL_NOTES, ...SHARP_NOTES].forEach(literal => expect(new Note(literal, 1).isFlat).toBe(false));
});

test('Note.prototype.isNatural', () => {
  NATURAL_NOTES.forEach(literal => expect(new Note(literal, 1).isNatural).toBe(true));
  [...FLAT_NOTES, ...SHARP_NOTES].forEach(literal => expect(new Note(literal, 1).isNatural).toBe(false));
});

test('Note.prototype.isSharp', () => {
  SHARP_NOTES.forEach(literal => expect(new Note(literal, 1).isSharp).toBe(true));
  [...FLAT_NOTES, ...NATURAL_NOTES].forEach(literal => expect(new Note(literal, 1).isSharp).toBe(false));
});

test('Note.prototype.isEquivalent', () => {
  // Arrays of arguments that should return true or false when isEquivalent is called on the
  // corresponding note objects. The last memeber is the expect value.
  const cases = [
    [['A' , 1], ['A' , 1], true],
    [['A#', 1], ['Bb', 1], true],
    [['Db', 1], ['C#', 1], true],
    [['A' , 1], ['A' , 2], false],
    [['A#', 1], ['Gb', 1], false],
    [['Db', 1], ['D' , 1], false]
  ];

  cases.forEach(args => {
    const [args1, args2, expectation] = args;
    const note1 = new Note(...args1);
    const note2 = new Note(...args2);
    expect(note1.isEquivalent(note2)).toBe(expectation);
    expect(note2.isEquivalent(note1)).toBe(expectation);

    expect(note1.isEquivalent(note1)).toBe(true);
    expect(note2.isEquivalent(note2)).toBe(true);
  });
});

test('Note.prototype.alias', () => {
  forOwn(Note.NOTE_ALIASES, (aliasLiteral, literal) => {
    const note = new Note(literal, 1);
    const alias = note.alias;
    expect(alias).not.toBe(note);
    expect(alias.literal).toBe(aliasLiteral);
    expect(alias.octave).toBe(note.octave);
  })
});

test('Note.prototype.clone', () => {
  ALL_NOTES.forEach(literal => {
    const note = new Note(literal, 1);
    const clone = note.clone;

    expect(note).not.toBe(clone);
    expect(clone.literal).toBe(note.literal);
    expect(clone.octave).toBe(note.octave);
  })
});

test('Note.prototype.toString', () => {
  const cases = ALL_NOTES.map(literal => [literal, randomOctave()])

  cases.forEach(args => {
    const note = new Note(...args);
    expect(note.toString()).toBe(`${note.literal}/${note.octave}`);
  });
});

test('Note.prototype.toFlat', () => {
  FLAT_NOTES.forEach(literal => {
    const note = new Note(literal, 1);
    const flatNote = note.toFlat();

    expect(note).not.toBe(flatNote);
    expect(note.isEquivalent(flatNote)).toBe(true);
    expect(flatNote.isEquivalent(note)).toBe(true);
  });

  SHARP_NOTES.forEach(literal => {
    const note = new Note(literal, 1);
    const flatNote = note.toFlat();

    expect(note).not.toBe(flatNote);
    expect(note.isEquivalent(flatNote)).toBe(true);
    expect(flatNote.isEquivalent(note)).toBe(true);
  });
});

test('Note.prototype.toSharp', () => {
  SHARP_NOTES.forEach(literal => {
    const note = new Note(literal, 1);
    const sharpNote = note.toSharp();

    expect(note).not.toBe(sharpNote);
    expect(note.isEquivalent(sharpNote)).toBe(true);
    expect(sharpNote.isEquivalent(note)).toBe(true);
  });

  SHARP_NOTES.forEach(literal => {
    const note = new Note(literal, 1);
    const sharpNote = note.toSharp();

    expect(note).not.toBe(sharpNote);
    expect(note.isEquivalent(sharpNote)).toBe(true);
    expect(sharpNote.isEquivalent(note)).toBe(true);
  });
});

test('Note.prototype.step', () => {
  // Arrays of args, numHalfSteps, and expected 'args'
  const cases = [
    [['A' , 1], 1 , ['A#', 1]],
    [['A' , 1], 0 , ['A' , 1]],
    [['A' , 1], 12, ['A' , 2]],
    [['A' , 5], 6 , ['D#', 5]],
    [['G#', 3], 11, ['G' , 4]],
    [['Ab', 6], 13, ['A' , 8]]
  ]

  cases.forEach(testCase => {
    const [args, numHalfSteps, expectedArgs] = testCase;

    const note = new Note(...args);
    const steppedNote = note.step(numHalfSteps);
    const expectedNote = new Note(...expectedArgs);

    expect(note).not.toBe(steppedNote);
    expect(steppedNote.isEquivalent(expectedNote)).toBe(true);
  })
});

test('Note.prototype.step numHalfSteps parameter defaults to 1', () => {
  const literals = ALL_NOTES.filter(literal => {
    const note = new Note(literal, 1);
    return note.isSharp || note.isNatural;
  });

  const cases = literals.map(literal => [literal, randomOctave()]);

  cases.forEach((args, ndx) => {
    const [literal, octave] = args;
    const note = new Note(literal, octave);
    const steppedNote = note.step();
    expect(steppedNote).not.toBe(note);

    const expectedLiteral = literals[(ndx + 1) % literals.length];
    const expectedOctave = octave + (ndx === (cases.length - 1) ? 1 : 0);

    expect(steppedNote.literal).toBe(expectedLiteral);
    expect(steppedNote.octave).toBe(expectedOctave);
  });
});

test('Note.prototype.value is backed by Note.VALUES_BY_LITERAL', () => {
  forOwn(Note.VALUES_BY_LITERAL, (value, literal) => {
    const octave = Math.floor(Math.random() * 100);
    const note = new Note(literal, octave);
    expect(note.value).toBe(value);
  });
});

test('Note.sort', () => {
  const sortedLiterals = ALL_NOTES;
  const shuffledNotes = shuffle(sortedLiterals).map(literal => new Note(literal, 1));
  const sortedNotes = Note.sort(shuffledNotes);

  expect(sortedNotes.map(note => note.literal)).toEqual(sortedLiterals);
});

test('Note.sort respects octaves', () => {
  const notes = times(8, ndx => new Note('C', ndx));
  const sortedNoteStrings = notes.map(note => note.toString());
  const shuffledNotes = shuffle(notes);

  expect(Note.sort(shuffledNotes).map(note => note.toString())).toEqual(sortedNoteStrings);
});

test('Note.prototype.compare', () => {
  // Arrays of caller args, parameter args, expectation
  const cases = [
    [['C', 0], ['C', 0], 0],
    [['C', 0], ['C#', 0], -1],
    [['C#', 0], ['C', 0], 1],
    [['A', 19], ['A', 20], -1],
    [['Gb', 0], ['F#', 0], 0]
  ];

  cases.forEach(testCase => {
    const [args1, args2, expectation] = testCase;
    const note1 = new Note(...args1);
    const note2 = new Note(...args2);
    expect(note1.compare(note2)).toBe(expectation);
  });
});