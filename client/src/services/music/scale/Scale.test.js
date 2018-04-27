import { Note } from 'services';
import { Scale, ScaleDegree } from './';

const CHROMATIC_DEGREES = Object.freeze(['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']);
const KEYS = Note.ALL_LITERALS;

test('Scale factory functions', () => {
  KEYS.forEach(key => {
    Scale.chromatic(key);
    Scale.ionian(key);
    Scale.dorian(key);
    Scale.phrygian(key);
    Scale.lydian(key);
    Scale.mixolydian(key);
    Scale.aeolian(key);
    Scale.locrian(key);
  });
});
