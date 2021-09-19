import { Pitch } from './Pitch';
import { PitchAccidental, PitchName } from './types';

describe('Note', () => {
  describe('fromString', () => {
    it('parses natural notes', () => {
      const note = Pitch.fromString('E5');
      expect(note.name).toBe(PitchName.E);
      expect(note.accidental).toBe(PitchAccidental.Natural);
      expect(note.octave).toBe(5);
    });

    it('parses octaves past 9', () => {
      const note = Pitch.fromString('C10');
      expect(note.name).toBe(PitchName.C);
      expect(note.accidental).toBe(PitchAccidental.Natural);
      expect(note.octave).toBe(10);
    });

    it('parses sharp notes', () => {
      const note = Pitch.fromString('C#1');
      expect(note.name).toBe(PitchName.C);
      expect(note.accidental).toBe(PitchAccidental.Sharp);
      expect(note.octave).toBe(1);
    });

    it('parses double sharp notes', () => {
      const note = Pitch.fromString('B##2');
      expect(note.name).toBe(PitchName.B);
      expect(note.accidental).toBe(PitchAccidental.DoubleSharp);
      expect(note.octave).toBe(2);
    });

    it('parses flat notes', () => {
      const note = Pitch.fromString('Bb5');
      expect(note.name).toBe(PitchName.B);
      expect(note.accidental).toBe(PitchAccidental.Flat);
      expect(note.octave).toBe(5);
    });

    it('parses double flat notes', () => {
      const note = Pitch.fromString('Bbb5');
      expect(note.name).toBe(PitchName.B);
      expect(note.accidental).toBe(PitchAccidental.DoubleFlat);
      expect(note.octave).toBe(5);
    });

    it('does not parse invalid note names', () => {
      expect(() => Pitch.fromString('H#1')).toThrow();
    });

    it('does not parse invalid accidentals', () => {
      expect(() => Pitch.fromString('B#b4')).toThrow();
    });

    it('does not parse invalid octaves', () => {
      expect(() => Pitch.fromString('B1.2')).toThrow();
    });
  });
});
