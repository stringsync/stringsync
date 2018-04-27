import { Note } from 'services';
import { Scale, ScaleDegree, scales } from './';

const CHROMATIC_DEGREES = Object.freeze(['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7']);
const KEYS = Note.ALL_LITERALS;

test('Scale factory', () => {
  KEYS.forEach(key => {
    Object.keys(scales).forEach(scale => {
      Scale.for(key, scale);
    });
  });
});
